import React, {Component} from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import PersonIcon from 'material-ui/svg-icons/social/person';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import HomeIcon from 'material-ui/svg-icons/action/home';
import TimerIcon from 'material-ui/svg-icons/image/timer';
import ListIcon from 'material-ui/svg-icons/action/list';
import LoyaltyIcon from 'material-ui/svg-icons/action/loyalty';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import Menu from 'material-ui/svg-icons/navigation/menu';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Cookies from 'universal-cookie';

import Drawer from 'material-ui/Drawer';

import logo from './logo_nav.png';
import facebook from './facebook.png';
import twitter from './twitter.png';
import gmail from './gmail.png';

import {Mobile, Desktop, AboveMobile, BelowDesktop} from '../../breakpoints';

import {Route, Link, Redirect} from 'react-router-dom';

const AUTH_KEY = 'k33ndly_535510n';

const cookies = new Cookies();

const isLoggedIn = () => {
  return cookies.get(AUTH_KEY);
};

class PrivateRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      feedbackOpen: false,
      feedbackSuccess: false,
      feedbackError: false,
    };

    this.handleFeedbackSubmit = this.handleFeedbackSubmit.bind(this);
    this.handleFeedbackEmailChange = this.handleFeedbackEmailChange.bind(this);
    this.handleFeedbackMessageChange = this.handleFeedbackMessageChange.bind(
      this
    );
  }

  handleFeedbackSubmit() {
    fetch('//formspree.io/contact@keendly.com', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.feedbackEmail,
        message: this.state.feedbackMessage,
      }),
    })
      .then(response => {
        if (response.ok) {
          this.setState({
            feedbackSuccess: true,
          });
        } else {
          this.setState({
            feedbackError: true,
          });
        }
      })
      .catch(error => {
        this.setState({
          feedbackError: true,
        });
      });
  }

  handleFeedbackEmailChange(event) {
    this.setState({
      feedbackEmail: event.target.value,
    });
  }

  handleFeedbackMessageChange(event) {
    this.setState({
      feedbackMessage: event.target.value,
    });
  }

  footerLinks() {
    return (
      <div>
        <a
          className="Footer__feedback"
          onClick={() => {
            this.setState({
              feedbackOpen: true,
            });
          }}
        >
          LEAVE FEEDBACK
        </a>
        <a href="http://keendly.com" target="_blank" rel="noopener noreferrer">
          > WEBSITE
        </a>
        <a
          href="http://blog.keendly.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          > BLOG
        </a>
        <a
          href="https://keendly.myjetbrains.com/youtrack/agiles"
          target="_blank"
          rel="noopener noreferrer"
        >
          ISSUE TRACKER
        </a>
      </div>
    );
  }

  footerButtons() {
    return (
      <div>
        <div className="share-buttons">
          <a
            href="https://www.facebook.com/KeendlyApp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={facebook} alt="facebook" />
          </a>
          <a
            href="https://twitter.com/KeendlyApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={twitter} alt="twitter" />
          </a>
          <a href="mailto:contact@keendly.com">
            <img src={gmail} alt="email" />
          </a>
        </div>
        <div className="Footer__copyright">© 2017 Keendly</div>
      </div>
    );
  }

  render() {
    const {render: Component, ...rest} = this.props;
    const component = React.cloneElement(Component(), {
      token: cookies.get(AUTH_KEY),
    });

    return (
      <Route
        {...rest}
        render={props => {
          return isLoggedIn() ? (
            <div>
              <BelowDesktop>
                <Toolbar className="Header__toolbar">
                  <ToolbarGroup firstChild>
                    <IconButton
                      onClick={() =>
                        this.setState({drawerOpen: !this.state.drawerOpen})}
                    >
                      <Menu />
                    </IconButton>
                  </ToolbarGroup>
                  <ToolbarGroup>
                    <img className="Header__logo" src={logo} alt="logo" />
                  </ToolbarGroup>
                  <ToolbarGroup lastChild>
                    <FlatButton
                      label="Donate"
                      backgroundColor="#5cb85c"
                      icon={<LoyaltyIcon />}
                      className="dbox-donation-button"
                      href="https://donorbox.org/keendly"
                    />
                  </ToolbarGroup>
                </Toolbar>
                <Drawer
                  docked={false}
                  width={200}
                  open={this.state.drawerOpen}
                  onRequestChange={open => this.setState({drawerOpen: open})}
                >
                  <MenuItem
                    leftIcon={<HomeIcon />}
                    containerElement={<Link to="/" />}
                  >
                    Home
                  </MenuItem>
                  <MenuItem
                    leftIcon={<TimerIcon />}
                    containerElement={<Link to="/subscriptions" />}
                  >
                    Scheduled
                  </MenuItem>
                  <MenuItem
                    leftIcon={<ListIcon />}
                    containerElement={<Link to="/deliveries" />}
                  >
                    History
                  </MenuItem>
                  <MenuItem
                    leftIcon={<SettingsIcon />}
                    containerElement={<Link to="/settings" />}
                  >
                    Settings
                  </MenuItem>
                  <MenuItem
                    leftIcon={<PowerIcon />}
                    onClick={() => {
                      cookies.remove(AUTH_KEY);
                      props.history.push('/login');
                    }}
                  >
                    Log out
                  </MenuItem>
                </Drawer>
              </BelowDesktop>
              <Desktop>
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
                      className="dbox-donation-button"
                      href="https://donorbox.org/keendly"
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
                          props.history.push('/login');
                        }}
                      />
                    </IconMenu>
                  </ToolbarGroup>
                </Toolbar>
              </Desktop>
              <div className="Content">{component}</div>
              <div className="Footer__wrapper">
                <div className="Footer__content">
                  <AboveMobile>
                    <div className="Footer__left">{this.footerLinks()}</div>
                  </AboveMobile>
                  <Mobile>
                    <div className="Footer__list">{this.footerLinks()}</div>
                  </Mobile>
                  <AboveMobile>
                    <div className="Footer__right">{this.footerButtons()}</div>
                  </AboveMobile>
                  <Mobile>
                    <div className="Footer__small">{this.footerButtons()}</div>
                  </Mobile>
                </div>
              </div>
              <Dialog
                title="Leave feedback"
                actions={
                  !this.state.feedbackError && !this.state.feedbackSuccess
                    ? [
                        <FlatButton
                          label="Cancel"
                          primary={true}
                          onClick={() => {
                            this.setState({
                              feedbackOpen: false,
                            });
                          }}
                        />,
                        <FlatButton
                          label="Send"
                          primary={true}
                          keyboardFocused={true}
                          onClick={this.handleFeedbackSubmit}
                        />,
                      ]
                    : [
                        <FlatButton
                          label="Close"
                          primary={true}
                          onClick={() => {
                            this.setState({
                              feedbackOpen: false,
                              feedbackSuccess: false,
                              feedbackError: false,
                            });
                          }}
                        />,
                      ]
                }
                modal={false}
                open={this.state.feedbackOpen}
                onRequestClose={() => {
                  this.setState({
                    feedbackOpen: false,
                  });
                }}
              >
                {!this.state.feedbackError &&
                  !this.state.feedbackSuccess && (
                    <div>
                      <TextField
                        hintText="Your email"
                        fullWidth={true}
                        onChange={this.handleFeedbackEmailChange}
                      />
                      <TextField
                        hintText="Message"
                        fullWidth={true}
                        onChange={this.handleFeedbackMessageChange}
                        multiLine={true}
                        rows={3}
                      />
                    </div>
                  )}
                {this.state.feedbackSuccess && (
                  <div>Email sent, thank you for your feedback! </div>
                )}
                {this.state.feedbackError && (
                  <div>
                    Error occured :-(, please send your feedback to{' '}
                    <a href="mailto:contact@keendly.com" target="_top">
                      contact@keendly.com
                    </a>
                  </div>
                )}
              </Dialog>
            </div>
          ) : (
            <Redirect
              to={{pathname: '/login', state: {from: props.location}}}
            />
          );
        }}
      />
    );
  }
}

export default PrivateRoute;
