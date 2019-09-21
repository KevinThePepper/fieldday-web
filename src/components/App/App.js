import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';

import NavigationBar from '../NavigationBar/NavigationBar';
import NavigationDrawer from '../NavigationDrawer/NavigationDrawer';
import AppSwitch from '../AppSwitch/AppSwitch';
import { APIProvider } from '../APIContext/APIContext';
import { AuthProvider } from '../AuthContext/AuthContext';

const styles = theme => ({
  root: {
    minHeight: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  content: {
    marginTop: 64,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#8c1d40',
    },
    secondary: {
      main: '#ffc627',
    },
  },
});

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <APIProvider>
          <AuthProvider>
            <MuiThemeProvider theme={theme}>
              <div className={classes.root}>
                <NavigationBar />
                <NavigationDrawer />
                <main className={classes.content}>
                  <AppSwitch />
                </main>
              </div>
            </MuiThemeProvider>
          </AuthProvider>
        </APIProvider>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
