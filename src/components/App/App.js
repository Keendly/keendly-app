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

class App extends Component {
  render () {
    return (
      <MuiThemeProvider>
        <Router>
          <div className="Wrapper">
            <Route
              exact
              path="/login"
              render={props => {
                return <Login url={URL} error={props.location.error} />;
              }}
            />
            <Route
              path="/inoreaderCallback"
              render={props => (
                <LoginCallback
                  url={URL}
                  provider="INOREADER"
                  query={props.location.search}
                />
              )}
            />
            <Route
              path="/newsblurCallback"
              render={props => (
                <LoginCallback
                  url={URL}
                  provider="NEWSBLUR"
                  query={props.location.search}
                />
              )}
            />
            <PrivateRoute
              exact
              path="/"
              url={URL}
              render={() => <Home url={URL} />}
            />
            <PrivateRoute
              path="/subscriptions"
              url={URL}
              render={() => <Subscriptions url={URL} />}
            />
            <PrivateRoute
              path="/deliveries"
              url={URL}
              render={() => <Deliveries url={URL} />}
            />
            <PrivateRoute
              path="/settings"
              url={URL}
              render={() => <Settings url={URL} />}
            />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
