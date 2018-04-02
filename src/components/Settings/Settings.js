import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from 'material-ui/LinearProgress';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SaveIcon from 'material-ui/svg-icons/content/save';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import Snackbar from 'material-ui/Snackbar';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';

import './Settings.css';

class Settings extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      loading: false,
      saveSnackbarOpen: false,
      cancelSnackbarOpen: false,
      cancelDialogOpen: false,
      error: false,
    };

    this.handleSubmit = this.handleSubmit.bind (this);
    this.handleSaveSnackbarClose = this.handleSaveSnackbarClose.bind (this);
    this.handleCancelSnackbarClose = this.handleCancelSnackbarClose.bind (this);
    this.handleCancelPremium = this.handleCancelPremium.bind (this);
  }

  componentWillMount () {
    this.loadSettingsFromServer ();
  }

  componentDidMount () {
    document.title = 'Settings | Keendly';
  }

  loadSettingsFromServer () {
    this.setState ({
      loading: true,
    });
    fetch (this.props.url + '/users/self', {
      headers: {
        Authorization: this.props.token,
      },
    })
      .then (response => response.json ())
      .then (json => {
        this.setState ({
          data: json,
          loading: false,
          deliveryEmail: json.deliveryEmail,
          notifyNoArticles: json.notifyNoArticles,
        });
        this.props.setUserProfile (json);
      })
      .catch (error => {
        window.location.replace ('login');
      });
  }

  handleSubmit () {
    fetch (this.props.url + '/users/self', {
      headers: {
        Authorization: this.props.token,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify ({
        deliveryEmail: this.state.deliveryEmail,
        notifyNoArticles: this.state.notifyNoArticles,
      }),
    }).then (response => {
      if (response.ok) {
        this.setState ({
          saveSnackbarOpen: true,
          error: false,
        });
        this.loadSettingsFromServer ();
      } else if (response.status === 400) {
        response.json ().then (json => {
          this.setState ({
            error: json.description,
          });
        });
      } else {
        this.setState ({
          error: 'Error saving settings, try again later',
        });
      }
    });
  }

  handleCancelPremium () {
    fetch (this.props.url + '/users/self/premium', {
      headers: {
        Authorization: this.props.token,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    }).then (response => {
      this.setState ({
        cancelDialogOpen: false,
      });
      if (response.ok) {
        this.setState ({
          cancelSnackbarOpen: true,
          error: false,
        });
        this.loadSettingsFromServer ();
      } else if (response.status === 400) {
        response.json ().then (json => {
          this.setState ({
            error: json.description,
          });
        });
      } else {
        this.setState ({
          error: 'Error cancelling subscription, try again later or contact us directly',
        });
      }
    });
  }

  handleSaveSnackbarClose = () => {
    this.setState ({
      saveSnackbarOpen: false,
    });
  };

  handleCancelSnackbarClose = () => {
    this.setState ({
      cancelSnackbarOpen: false,
    });
  };

  render () {
    const styles = {
      email: {
        marginBottom: 16,
      },
      button: {
        float: 'right',
      },
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
            {this.state.data.premium &&
              <div>
                <div className="Settings__message Settings__premium clearfix">
                  <div>You have Premium account.</div>
                  <RaisedButton
                    className="Settings__cancel"
                    onTouchTap={() => {
                      this.setState ({
                        cancelDialogOpen: true,
                      });
                    }}
                    secondary
                    label="Cancel"
                    style={styles.button}
                    icon={<CancelIcon />}
                  />
                </div>
                <Divider />
              </div>}
            {this.state.data.deliverySender &&
              <div className="Settings__message Settings__info">
                Make sure to add
                {' '}
                <b>{this.state.data.deliverySender}</b>
                {' '}
                to your
                {' '}
                <b>Approved Personal Document E-mail List</b>
                , you can do it
                {' '}
                <a
                  href="https://www.amazon.com/mn/dcw/myx.html/ref=kinw_myk_surl_2#/home/settings/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>.
              </div>}
            <TextField
              hintText="your Send-To-Kindle email goes here"
              floatingLabelText="Send-To-Kindle E-Mail"
              floatingLabelFixed={true}
              value={this.state.deliveryEmail}
              onChange={(event, newValue) => {
                this.setState ({
                  deliveryEmail: newValue,
                });
              }}
              fullWidth
              style={styles.email}
            />
            <Checkbox
              label="Notify me by email in case there were no articles to send in scheduled delivery"
              checked={this.state.notifyNoArticles}
              onCheck={(event, newValue) => {
                this.setState ({
                  notifyNoArticles: newValue,
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
              open={this.state.saveSnackbarOpen}
              message="Settings saved"
              autoHideDuration={4000}
              onRequestClose={this.handleSaveSnackbarClose}
            />
            <Snackbar
              open={this.state.cancelSnackbarOpen}
              message="Subscription cancelled"
              autoHideDuration={4000}
              onRequestClose={this.handleCancelSnackbarClose}
            />
            <Dialog
              title="Are you sure?"
              actions={[
                <FlatButton
                  label="No"
                  primary={true}
                  onClick={() => {
                    this.setState ({
                      cancelDialogOpen: false,
                    });
                  }}
                />,
                <FlatButton
                  label="Yes"
                  primary={true}
                  keyboardFocused={true}
                  onClick={this.handleCancelPremium}
                />,
              ]}
              modal={false}
              open={this.state.cancelDialogOpen}
              onRequestClose={() => {
                this.setState ({
                  cancelDialogOpen: false,
                });
              }}
            >
              Are you sure that you want to cancel your premium subscription? Your scheduled deliveries will be deleted.
            </Dialog>
          </div>}
      </div>
    );
  }
}

Settings.propTypes = {
  token: PropTypes.string,
  url: PropTypes.string.isRequired,
  setUserProfile: PropTypes.func.isRequired,
};

export default Settings;
