import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import APIService from '../APIService/APIService';

import { AuthContext } from '../AuthContext/AuthContext';
import { APIContext } from '../APIContext/APIContext';


const styles = theme => ({
  root: {
    marginBottom: 20,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class DataFormTable extends React.Component {
  apiService = new APIService();

  onRowUpdate = (newData, oldData) => {
    console.log('oldData', oldData);
    const { putEntry, refetch, moveEntry } = this.props;

    return new Promise(async (resolve, reject) => {
      const answers = JSON.parse(newData.entry.entry_json);

      answers.forEach((f, i) => {
        const key = Object.keys(f)[0];

        let value = newData[key];
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        if (value === 'N/A') value = null;
        answers[i] = { [key]: value };
      });

      const entryCopy = JSON.parse(JSON.stringify(newData.entry));
      const new_session_id = parseInt(newData['Session ID']);
      entryCopy.date_modified = Math.round(Date.now() / 1000);
      entryCopy.entry_id = Math.round(new Date(newData["Date/Time"]) / 1000);
      entryCopy.entry_json = answers;

      try {
        if (!isNaN(new_session_id) && entryCopy.session_id !== new_session_id) {
          entryCopy.session_id = new_session_id;
          await moveEntry(parseInt(oldData['Session ID']), oldData.entry.entry_id, new_session_id);
        } else if (entryCopy.entry_id !== oldData.entry.entry_id){
          await this.apiService.deleteEntry(oldData.entry.session_id, oldData.entry.entry_id);
          await this.apiService.postEntry(entryCopy);
        } else {
          await putEntry(entryCopy);
        }
        refetch(true);
        resolve();
      } catch (err) {
        console.error(err);
        reject();
      }
    });
  };

  onRowDelete = oldData => {
    const { deleteEntry, refetch } = this.props;

    return new Promise(async (resolve, reject) => {
      try {
        await deleteEntry(oldData.entry.session_id, oldData.entry.entry_id);
        refetch(true);
        resolve();
      } catch (err) {
        console.error(err);
        reject();
      }
    });
  };


  render() {
    const { classes, form, fields, rows, access_level } = this.props;

    rows.forEach(row => {
      fields.forEach(field => {
        if (typeof row[field.prompt] === 'object') {
          row[field.prompt] = 'N/A';
        }
      });
    });

    return (
      <Paper className={classes.root}>
        <MaterialTable
          columns={fields.map(f => ({ title: f.prompt, field: f.prompt, readonly: !!f.readonly }))}
          data={rows}
          title={form.form_name + ' - Entries'}
          options={{
            columnsButton: true,
            emptyRowsWhenPaging: false,
            exportButton: true,
            filtering: true,
            paging: true,
            pageSize: 15,
            pageSizeOptions: [15, 50, 100, rows.length],
          }}
          editable={
            access_level === 1
              ? {
                  onRowUpdate: this.onRowUpdate,
                  onRowDelete: this.onRowDelete,
                }
              : undefined
          }
          color="primary"
        />
      </Paper>
    );
  }
}

DataFormTable.propTypes = {
  classes: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  rows: PropTypes.array.isRequired,
};

export default withStyles(styles)(props => (
  <AuthContext.Consumer>
    {({ access_level }) => (
      <APIContext.Consumer>
        {({ putEntry, deleteEntry, moveEntry }) => (
          <DataFormTable
            {...props}
            putEntry={putEntry}
            deleteEntry={deleteEntry}
            moveEntry={moveEntry}
            access_level={access_level}
          />
        )}
      </APIContext.Consumer>
    )}
  </AuthContext.Consumer>
));
