import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import DataFormTable from '../DataFormTable/DataFormTable';

import { APIContext } from '../APIContext/APIContext';

class DataFormViewPage extends Component {
  state = {
    rows: [],
    form: null,
  };

  componentDidMount() {
    this.getRows();
  }

  componentDidUpdate() {
    this.getRows();
  }

  getRows = async (force = false) => {
    const { dataForms, match, getEntries, project_id, getProjectName, getAnswerSet } = this.props;
    const { form } = this.state;
    const newForm = dataForms.find(f => '' + f.form_id === match.params.form_id);

    if (force || !form || form.form_id !== newForm.form_id) {
      try {
        const entries = await getEntries(project_id, newForm.form_id);

        const hasSpeciesCode = (process.env.REACT_APP_BATEMAN_BUILD === 'true') 
          && JSON.parse(newForm.template_json)
              .fields
              .some(f => {return (f.prompt === "Species Code");});

        const speciesAnswerSet = hasSpeciesCode 
           && JSON.parse(getAnswerSet(getProjectName(project_id) + newForm.form_name + "Species").answers);
           
        const rows = entries
          .sort((e1, e2) => e2.entry_id - e1.entry_id)
          .map(entry => {
            const entry_json = JSON.parse(entry.entry_json);
            const row = entry_json.reduce((a, c) => ({ ...a, ...c }), {});
            for (const property in row) {
              if (row.hasOwnProperty(property)) {
                if (typeof row[property] === 'boolean') {
                  row[property] = row[property].toString();
                } else if (row[property] === null) {
                  row[property] = 'N/A';
                }
              }
            }
            row['Date/Time'] = moment(new Date(entry.entry_id * 1000)).format('YYYY/MM/DD HH:mm');
            row['Year'] = moment(new Date(entry.entry_id * 1000)).format('YYYY');
            row['Session ID'] = entry.session_id;
            if (process.env.REACT_APP_BATEMAN_BUILD === 'true') {
              const session = JSON.parse(entry.session_json);
              const site = session.find(f => Object.keys(f)[0] === 'Site');
              if (site) row['Site'] = site['Site'];
              const array = session.find(f => Object.keys(f)[0] === 'Array');
              if (array) row['Array'] = array['Array'];
              if(hasSpeciesCode) {
                const species = speciesAnswerSet.find(s => {return (s.primary === row['Species Code']);});
                row.Taxa = newForm.form_name;
                if(species) {
                  row.Genus = species.secondary.Genus;
                  row.Species = species.secondary.Species;
                }else {
                  row.Genus = 'unknown';
                  row.Species = 'unknown';
                }
              }
            }
            row.entry = entry;

            return row;
          });

        this.setState({ rows, form: newForm });
      } catch (err) {
        console.error(err);
      }
    }
  };

  render() {
    const { dataForms, match, history } = this.props;
    const form = dataForms.find(form => '' + form.form_id === match.params.form_id);
    if (form) {
      const { rows } = this.state;
      const template = JSON.parse(form.template_json);
      const fields = template.fields.filter(f => f.type !== 'HIST_BUTTON');
      const hasSpeciesCode = (process.env.REACT_APP_BATEMAN_BUILD === 'true') 
      && JSON.parse(form.template_json)
             .fields
             .some(f => {return (f.prompt === "Species Code");});
      process.env.REACT_APP_BATEMAN_BUILD === 'true' &&
        fields.unshift({ prompt: 'Array', readonly: true });
      process.env.REACT_APP_BATEMAN_BUILD === 'true' &&
        fields.unshift({ prompt: 'Site', readonly: true });
      fields.unshift({ prompt: 'Session ID' });
      fields.unshift({ prompt: 'Date/Time', readonly: true });
      fields.unshift({ prompt: 'Year', readonly: true });
      if(hasSpeciesCode) {
        const sppIndex = fields.findIndex(f => {return (f.prompt === 'Species Code');});
        fields.splice(sppIndex+1,0,{ prompt: 'Genus', readonly: true },{ prompt: 'Species', readonly: true });
        fields.splice(sppIndex,0, { prompt: 'Taxa', readonly: true });
      }
      return <DataFormTable form={form} fields={fields} rows={rows} refetch={this.getRows} />;
    } else {
      history.push('/not-found');
      return null;
    }
  }
}

export default withRouter(props => (
  <APIContext.Consumer>
    {apiProps => <DataFormViewPage {...props} {...apiProps} />}
  </APIContext.Consumer>
));
