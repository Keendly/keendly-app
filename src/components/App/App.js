import React, {Component} from 'react';

import Home from '../Home';
import Settings from '../Settings';
import Deliveries from '../Deliveries';
import Subscriptions from '../Subscriptions';
import Login, {LoginCallback} from '../Login';

import {BrowserRouter as Router, Route} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PrivateRoute from './PrivateRoute';

import './App.css';

const URL = process.env.NODE_ENV === 'development'
  ? 'https://fmip59w73h.execute-api.eu-west-1.amazonaws.com/dev'
  : 'https://m1ndoce0cl.execute-api.eu-west-1.amazonaws.com/v1';

const AUTH_KEY = 'k33ndly_535510n';

const getToken = () => {
  return localStorage.getItem (AUTH_KEY);
};

const logOut = () => {
  localStorage.removeItem (AUTH_KEY);
};

class App extends Component {
  constructor (props) {
    super (props);
    this.state = {
      loggedIn: false,
      userProfile: null,
    };

    this.setUserProfile = this.setUserProfile.bind (this);
    this.logIn = this.logIn.bind (this);
  }

  componentWillMount () {
    if (getToken ()) {
      this.loadUserProfile ();
    }
  }

  loadUserProfile () {
    fetch (URL + '/users/self', {
      headers: {
        Authorization: getToken (),
      },
    })
      .then (response => response.json ())
      .then (json => {
        this.setState ({
          userProfile: json,
          loggedIn: true,
        });
      })
      .catch (error => {
        localStorage.removeItem (AUTH_KEY);
        window.location.replace ('login');
      });
  }

  setUserProfile (userProfile) {
    this.setState ({
      userProfile: userProfile,
    });
  }

  logIn (token) {
    localStorage.setItem (AUTH_KEY, token);
    this.loadUserProfile ();
  }

  render () {
    return (
      <MuiThemeProvider>
        <Router>
          <div className="Wrapper">
            <Route
              exact
              path="/login"
              render={props => {
                return (
                  <Login
                    url={URL}
                    logIn={this.logIn}
                    error={props.location.error}
                  />
                );
              }}
            />
            <Route
              path="/inoreaderCallback"
              render={props => {
                return (
                  <LoginCallback
                    url={URL}
                    provider="INOREADER"
                    query={props.location.search}
                    logIn={this.logIn}
                  />
                );
              }}
            />
            <Route
              path="/newsblurCallback"
              render={props => (
                <LoginCallback
                  url={URL}
                  provider="NEWSBLUR"
                  query={props.location.search}
                  logIn={this.logIn}
                />
              )}
            />

            <PrivateRoute
              exact
              path="/"
              render={() => (
                <Home
                  url={URL}
                  token={getToken ()}
                  userProfile={this.state.userProfile}
                />
              )}
              getToken={getToken}
              logOut={logOut}
            />
            <PrivateRoute
              path="/subscriptions"
              render={() => <Subscriptions url={URL} token={getToken ()} />}
              getToken={getToken}
              logOut={logOut}
            />
            <PrivateRoute
              path="/deliveries"
              render={() => <Deliveries url={URL} token={getToken ()} />}
              getToken={getToken}
              logOut={logOut}
            />
            <PrivateRoute
              path="/settings"
              render={() => (
                <Settings
                  url={URL}
                  token={getToken ()}
                  setUserProfile={this.setUserProfile}
                />
              )}
              getToken={getToken}
              logOut={logOut}
            />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
