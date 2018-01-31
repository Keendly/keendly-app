import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui-next/Table';
import Pagination from '../Pagination';
import LinearProgress from 'material-ui/LinearProgress';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import {Link} from 'react-router-dom';
import {AboveMobile} from '../../breakpoints';

import './Subscriptions.css';

const PAGE_SIZE = 20;

class Subscriptions extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      page: 1,
      data: [],
      selected: [],
      loading: false,
      nothingSelectedDialogOpen: false,
      snackbarOpen: false,
    };

    this.handlePageChanged = this.handlePageChanged.bind (this);
    this.onSelectAllClick = this.onSelectAllClick.bind (this);
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind (this);
    this.handleDelete = this.handleDelete.bind (this);
  }

  componentWillMount () {
    this.loadSubscriptionsFromServer (1);
  }

  componentDidMount () {
    document.title = 'Scheduled | Keendly';
  }

  handlePageChanged (page) {
    this.setState ({page});
    this.loadSubscriptionsFromServer (page);
  }

  loadSubscriptionsFromServer (page) {
    this.setState ({
      loading: true,
    });
    fetch (
      this.props.url + '/subscriptions?page=' + page + '&pageSize=' + PAGE_SIZE,
      {
        headers: {
          Authorization: this.props.token,
        },
      }
    )
      .then (response => response.json ())
      .then (json => {
        this.setState ({
          data: json,
          loading: false,
        });
      })
      .catch (error => {
        window.location.replace ('login');
      });
  }

  onSelectAllClick (event, isInputChecked) {
    if (isInputChecked) {
      this.setState ({selected: this.state.data});
    } else {
      this.setState ({selected: []});
    }
  }

  onSelectClick (subscription, isInputChecked) {
    if (isInputChecked) {
      this.setState ((previousState, props) => {
        previousState.selected.push (subscription);
        return {
          selected: previousState.selected,
        };
      });
    } else {
      this.setState ((previousState, props) => {
        const index = previousState.selected.indexOf (subscription);
        previousState.selected.splice (index, 1);
        return {
          selected: previousState.selected,
        };
      });
    }
  }

  handleDeleteButtonClick () {
    if (this.state.selected.length === 0) {
      this.setState ({
        nothingSelectedDialogOpen: true,
      });
    } else {
      this.setState ({
        deleteConfirmationDialog: true,
      });
    }
  }

  handleDelete () {
    this.setState ({
      loading: true,
    });
    Promise.all (
      this.state.selected.map (s => {
        return fetch (this.props.url + '/subscriptions/' + s.id, {
          headers: {
            Authorization: this.props.token,
          },
          method: 'DELETE',
        });
      })
    ).then (() => {
      this.setState ({
        loading: false,
        deleteConfirmationDialog: false,
        snackbarOpen: true,
        selected: [],
      });
      this.loadSubscriptionsFromServer (1);
    });
  }

  handleSnackbarClose = () => {
    this.setState ({
      snackbarOpen: false,
    });
  };

  render () {
    const ids = this.state.selected.map (s => s.id);

    return (
      <div className="Subscriptions3__wrapper">
        {this.state.loading && <LinearProgress mode="indeterminate" />}
        <div className="Subscriptions__table">
          {!this.state.loading &&
            this.state.data.length === 0 &&
            this.state.page === 1 &&
            <div className="Subscriptions__message">
              It seems that you do not have any deliveries scheduled. Go to{' '}
              <Link to="/">home</Link> to add one.
            </div>}
          {!this.state.loading &&
            (this.state.data.length !== 0 || this.state.page > 1) &&
            <div>
              <div className="Subscriptions__buttons">
                <RaisedButton
                  className="Subscription__delete"
                  onTouchTap={this.handleDeleteButtonClick}
                  label="Delete"
                  secondary={true}
                />
              </div>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      checkbox
                      className="Subscriptions__table_checkbox"
                    >
                      <Checkbox
                        onCheck={this.onSelectAllClick}
                        checked={
                          this.state.selected.length === this.state.data.length
                        }
                      />
                    </TableCell>
                    <TableCell className="Subscriptions__table_feeds">
                      Feeds
                    </TableCell>
                    <AboveMobile>
                      <TableCell style={{width: '100px'}}>Status</TableCell>
                    </AboveMobile>
                    <TableCell>Delivery time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.data.map ((subscription, index) => (
                    <TableRow key={index}>
                      <TableCell
                        checkbox
                        className="Subscriptions__table_checkbox"
                      >
                        <Checkbox
                          onCheck={(event, isInputChecked) =>
                            this.onSelectClick (subscription, isInputChecked)}
                          checked={ids.indexOf (subscription.id) !== -1}
                        />
                      </TableCell>
                      <TableCell className="Subscriptions__table_feeds">
                        <div className="Subscriptions__feeds">
                          {subscription.feeds &&
                            subscription.feeds
                              .map (item => item.title)
                              .join (' \u2022 ')}
                        </div>
                      </TableCell>
                      <AboveMobile>
                        <TableCell>
                          <Chip
                            className="Subscriptions__status"
                            style={{'background-color': '#C5E1A5'}}
                          >
                            active
                          </Chip>
                        </TableCell>
                      </AboveMobile>
                      <TableCell>
                        <div className="Subscriptions__time">
                          {subscription.time} ({subscription.timezone})
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                currentPage={this.state.page}
                pageSize={PAGE_SIZE}
                handlePageChange={this.handlePageChanged}
              />
            </div>}
          <Dialog
            modal={false}
            open={this.state.nothingSelectedDialogOpen}
            onRequestClose={() => {
              this.setState ({
                nothingSelectedDialogOpen: false,
              });
            }}
          >
            Select scheduled delivery to remove
          </Dialog>
          <Dialog
            title="Are you sure?"
            actions={[
              <FlatButton
                label="No, cancel"
                primary={true}
                onClick={() => {
                  this.setState ({
                    deleteConfirmationDialog: false,
                  });
                }}
              />,
              <FlatButton
                label="Yes, delete"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleDelete}
              />,
            ]}
            modal={false}
            open={this.state.deleteConfirmationDialog}
            onRequestClose={() => {
              this.setState ({
                deleteConfirmationDialog: false,
              });
            }}
          >
            Do you want to delete {this.state.selected.length} scheduled
            {this.state.selected.length > 1 ? ' deliveries' : ' delivery'}
          </Dialog>
          <Snackbar
            open={this.state.snackbarOpen}
            message="Scheduled deliveries deleted"
            autoHideDuration={4000}
            onRequestClose={this.handleSnackbarClose}
          />
        </div>
      </div>
    );
  }
}

Subscriptions.propTypes = {
  token: PropTypes.string,
  url: PropTypes.string.isRequired,
};

export default Subscriptions;
