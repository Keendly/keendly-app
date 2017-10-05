import React, { Component } from "react";
import PropTypes from "prop-types";
import CircularProgress from "material-ui/CircularProgress";
import Cookies from "universal-cookie";

import { Redirect } from "react-router-dom";

import logo from "./logo_login.png";
import logo_small from "./logo_login_small.png";

import "./Login.css";

const cookies = new Cookies();

class LoginCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentWillMount() {
    const params = new URLSearchParams(this.props.query);
    this.setState({
      loading: true
    });
    fetch(this.props.url + "/login", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        provider: this.props.provider,
        grant_type: "authentication_code",
        code: params.get("code"),
        state: params.get("state")
      })
    })
      .then(response => {
        if (response.ok) {
          this.setState({
            loading: false,
            error: false
          });
          response.text().then(token => {
            cookies.set("k33ndly_535510n", token);
            console.log(token);
            this.setState({
              loggedIn: true
            });
          });
        } else {
          console.log(response.status);
          this.setState({
            error: "Login error, please try again",
            loading: false
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          error: "Login error, please try again",
          loading: false
        });
      });
  }

  render() {
    if (this.state.loggedIn) {
      console.log("udalo sie zalogowac");
      return <Redirect to="/" />;
    } else if (this.state.loading) {
      return (
        <div>
          <div className="Login__logo">
            <img src={logo} />
          </div>
          <div className="Login__loading">
            {" "}<CircularProgress />{" "}
          </div>
        </div>
      );
    } else if (this.state.error) {
      return (
        <Redirect
          to={{
            pathname: "/login",
            error: this.state.error
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
  query: PropTypes.string
};

export default LoginCallback;
