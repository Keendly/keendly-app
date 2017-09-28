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
import Cookies from "universal-cookie";

import logo from "./logo_nav.png";
import facebook from "./facebook.png";
import twitter from "./twitter.png";
import gmail from "./gmail.png";

import Home from "../Home";
import Settings from "../Settings";
import Deliveries from "../Deliveries";
import Subscriptions from "../Subscriptions";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";

const AUTH_KEY = "k33ndly_535510n";

const cookies = new Cookies();

const isLoggedIn = () => {
  return cookies.get(AUTH_KEY);
};

const PrivateRoute = ({ render: Component, ...rest }) => {
  const component = React.cloneElement(Component(), {
    token: cookies.get(AUTH_KEY)
  });
  return (
    <Route
      {...rest}
      render={props => {
        console.log(props);
        return isLoggedIn()
          ? <div>
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
                    <MenuItem
                      primaryText="Log out"
                      leftIcon={<PowerIcon />}
                      onClick={() => {
                        cookies.remove(AUTH_KEY);
                        props.history.push("/login");
                      }}
                    />
                  </IconMenu>
                </ToolbarGroup>
              </Toolbar>
              <div className="Content">
                {component}
              </div>
              <div className="Footer__wrapper">
                <div className="Footer__content">
                  <div className="Footer__left">
                    <a id="contact_modal_btn" href="#contact">
                      LEAVE FEEDBACK
                    </a>
                    <a href="http://keendly.com" target="_blank">
                      WEBSITE
                    </a>
                    <a href="http://blog.keendly.com" target="_blank">
                      BLOG
                    </a>
                    <a
                      href="https://keendly.myjetbrains.com/youtrack/agiles"
                      target="_blank"
                    >
                      ISSUE TRACKER
                    </a>
                  </div>
                  <div className="Footer__right">
                    <div class="share-buttons">
                      <a
                        href="https://www.facebook.com/KeendlyApp/"
                        target="_blank"
                      >
                        <img src={facebook} />
                      </a>
                      <a href="https://twitter.com/KeendlyApp" target="_blank">
                        <img src={twitter} />
                      </a>
                      <a href="mailto:contact@keendly.com">
                        <img src={gmail} />
                      </a>
                    </div>
                    <div className="Footer__copyright">© 2017 Keendly</div>
                  </div>
                </div>
              </div>
            </div>
          : <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />;
      }}
    />
  );
};

export default PrivateRoute;
