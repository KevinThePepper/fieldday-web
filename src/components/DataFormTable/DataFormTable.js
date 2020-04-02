import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import moment from 'moment';
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

  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      selectedDate: null,
      selectedEntry: null,
      newDate: null
    };
    this.onRowUpdate = this.onRowUpdate.bind(this);
    this.onCalendarChange = this.onCalendarChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  };

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
      entryCopy.entry_json = answers;
      entryCopy.date_modified = Math.round(Date.now() / 1000);

      const new_session_id = parseInt(newData['Session ID']);

      try {
        if (!isNaN(new_session_id) && entryCopy.session_id !== new_session_id) {
          entryCopy.session_id = new_session_id;
          await moveEntry(parseInt(oldData['Session ID']), oldData.entry.entry_id, new_session_id);
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

  handleClick = (e, prompt, entry) => {
    e.preventDefault();
    if (!isNaN(new Date(prompt))) {
      let date = new Date(prompt);
      this.setState({
        edit: true,
        selectedDate: date,
        selectedEntry: entry
      });
    }
  };

  onCalendarChange = async event => {
    this.setState({
      newDate: event.target.value
    });
  };

  cancelEvent = () => {
    this.setState({
      edit: false,
      selectedDate: null,
      selectedEntry: null,
      newDate: null
    });
  };

  onSubmit = async event => {
    event.preventDefault();
    let date = this.state.newDate;
    if(!isNaN(new Date(date))) {
      let entry = this.state.selectedEntry;
      entry["Date/Time"] = moment(new Date(date)).format('YYYY/MM/DD HH:mm');
      entry.entry.date_modified = Math.round(new Date(date) / 1000);
      try {
        await this.apiService.putEntry(entry.entry);
        this.setState({
          edit: false,
          selectedDate: null,
          selectedEntry: null,
          newDate: null
        });
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
  };

  render() {
    const { classes, form, fields, rows, access_level } = this.props;

    rows.forEach(row => {
      fields.forEach(field => {
        if (field.prompt === 'Date/Time') {
          if (this.state.edit === false) {
            let date = row[field.prompt];
            row[field.prompt] =
              <a href="#" onClick={(e) => this.handleClick(e, date, row)}>
                {date}
              </a>
          } else {
            if (row.entry === this.state.selectedEntry.entry) {
              let date = moment(this.state.selectedDate).local().format('YYYY-MM-DDTHH:mm:ss.SSS');
              row[field.prompt] =
                <div>
                  <input type={"datetime-local"}
                         defaultValue={date}
                         onChange={this.onCalendarChange}
                  />
                  <button onClick={this.onSubmit}>Submit</button>
                  <button onClick={this.cancelEvent}>Cancel</button>
                </div>
            }
          }
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
            access_level === 2
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
