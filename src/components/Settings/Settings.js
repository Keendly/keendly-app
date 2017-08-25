import React from "react";
import PropTypes from "prop-types";
import LinearProgress from "material-ui/LinearProgress";
import TextField from "material-ui/TextField";
import Checkbox from "material-ui/Checkbox";
import RaisedButton from "material-ui/RaisedButton";
import SaveIcon from "material-ui/svg-icons/content/save";
import Snackbar from "material-ui/Snackbar";

import "./Settings.css";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      snackbarOpen: false,
      error: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  componentWillMount() {
    this.loadSettingsFromServer(1);
  }

  componentDidMount() {
    document.title = "Settings | Keendly";
  }

  loadSettingsFromServer(page) {
    this.setState({
      loading: true
    });
    fetch(this.props.url + "/users/self", {
      headers: {
        Authorization: this.props.token
      }
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          data: json,
          loading: false,
          deliveryEmail: json.deliveryEmail,
          notifyNoArticles: json.notifyNoArticles
        });
      });
  }

  handleSubmit() {
    fetch(this.props.url + "/users/self", {
      headers: {
        Authorization: this.props.token,
        "Content-Type": "application/json"
      },
      method: "PATCH",
      body: JSON.stringify({
        deliveryEmail: this.state.deliveryEmail,
        notifyNoArticles: this.state.notifyNoArticles
      })
    }).then(response => {
      if (response.ok) {
        this.setState({
          snackbarOpen: true,
          error: false
        });
      } else if (response.status === 400) {
        response.json().then(json => {
          this.setState({
            error: json.description
          });
        });
      } else {
        this.setState({
          error: "Error saving settings, try again later"
        });
      }
    });
  }

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false
    });
  };

  render() {
    const styles = {
      email: {
        marginBottom: 16
      },
      button: {
        float: "right"
      }
    };

    return (
      <div className="Settings__wrapper">
        {this.state.loading && <LinearProgress mode="indeterminate" />}
        {!this.state.loading &&
          <div className="Settings__content">
            {this.state.error &&
              <div className="Settings__message Settings__error">
                {this.state.error}
              </div>}
            {this.state.deliveryEmail &&
              <div className="Settings__message Settings__info">
                Make sure to add <b>{this.state.data.deliverySender}</b> to your{" "}
                <b>Approved Personal Document E-mail List</b>, you can do it{" "}
                <a
                  href="https://www.amazon.com/mn/dcw/myx.html/ref=kinw_myk_surl_2#/home/settings/"
                  target="_blank"
                >
                  here
                </a>.
              </div>}
            <TextField
              floatingLabelText="Send-To-Kindle E-Mail"
              value={this.state.deliveryEmail}
              onChange={(event, newValue) => {
                this.setState({
                  deliveryEmail: newValue
                });
              }}
              fullWidth
              style={styles.email}
            />
            <Checkbox
              label="Notify me by email in case there were no articles to send in scheduled delivery"
              checked={this.state.notifyNoArticles}
              onCheck={(event, newValue) => {
                this.setState({
                  notifyNoArticles: newValue
                });
              }}
            />
            <RaisedButton
              className="Settings__save"
              onTouchTap={this.handleSubmit}
              secondary
              label="Save"
              style={styles.button}
              icon={<SaveIcon />}
            />
            <Snackbar
              open={this.state.snackbarOpen}
              message="Settings saved"
              autoHideDuration={4000}
              onRequestClose={this.handleSnackbarClose}
            />
          </div>}
      </div>
    );
  }
}

Settings.propTypes = {
  token: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default Settings;
