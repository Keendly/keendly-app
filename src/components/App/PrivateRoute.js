import React, {Component} from 'react';
import PropTypes from 'prop-types';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import PersonIcon from 'material-ui/svg-icons/social/person';
import MenuItem from 'material-ui/MenuItem';
import Button from 'material-ui/RaisedButton';
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

import Drawer from 'material-ui/Drawer';

import logo from './logo_nav.png';
import facebook from './facebook.png';
import twitter from './twitter.png';
import gmail from './gmail.png';

import {Mobile, Desktop, AboveMobile, BelowDesktop} from '../../breakpoints';

import {Route, Link, Redirect} from 'react-router-dom';

import dropin from 'braintree-web-drop-in';
import BraintreeDropin from 'braintree-dropin-react';
import LinearProgress from 'material-ui/LinearProgress';
import Snackbar from 'material-ui/Snackbar';

class PrivateRoute extends Component {
  constructor (props) {
    super (props);
    this.state = {
      drawerOpen: false,
      feedbackOpen: false,
      feedbackSuccess: false,
      feedbackError: false,
      paymentOpen: false,
      paymentInProgress: false,
      paymentButtonDisabled: false,
      paymentSnackbarOpen: false,
    };

    this.handleFeedbackSubmit = this.handleFeedbackSubmit.bind (this);
    this.handleFeedbackEmailChange = this.handleFeedbackEmailChange.bind (this);
    this.handleFeedbackMessageChange = this.handleFeedbackMessageChange.bind (
      this
    );
    this.handlePaymentMethod = this.handlePaymentMethod.bind (this);
  }

  handleFeedbackSubmit () {
    fetch ('//formspree.io/contact@keendly.com', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({
        email: this.state.feedbackEmail,
        message: this.state.feedbackMessage,
      }),
    })
      .then (response => {
        if (response.ok) {
          this.setState ({
            feedbackSuccess: true,
          });
        } else {
          this.setState ({
            feedbackError: true,
          });
        }
      })
      .catch (error => {
        this.setState ({
          feedbackError: true,
        });
      });
  }

  handleFeedbackEmailChange (event) {
    this.setState ({
      feedbackEmail: event.target.value,
    });
  }

  handleFeedbackMessageChange (event) {
    this.setState ({
      feedbackMessage: event.target.value,
    });
  }

  footerLinks () {
    return (
      <div>
        <a
          className="Footer__feedback"
          onClick={() => {
            this.setState ({
              feedbackOpen: true,
            });
          }}
        >
          LEAVE FEEDBACK
        </a>
        <a href="http://keendly.com" target="_blank" rel="noopener noreferrer">
          WEBSITE
        </a>
        <a
          href="http://blog.keendly.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          BLOG
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

  footerButtons () {
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
        <div className="Footer__copyright">© 2018 Keendly</div>
      </div>
    );
  }

  handlePaymentMethod = payload => {
    this.setState ({
      paymentInProgress: true,
      paymentButtonDisabled: true,
    });
    const nonce = payload.nonce;
    fetch (this.props.url + '/users/self/premium', {
      headers: {
        Authorization: this.props.getToken (),
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify ({
        plainId: 'premium',
        nonce: nonce,
      }),
    }).then (response => {
      this.setState ({
        paymentInProgress: false,
      });
      if (response.ok) {
        this.setState ({
          paymentSnackbarOpen: true,
          paymentOpen: false,
          paymentButtonDisabled: false,
        });
        this.props.loadUserProfile (false);
      } else if (response.status === 400) {
        response.json ().then (json => {
          this.setState ({
            error: json.description,
          });
        });
      } else {
        this.setState ({
          error: 'Error creating premium subscription',
        });
      }
    });
  };

  render () {
    const {render: Component, ...rest} = this.props;

    return (
      <Route
        {...rest}
        render={props => {
          return this.props.getToken ()
            ? <div>
                <BelowDesktop>
                  <Toolbar className="Header__toolbar">
                    <ToolbarGroup firstChild>
                      <IconButton
                        onClick={() =>
                          this.setState ({drawerOpen: !this.state.drawerOpen})}
                      >
                        <Menu />
                      </IconButton>
                    </ToolbarGroup>
                    <ToolbarGroup>
                      <img className="Header__logo" src={logo} alt="logo" />
                    </ToolbarGroup>
                    <ToolbarGroup lastChild>
                      {/* <FlatButton
                        label="Donate"
                        backgroundColor="#5cb85c"
                        icon={<LoyaltyIcon />}
                        className="dbox-donation-button"
                        href="https://donorbox.org/keendly"
                      /> */}
                      {!this.props.isPremium () &&
                        <FlatButton
                          label="Premium"
                          backgroundColor="#FF4081"
                          icon={<LoyaltyIcon />}
                          className="premium-button"
                          onClick={() => {
                            this.setState ({
                              paymentOpen: true,
                            });
                          }}
                        />}
                    </ToolbarGroup>
                  </Toolbar>
                  <Drawer
                    docked={false}
                    width={200}
                    open={this.state.drawerOpen}
                    onRequestChange={open => this.setState ({drawerOpen: open})}
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
                        this.props.logOut ();
                        props.history.push ('/login');
                      }}
                    >
                      Log out
                    </MenuItem>
                  </Drawer>
                </BelowDesktop>
                <Desktop>
                  <Toolbar className="Header__toolbar">
                    <ToolbarGroup firstChild>
                      <a
                        href="http://keendly.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img className="Header__logo" src={logo} alt="logo" />
                      </a>
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
                      {/* <FlatButton
                        label="Donate"
                        backgroundColor="#5cb85c"
                        icon={<LoyaltyIcon />}
                        className="dbox-donation-button"
                        href="https://donorbox.org/keendly"
                      /> */}
                      {!this.props.isPremium () &&
                        <FlatButton
                          label="Go Premium"
                          backgroundColor="#FF4081"
                          icon={<LoyaltyIcon />}
                          className="premium-button"
                          onClick={() => {
                            this.setState ({
                              paymentOpen: true,
                            });
                          }}
                        />}
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
                            this.props.logOut ();
                            props.history.push ('/login');
                          }}
                        />
                      </IconMenu>
                    </ToolbarGroup>
                  </Toolbar>
                </Desktop>
                <div className="Content">{Component ()}</div>
                <div className="Footer__wrapper">
                  <div className="Footer__content">
                    <AboveMobile>
                      <div className="Footer__left">{this.footerLinks ()}</div>
                    </AboveMobile>
                    <Mobile>
                      <div className="Footer__list">{this.footerLinks ()}</div>
                    </Mobile>
                    <AboveMobile>
                      <div className="Footer__right">
                        {this.footerButtons ()}
                      </div>
                    </AboveMobile>
                    <Mobile>
                      <div className="Footer__small">
                        {this.footerButtons ()}
                      </div>
                    </Mobile>
                  </div>
                </div>
                <Dialog
                  title="Leave feedback"
                  contentStyle={{width: '95%'}}
                  actions={
                    !this.state.feedbackError && !this.state.feedbackSuccess
                      ? [
                          <FlatButton
                            label="Cancel"
                            primary={true}
                            onClick={() => {
                              this.setState ({
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
                              this.setState ({
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
                    this.setState ({
                      feedbackOpen: false,
                    });
                  }}
                >
                  {!this.state.feedbackError &&
                    !this.state.feedbackSuccess &&
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
                    </div>}
                  {this.state.feedbackSuccess &&
                    <div>Email sent, thank you for your feedback! </div>}
                  {this.state.feedbackError &&
                    <div>
                      Error occured :-(, please send your feedback to{' '}
                      <a href="mailto:contact@keendly.com" target="_top">
                        contact@keendly.com
                      </a>
                    </div>}
                </Dialog>
                <Dialog
                  title="Go Premium!"
                  contentStyle={{width: '95%'}}
                  actions={[]}
                  modal={false}
                  open={this.state.paymentOpen}
                  onRequestClose={() => {
                    this.setState ({
                      paymentOpen: false,
                    });
                  }}
                >
                  {this.state.paymentInProgress &&
                    <LinearProgress mode="indeterminate" />}
                  <p>
                    After
                    {' '}
                    <b>7 days of a trial period</b>
                    , you will be charged
                    {' '}
                    <b>
                      3€
                      monthly
                    </b>.
                    <br />
                    You can cancel the subscription any time, in user settings.
                  </p>
                  <BraintreeDropin
                    braintree={dropin}
                    authorizationToken="sandbox_s8cgnws2_yn7xvtxtxcgfw8fb"
                    handlePaymentMethod={this.handlePaymentMethod}
                    paypal="vault"
                    renderSubmitButton={({onClick, isDisabled, text}) => {
                      return (
                        <Button
                          label={text}
                          backgroundColor="#5cb85c"
                          disabled={
                            isDisabled || this.state.paymentButtonDisabled
                          }
                          labelColor="#ffffff"
                          onClick={onClick}
                        />
                      );
                    }}
                    className="Payment__container"
                  />
                </Dialog>
                <Snackbar
                  open={this.state.paymentSnackbarOpen}
                  message="You have Premium now!"
                  onRequestClose={() => {
                    this.setState ({
                      paymentSnackbarOpen: false,
                    });
                  }}
                />
              </div>
            : <Redirect
                to={{pathname: '/login', state: {from: props.location}}}
              />;
        }}
      />
    );
  }
}

PrivateRoute.propTypes = {
  url: PropTypes.string.isRequired,
  getToken: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  isPremium: PropTypes.func.isRequired,
  loadUserProfile: PropTypes.func.isRequired,
};

export default PrivateRoute;
