import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';

import {Redirect} from 'react-router-dom';

import logo from './logo_login.png';
import logo_small from './logo_login_small.png';

import './Login.css';

import {Mobile, AboveMobile} from '../../breakpoints';

class LoginCallback extends Component {
  constructor (props) {
    super (props);
    this.state = {
      loading: false,
    };
  }

  componentWillMount () {
    const params = new URLSearchParams (this.props.query);
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
        provider: this.props.provider,
        grant_type: 'authentication_code',
        code: params.get ('code'),
        state: params.get ('state'),
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
            loading: false,
          });
        }
      })
      .catch (error => {
        this.setState ({
          error: 'Login error, please try again',
          loading: false,
        });
      });
  }

  render () {
    if (this.state.loggedIn) {
      return <Redirect to="/" />;
    } else if (this.state.loading) {
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
          <div className="Login__loading">
            {' '}
            <CircularProgress />{' '}
          </div>
        </div>
      );
    } else if (this.state.error) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            error: this.state.error,
          }}
        />
      );
    } else {
      return null;
    }
  }
}

LoginCallback.propTypes = {
  url: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
  query: PropTypes.string,
  logIn: PropTypes.func.isRequired,
};

export default LoginCallback;
