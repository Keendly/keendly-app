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

const base64 = string => {
  return btoa (String.fromCharCode.apply (null, new Uint8Array (string)));
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
      this.loadUserProfile (true);
    }
  }

  loadUserProfile (subscribePush) {
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
        if (subscribePush) {
          if (json.email === 'moomeen@gmail.com') {
            this.subscribePush ();
          }
        }
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
    this.loadUserProfile (true);
  }

  subscribePush () {
    if (!navigator || !navigator.serviceWorker) {
      return;
    }
    navigator.serviceWorker.ready.then (registration => {
      if (!registration.pushManager) {
        alert ("Your browser doesn't support push notification.");
        return false;
      }

      const publicKey = new Uint8Array ([
        0x04,
        0xf6,
        0x65,
        0xf5,
        0xe9,
        0x1a,
        0xc3,
        0x10,
        0x94,
        0x79,
        0xec,
        0x78,
        0x57,
        0x9a,
        0x0b,
        0xe7,
        0x65,
        0x34,
        0x5d,
        0x56,
        0xeb,
        0xb8,
        0x61,
        0x5b,
        0xe3,
        0x11,
        0xb3,
        0xa9,
        0x6e,
        0x7b,
        0x69,
        0xf5,
        0x03,
        0x2b,
        0xf2,
        0xa1,
        0x2f,
        0x5b,
        0xad,
        0x53,
        0x7b,
        0xcc,
        0xe5,
        0x98,
        0x9b,
        0x03,
        0x61,
        0xc0,
        0x6e,
        0x2b,
        0x95,
        0x24,
        0x69,
        0x79,
        0x5e,
        0x51,
        0x47,
        0xea,
        0xdd,
        0x35,
        0x18,
        0x7a,
        0x42,
        0x1a,
        0xfc,
      ]);

      //To subscribe `push notification` from push manager
      registration.pushManager
        .subscribe ({
          userVisibleOnly: true, //Always show notification when received
          applicationServerKey: publicKey,
        })
        .then (subscription => {
          // Get public key and user auth from the subscription object
          var key = subscription.getKey
            ? base64 (subscription.getKey ('p256dh'))
            : '';
          var auth = subscription.getKey
            ? base64 (subscription.getKey ('auth'))
            : '';

          var exists = false;
          if (this.state.userProfile.pushSubscriptions) {
            this.state.userProfile.pushSubscriptions.forEach (s => {
              if (s.endpoint === subscription.endpoint && s.auth === auth) {
                exists = true;
              }
            });
          }

          if (exists) {
            return;
          }

          fetch (URL + '/users/self/pushsubscriptions', {
            headers: {
              Authorization: getToken (),
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify ({
              endpoint: subscription.endpoint,
              // Take byte[] and turn it into a base64 encoded string
              key: key,
              auth: auth,
            }),
          })
            .then (response => {
              if (response.ok) {
                this.loadUserProfile (false);
              }
            })
            .catch (error => {
              // swallow to avoid propagating
            });
        })
        .catch (error => {
          console.error ('Push notification subscription error: ', error);
        });
    });
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
