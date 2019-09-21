import axios from 'axios';

const SERVER_ADDRESS_KEY = 'REACT_APP_DB_SERVER_ADDRESS';
export default class APIService {
  BASE_URL = (process.env.hasOwnProperty(SERVER_ADDRESS_KEY)) ?
    (process.env[SERVER_ADDRESS_KEY] + "/api/v2") :
    ('http://localhost:8000/api/v2');

  // DataForm

  getDataForms = async project_id => {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/data_form${project_id ? `?project_id=${project_id}` : ''}`
      );

      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  getDataForm = async form_id => {
    try {
      const response = await axios.get(`${this.BASE_URL}/data_form/${form_id}`);

      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  postDataForm = async (form, project_id) => {
    try {
      await axios.post(`${this.BASE_URL}/data_form?project_id=${project_id}`, form);
    } catch (err) {
      console.error(err);
    }
  };

  putDataForm = async form => {
    try {
      await axios.put(`${this.BASE_URL}/data_form/${form.form_id}`, form);
    } catch (err) {
      console.error(err);
    }
  };

  deleteDataForm = async form_id => {
    try {
      await axios.delete(`${this.BASE_URL}/data_form/${form_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  // AnswerSet

  getAnswerSets = async () => {
    try {
      const response = await axios.get(`${this.BASE_URL}/answer_set`);

      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  getAnswerSet = async set_name => {
    try {
      const response = await axios.get(`${this.BASE_URL}/answer_set/${set_name}`);

      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  postAnswerSet = async set => {
    try {
      await axios.post(`${this.BASE_URL}/answer_set`, set);
    } catch (err) {
      console.error(err);
    }
  };

  putAnswerSet = async set => {
    try {
      await axios.put(`${this.BASE_URL}/answer_set/${set.set_name}`, set);
    } catch (err) {
      console.error(err);
    }
  };

  deleteAnswerSet = async set_name => {
    try {
      await axios.delete(`${this.BASE_URL}/answer_set/${set_name}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Project

  getProjects = async () => {
    try {
      const response = await axios.get(`${this.BASE_URL}/project`);

      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  getProject = async project_id => {
    try {
      const response = await axios.get(`${this.BASE_URL}/project/${project_id}`);

      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  postProject = async project => {
    try {
      await axios.post(`${this.BASE_URL}/project`, project);
    } catch (err) {
      console.error(err);
    }
  };

  putProject = async project => {
    try {
      await axios.put(`${this.BASE_URL}/project/${project.project_id}`, project);
    } catch (err) {
      console.error(err);
    }
  };

  deleteProject = async project_id => {
    try {
      await axios.delete(`${this.BASE_URL}/project/${project_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  // DataEntry

  getEntries = async (project_id, form_id, session_id) => {
    let query = '';
    if (project_id || form_id || session_id) {
      query += '?';

      if (project_id) {
        query = `${query}project_id=${project_id}&`;
      }

      if (form_id) {
        query = `${query}form_id=${form_id}&`;
      }

      if (session_id) {
        query = `${query}session_id=${session_id}&`;
      }
    }

    try {
      const response = await axios.get(`${this.BASE_URL}/data_entry${query}`);

      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  getEntry = async entry_id => {
    try {
      const response = await axios.get(`${this.BASE_URL}/data_entry/${entry_id}`);

      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  postEntry = async entry => {
    try {
      await axios.post(`${this.BASE_URL}/data_entry`, entry);
    } catch (err) {
      console.error(err);
    }
  };

  putEntry = async entry => {
    try {
      await axios.put(`${this.BASE_URL}/data_entry/${entry.session_id}/${entry.entry_id}`, entry);
    } catch (err) {
      console.error(err);
    }
  };

  deleteEntry = async (session_id, entry_id) => {
    try {
      await axios.delete(`${this.BASE_URL}/data_entry/${session_id}/${entry_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Session

  getSessions = async (project_id, form_id) => {
    let query = '';
    if (project_id || form_id) {
      query += '?';

      if (project_id) {
        query = `${query}project_id=${project_id}&`;
      }

      if (form_id) {
        query = `${query}form_id=${form_id}&`;
      }
    }

    try {
      const response = await axios.get(`${this.BASE_URL}/session${query}`);

      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  sessionExists = async session_id => {
    try {
      const response = await axios.get(`${this.BASE_URL}/session/${session_id}`);

      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  getSession = async session_id => {
    try {
      const response = await axios.get(`${this.BASE_URL}/session/${session_id}`);
      return response.data;
    } catch (err) {
      return undefined;
    }
  };

  postSession = async session => {
    try {
      await axios.post(`${this.BASE_URL}/session`, session);
    } catch (err) {
      console.error(err);
    }
  };

  putSession = async session => {
    try {
      await axios.put(`${this.BASE_URL}/session/${session.session_id}`, session);
    } catch (err) {
      console.error(err);
    }
  };

  deleteSession = async session_id => {
    try {
      await axios.delete(`${this.BASE_URL}/session/${session_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  moveEntry = async (session_id, entry_id, new_id) => {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/data_entry/${session_id}/${entry_id}/move?new_id=${new_id}`,
        {}
      );
      return response;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  login = async credentials => {
    try {
      const response = await axios.post(`${this.BASE_URL}/login/`, credentials);
      return response;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
}
