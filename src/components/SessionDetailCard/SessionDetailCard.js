import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import DateTimePicker from 'react-datetime-picker';
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
        session: null,
        date: null
      };
      this.buttonClick = this.buttonClick.bind(this);
      this.onCalendarChange = this.onCalendarChange.bind(this);
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

    onCalendarChange = async date => {
      let row = this.props.row;
      let newDate = moment(new Date(date)).format('YYYY/MM/DD HH:mm');
      row.session['date_modified'] = Math.round(date / 1000);
      row['Date/Time'] = newDate;

      try {
        await this.apiService.putSession(row.session);
        this.setState({
          edit: false,
          date: newDate
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
                  <DateTimePicker
                      onChange={this.onCalendarChange}
                      value={new Date(entry[1])}
                  />}
              </p>
            ) : null
          })}
          <button onClick={this.buttonClick}>
            {this.state.edit === true && `Cancel`}
            {this.state.edit === false && `Edit`}
          </button>
        </Paper>
      );
    }
  }
);
