import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import APIService from '../APIService/APIService';
import moment from 'moment';

const styles = {
  container: {
    marginBottom: 20,
    padding: `10px 20px`,
  },
  detailHeader: {
    marginTop: 10,
    fontSize: 26,
  },
  detailLine: {
    fontSize: 14,
  },
  detailTitle: {
    fontWeight: 700,
  },
};


export default withStyles(styles)(
  class SessionDetailCard extends Component {
    apiService = new APIService();

    constructor(props) {
      super(props);
      this.state = {
        edit: false,
        date: null
      };
      this.buttonClick = this.buttonClick.bind(this);
      this.onCalendarChange = this.onCalendarChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
    };

    buttonClick = () => {
      if(this.state.edit === true){
        this.setState({
          edit: false
        });
      } else {
        this.setState({
          edit: true
        });
      }
    };

    onCalendarChange = async event => {
      let row = this.props.row;
      let newDate = moment(new Date(event.target.value)).format('YYYY/MM/DD HH:mm');
      row.session['date_modified'] = Math.round(new Date(event.target.value) / 1000);
      row['Date/Time'] = newDate;
      this.setState({
          date: newDate
      });
    };

    onSubmit = async () => {
      try {
        await this.apiService.putSession(this.props.row.session);
        this.setState({
          edit: false
        });
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    };

    render() {
      const { classes, title, row } = this.props;

      return (
        <Paper className={classes.container}>
          <h3 className={classes.detailHeader}>{`${title} - Entry ${row['Session ID']}`}</h3>
          {Object.entries(row).map((entry, index) => {
            return typeof entry[1] !== 'object' ? (
              <p className={classes.detailLine} key={index}>
                <span className={classes.detailTitle}>{`${entry[0]}: `}</span>
                {entry[0] !== "Date/Time" && entry[1]}
                {entry[0] === "Date/Time" && this.state.edit === false &&
                  (this.state.date !== null ? this.state.date : entry[1])}
                {entry[0] === "Date/Time" && this.state.edit === true &&
                  <input type={"datetime-local"}
                      onChange={e => this.onCalendarChange(e)}
                      defaultValue={moment(entry[1]).local().format('YYYY-MM-DDTHH:mm:ss.SSS')}
                  />}
              </p>
            ) : null
          })}
          <button onClick={this.buttonClick}>
            {this.state.edit === true && `Cancel`}
            {this.state.edit === false && `Edit`}
          </button>
          {this.state.edit === true ? <button onClick={this.onSubmit}>Submit</button> : ``}
        </Paper>
      );
    }
  }
);
