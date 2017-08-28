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
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "material-ui/Toolbar";

import logo from "./logo_nav.png";
import Home from "../Home";
import Settings from "../Settings";
import Deliveries from "../Deliveries";
import Subscriptions from "../Subscriptions";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import "./App.css";

const TOKEN =
  "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiIyIiwiZXhwIjoxNTA0NTM1OTMzfQ.SnYX9xBGhsT5VhsNlhI6mI-fJd6QduJVOj7AiNUyQgf3ROhFoJt_nFcs945OeReL7JvEETSnjRb4Z-llARIuBw";
const URL = "https://m1ndoce0cl.execute-api.eu-west-1.amazonaws.com/v1";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: TOKEN
    };
  }
  render() {
    return (
      <MuiThemeProvider>
        <Router>
          <div>
            <Toolbar className="Header__toolbar">
              <ToolbarGroup firstChild>
                <img className="Header__logo" src={logo} alt="logo" />
                <FlatButton
                  label="Home"
                  icon={<HomeIcon />}
                  containerElement={<Link to="/" />}
                />
                <FlatButton
                  label="Scheduled"
                  icon={<TimerIcon />}
                  containerElement={<Link to="/subscriptions" />}
                />
                <FlatButton
                  label="History"
                  icon={<ListIcon />}
                  containerElement={<Link to="/deliveries" />}
                />
                <FlatButton
                  label="Donate"
                  backgroundColor="#5cb85c"
                  icon={<LoyaltyIcon />}
                />
              </ToolbarGroup>
              <ToolbarGroup lastChild>
                <ToolbarSeparator />
                <IconMenu
                  iconButtonElement={
                    <IconButton touch>
                      <PersonIcon />
                    </IconButton>
                  }
                >
                  <MenuItem
                    primaryText="Settings"
                    containerElement={<Link to="/settings" />}
                    leftIcon={<SettingsIcon />}
                  />
                  <MenuItem primaryText="Log out" leftIcon={<PowerIcon />} />
                </IconMenu>
              </ToolbarGroup>
            </Toolbar>
            <div>
              <Route
                exact
                path="/"
                component={() => <Home token={this.state.token} url={URL} />}
              />
              <Route
                path="/subscriptions"
                component={() =>
                  <Subscriptions token={this.state.token} url={URL} />}
              />
              <Route
                path="/deliveries"
                component={() =>
                  <Deliveries token={this.state.token} url={URL} />}
              />
              <Route
                path="/settings"
                component={() =>
                  <Settings token={this.state.token} url={URL} />}
              />
            </div>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
