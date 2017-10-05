import React, { Component } from "react";
import PropTypes from "prop-types";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import PersonIcon from "material-ui/svg-icons/social/person";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import HomeIcon from "material-ui/svg-icons/action/home";
import TimerIcon from "material-ui/svg-icons/image/timer";
import ListIcon from "material-ui/svg-icons/action/list";
import LoyaltyIcon from "material-ui/svg-icons/action/loyalty";
import SettingsIcon from "material-ui/svg-icons/action/settings";
import PowerIcon from "material-ui/svg-icons/action/power-settings-new";

import Home from "../Home";
import Settings from "../Settings";
import Deliveries from "../Deliveries";
import Subscriptions from "../Subscriptions";
import Login, { LoginCallback } from "../Login";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import PrivateRoute from "./PrivateRoute";

import "./App.css";

const URL =
  process.env.NODE_ENV === "development"
    ? "https://fmip59w73h.execute-api.eu-west-1.amazonaws.com/dev"
    : "https://m1ndoce0cl.execute-api.eu-west-1.amazonaws.com/v1";

class App extends Component {
  render() {
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
              render={props => {
                return (
                  <LoginCallback
                    url={URL}
                    provider="INOREADER"
                    query={props.location.search}
                  />
                );
              }}
            />
            <Route
              path="/newsblurCallback"
              render={props =>
                <LoginCallback
                  url={URL}
                  provider="NEWSBLUR"
                  query={props.location.search}
                />}
            />
            <PrivateRoute exact path="/" render={() => <Home url={URL} />} />
            <PrivateRoute
              path="/subscriptions"
              render={() => <Subscriptions url={URL} />}
            />
            <PrivateRoute
              path="/deliveries"
              render={() => <Deliveries url={URL} />}
            />
            <PrivateRoute
              path="/settings"
              render={() => <Settings url={URL} />}
            />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
