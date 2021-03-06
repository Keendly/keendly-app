import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';

import {Redirect} from 'react-router-dom';

import logo from './logo_login.png';
import logo_small from './logo_login_small.png';

import {Mobile, AboveMobile} from '../../breakpoints';

import './Login.css';

class Login extends Component {
  constructor (props) {
    super (props);
    this.state = {
      oldreaderOpen: false,
      loading: false,
      loggedIn: false,
      loaded: false,
    };

    this.handleOldreaderOpen = this.handleOldreaderOpen.bind (this);
    this.handleOldreaderClose = this.handleOldreaderClose.bind (this);
    this.handleOldreaderLogin = this.handleOldreaderLogin.bind (this);
    this.handleOldreaderEmailChange = this.handleOldreaderEmailChange.bind (
      this
    );
    this.handleOldreaderPasswordChange = this.handleOldreaderPasswordChange.bind (
      this
    );
  }

  componentWillMount () {
    Promise.all ([
      this.getStateToken ('INOREADER'),
      this.getStateToken ('NEWSBLUR'),
      this.getStateToken ('FEEDLY'),
    ])
      .then (values => {
        this.setState ({
          inoreaderState: values[0]['state'],
          newsblurState: values[1]['state'],
          feedlyState: values[2]['state'],
          loaded: true,
        });
      })
      .catch (error => {
        this.setState ({
          loadingError: "Couldn't load, please try again later",
          loaded: true,
        });
      });
  }

  getStateToken (provider) {
    return fetch (
      this.props.url + '/login?provider=' + provider
    ).then (response => response.json ());
  }

  componentDidMount () {
    document.title = 'Log in | Keendly';
  }

  handleOldreaderOpen () {
    this.setState ({
      oldreaderOpen: true,
    });
  }

  handleOldreaderClose () {
    this.setState ({
      oldreaderOpen: false,
    });
  }

  handleOldreaderEmailChange (event) {
    this.setState ({
      oldreaderEmail: event.target.value,
    });
  }

  handleOldreaderPasswordChange (event) {
    this.setState ({
      oldreaderPassword: event.target.value,
    });
  }

  handleOldreaderLogin () {
    this.setState ({
      loading: true,
    });
    fetch (this.props.url + '/login', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({
        provider: 'OLDREADER',
        grant_type: 'password',
        username: this.state.oldreaderEmail,
        password: this.state.oldreaderPassword,
      }),
    })
      .then (response => {
        if (response.ok) {
          this.setState ({
            loading: false,
            error: false,
          });
          response.text ().then (token => {
            this.props.logIn (token);
            this.setState ({
              loggedIn: true,
            });
          });
        } else {
          this.setState ({
            error: 'Login error, please try again',
            oldreaderOpen: false,
            loading: false,
          });
        }
      })
      .catch (error => {
        this.setState ({
          error: 'Login error, please try again',
          oldreaderOpen: false,
          loading: false,
        });
      });
  }

  inoreaderUrl () {
    const clientId = this.isDev () ? 1000000896 : 1000001083;
    const redirectUri = this.isDev ()
      ? 'http://localhost:3000/inoreaderCallback'
      : 'https://app.keendly.com/inoreaderCallback';
    return (
      'https://www.inoreader.com/oauth2/auth?client_id=' +
      clientId +
      '&redirect_uri=' +
      redirectUri +
      '&response_type=code&scope=write' +
      '&state=' +
      this.state.inoreaderState
    );
  }

  newsblurUrl () {
    return (
      'https://newsblur.com/oauth/authorize?client_id=rj1Ju@tztvTCiYVP7xRWwJDRxxkuYf5ex?dSej5x&redirect_uri=https://app.keendly.com/newsblurCallback&response_type=code&scope=write&state=' +
      this.state.newsblurState
    );
  }

  feedlyUrl () {
    const url = this.isDev ()
      ? 'https://sandbox7.feedly.com/'
      : 'https://cloud.feedly.com/';
    const clientId = this.isDev () ? 'sandbox' : 'keendly';
    const redirectUri = this.isDev ()
      ? 'http://localhost:8080'
      : 'https://app.keendly.com/feedlyCallback';

    return (
      url +
      '/v3/auth/auth?response_type=code&client_id=' +
      clientId +
      '&redirect_uri=' +
      redirectUri +
      '&response_type=code&scope=https://cloud.feedly.com/subscriptions' +
      '&state=' +
      this.state.feedlyState
    );
  }

  isDev () {
    return process.env.NODE_ENV === 'development';
  }

  render () {
    if (this.state.loggedIn) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <AboveMobile>
          <div className="Login__logo">
            <img src={logo} alt="logo" />
          </div>
        </AboveMobile>
        <Mobile>
          <div className="Login__logo">
            <img src={logo_small} alt="logo" />
          </div>
        </Mobile>
        {this.props.error &&
          <div className="Login__error">{this.props.error}</div>}
        {this.state.error &&
          <div className="Login__error">{this.state.error}</div>}
        {this.state.loadingError &&
          <div className="Login__error">{this.state.loadingError}</div>}
        {!this.state.loaded &&
          <div className="Login__loading">
            {' '}
            <CircularProgress />{' '}
          </div>}
        {this.state.loaded &&
          !this.state.loadingError &&
          <div className="Login__buttons">
            <a className="Login__button Login__feedly" href={this.feedlyUrl ()}>
              Log in with <b>Feedly</b>
            </a>
            <a
              className="Login__button Login__inoreader"
              href={this.inoreaderUrl ()}
            >
              Log in with <b>Inoreader</b>
            </a>
            <a
              className="Login__button Login__oldreader"
              onClick={this.handleOldreaderOpen}
            >
              Log in with <b>The Old Reader</b>
            </a>
            <Dialog
              title="Log in with The Old Reader"
              modal={false}
              open={this.state.oldreaderOpen}
              onRequestClose={this.handleOldreaderClose}
              contentStyle={{
                'max-width': '500px',
              }}
              style={{
                'padding-top': '10px !important',
              }}
              actions={[
                <FlatButton
                  label="LOG IN"
                  primary={true}
                  keyboardFocused={true}
                  onClick={this.handleOldreaderLogin}
                />,
              ]}
            >
              {this.state.loading && <LinearProgress mode="indeterminate" />}
              <TextField
                hintText="Email"
                fullWidth={true}
                onChange={this.handleOldreaderEmailChange}
              />
              <TextField
                hintText="Password"
                fullWidth={true}
                onChange={this.handleOldreaderPasswordChange}
                type="password"
              />
            </Dialog>

            <a
              className="Login__button Login__newsblur"
              href={this.newsblurUrl ()}
            >
              Log in with <b>NewsBlur</b>
            </a>
          </div>}
      </div>
    );
  }
}

Login.propTypes = {
  url: PropTypes.string.isRequired,
  error: PropTypes.string,
  logIn: PropTypes.func.isRequired,
};

export default Login;
