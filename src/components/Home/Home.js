import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import Chip from 'material-ui/Chip';
import Badge from 'material-ui/Badge';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui-next/Table';
import LinearProgress from 'material-ui/LinearProgress';

import DeliveryDialog from './DeliveryDialog';
import SubscriptionDialog from './SubscriptionDialog';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';

import {Mobile, Desktop, AboveMobile} from '../../breakpoints';

import './Home.css';

// https://material.io/guidelines/style/color.html#color-color-palette
const CATEGORY_COLORS = {
  '#3f51b5': 'white', // indigo
  '#cddc39': 'black', // lime
  '#9c27b0': 'white', // purple
  '#f44336': 'white', // red
  '#009688': 'white', // teal
  '#ffc107': 'black', // amber
  '#8bc34a': 'black', // light green
  '#ff5722': 'white', // deep orange
};

const nextDelivery = subscriptions => {
  if (!subscriptions) {
    return;
  }
  const now = moment()
    .toDate()
    .getTime();
  const scheduled = subscriptions.map(subscription => {
    const tz = subscription.timezone;
    var nowInTz = moment(now).tz(tz);
    let nextScheduledDelivery = null;
    if (nowInTz.format('HH:mm') > subscription.time) {
      nextScheduledDelivery =
        nowInTz.add(1, 'd').format('YYYY-MM-DD') + ' ' + subscription.time;
      // next tomorrow
    } else {
      nextScheduledDelivery =
        nowInTz.format('YYYY-MM-DD') + ' ' + subscription.time;
      // today
    }
    return moment
      .tz(nextScheduledDelivery, tz)
      .toDate()
      .getTime();
  });
  const soonestNextScheduledDelivery = Math.min.apply(Math, scheduled);
  return moment(now).to(moment(soonestNextScheduledDelivery));
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      search_text: '',
      selectedFeeds: [],
      deliveryOpen: false,
      subscriptionOpen: false,
      loading: false,
      deliverySnackbarOpen: false,
    };
    this.onSearchTextChanged = this.onSearchTextChanged.bind(this);
    this.handleDeliveryOpen = this.handleDeliveryOpen.bind(this);
    this.handleDeliveryClose = this.handleDeliveryClose.bind(this);
    this.handleSubscriptionOpen = this.handleSubscriptionOpen.bind(this);
    this.handleSubscriptionClose = this.handleSubscriptionClose.bind(this);
    this.onSelectAllClick = this.onSelectAllClick.bind(this);
    this.handleDeliverNow = this.handleDeliverNow.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.categoryColors = {};
  }

  componentWillMount() {
    this.loadFeedsFromServer();
  }

  componentDidMount() {
    document.title = 'Home | Keendly';
  }

  loadFeedsFromServer() {
    this.setState({
      loading: true,
    });
    fetch(this.props.url + '/feeds', {
      headers: {
        Authorization: this.props.token,
      },
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          data: json.filter(n => n.title),
          loading: false,
        });
      });
  }

  categoryColor(category) {
    if (!this.categoryColors[category]) {
      const index =
        Object.keys(this.categoryColors).length %
        Object.keys(CATEGORY_COLORS).length;
      const color = Object.keys(CATEGORY_COLORS)[index];
      this.categoryColors[category] = color;
      return color;
    }
    return this.categoryColors[category];
  }

  onSelectAllClick(event, isInputChecked) {
    if (isInputChecked) {
      this.setState({selectedFeeds: this.state.data});
    } else {
      this.setState({selectedFeeds: []});
    }
  }

  onSelectClick(feed, isInputChecked) {
    if (isInputChecked) {
      this.setState((previousState, props) => {
        previousState.selectedFeeds.push(feed);
        return {
          selectedFeeds: previousState.selectedFeeds,
        };
      });
    } else {
      this.setState((previousState, props) => {
        const index = previousState.selectedFeeds.indexOf(feed);
        previousState.selectedFeeds.splice(index, 1);
        return {
          selectedFeeds: previousState.selectedFeeds,
        };
      });
    }
  }

  onSearchTextChanged(e) {
    this.setState({
      search_text: e.target.value,
    });
  }

  handleDeliveryOpen = () => {
    if (this.state.selectedFeeds.length === 0) {
      this.setState({
        nothingSelectedDialogOpen: true,
      });
    } else {
      this.setState({deliveryOpen: true});
    }
  };

  handleDeliveryClose = () => {
    this.setState({deliveryOpen: false});
  };

  handleDeliverNow(includeImages, extractArticle, markAsRead, callback) {
    fetch(this.props.url + '/deliveries', {
      headers: {
        Authorization: this.props.token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        manual: true,
        timezone: moment.tz.guess(),
        items: this.state.selectedFeeds.map(f => {
          return {
            title: f.title,
            feedId: f.feedId,
            includeImages: includeImages,
            fullArticle: extractArticle,
            markAsRead: markAsRead,
          };
        }),
      }),
    }).then(response => {
      if (response.ok) {
        this.setState({
          deliverySnackbarOpen: true,
          deliveryOpen: false,
          error: false,
        });
        this.loadFeedsFromServer();
      } else if (response.status === 400) {
        response.json().then(json => {
          this.setState({
            error: json.description,
            deliveryOpen: false,
          });
        });
      } else {
        this.setState({
          error: 'Error starting delivery, try again later',
          deliveryOpen: false,
        });
      }
      callback();
    });
  }

  handleSubscriptionOpen = () => {
    if (this.state.selectedFeeds.length === 0) {
      this.setState({
        nothingSelectedDialogOpen: true,
      });
    } else {
      this.setState({subscriptionOpen: true});
    }
  };

  handleSubscriptionClose = () => {
    this.setState({subscriptionOpen: false});
  };

  handleSubscribe(
    time,
    timezone,
    includeImages,
    extractArticle,
    markAsRead,
    callback
  ) {
    fetch(this.props.url + '/subscriptions', {
      headers: {
        Authorization: this.props.token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        time: time,
        timezone: timezone,
        feeds: this.state.selectedFeeds.map(f => {
          return {
            title: f.title,
            feedId: f.feedId,
            includeImages: includeImages,
            fullArticle: extractArticle,
            markAsRead: markAsRead,
          };
        }),
      }),
    }).then(response => {
      if (response.ok) {
        this.setState({
          subscriptionSnackbarOpen: true,
          subscriptionOpen: false,
          error: false,
        });
        this.loadFeedsFromServer();
      } else if (response.status === 400) {
        response.json().then(json => {
          this.setState({
            error: json.description,
            subscriptionOpen: false,
          });
        });
      } else {
        this.setState({
          error: 'Error starting delivery, try again later',
          subscriptionOpen: false,
        });
      }
      callback();
    });
  }

  renderChip(data) {
    const color = this.categoryColor(data);
    const style = {'background-color': color};
    const classNames = [
      'Home__category_chip',
      'Home__category_chip_' + CATEGORY_COLORS[color],
    ];
    return (
      <Chip className={classNames.join(' ')} style={style}>
        {data}
      </Chip>
    );
  }

  render() {
    const feedIds = this.state.selectedFeeds.map(feed => feed.feedId);

    return (
      <div className="Home__wrapper">
        {this.state.loading && <LinearProgress mode="indeterminate" />}
        {!this.state.loading && (
          <div className="Home__table">
            {this.state.error && (
              <div className="Home__message Home__error">
                {this.state.error}
              </div>
            )}
            <div className="Home__buttons">
              <RaisedButton
                className="Home__button"
                onTouchTap={this.handleDeliveryOpen}
                label="Deliver now"
                secondary={true}
              />
              <DeliveryDialog
                open={this.state.deliveryOpen}
                handleClose={this.handleDeliveryClose}
                handleDeliver={this.handleDeliverNow}
                feeds={this.state.selectedFeeds}
              />
              <RaisedButton
                secondary={true}
                className="Home__button"
                onTouchTap={this.handleSubscriptionOpen}
                label="Schedule deliveries"
              />
              <SubscriptionDialog
                open={this.state.subscriptionOpen}
                handleClose={this.handleSubscriptionClose}
                handleSubscribe={this.handleSubscribe}
                feeds={this.state.selectedFeeds}
              />
              <Dialog
                modal={false}
                open={this.state.nothingSelectedDialogOpen}
                onRequestClose={() => {
                  this.setState({
                    nothingSelectedDialogOpen: false,
                  });
                }}
              >
                First select feeds to deliver
              </Dialog>
              <AboveMobile>
                <TextField
                  className="Home__search_right"
                  hintText="Search for feeds"
                  onChange={this.onSearchTextChanged}
                />
              </AboveMobile>
              <Mobile>
                <TextField
                  className="Home__search_center"
                  hintText="Search for feeds"
                  onChange={this.onSearchTextChanged}
                />
              </Mobile>
            </div>
            {
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell checkbox>
                      <Checkbox
                        onCheck={this.onSelectAllClick}
                        checked={
                          this.state.selectedFeeds.length ===
                          this.state.data.length
                        }
                      />
                    </TableCell>
                    <TableCell>Title</TableCell>
                    <AboveMobile>
                      <TableCell>Last delivery</TableCell>
                    </AboveMobile>
                    <Desktop>
                      <TableCell>Next delivery</TableCell>
                    </Desktop>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.data.map(
                    (feed, index) =>
                      (!this.state.search_text ||
                        feed.title
                          .toLowerCase()
                          .includes(this.state.search_text.toLowerCase())) && (
                        <TableRow key={index} className="Home__feed_row">
                          <TableCell checkbox>
                            <Checkbox
                              onCheck={(event, isInputChecked) =>
                                this.onSelectClick(feed, isInputChecked)}
                              checked={feedIds.indexOf(feed.feedId) !== -1}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="Home__feed_title">
                              <Badge
                                badgeContent={
                                  feed.unreadCount > 99
                                    ? '99+'
                                    : feed.unreadCount ? feed.unreadCount : '0'
                                }
                                className="Home__feed_badge"
                              >
                                {feed.title}
                              </Badge>
                            </div>
                            {feed.categories &&
                              feed.categories.map(this.renderChip, this)}
                          </TableCell>
                          <AboveMobile>
                            <TableCell>
                              {feed.lastDelivery &&
                                moment(
                                  feed.lastDelivery.deliveryDate
                                ).fromNow()}
                            </TableCell>
                          </AboveMobile>
                          <Desktop>
                            <TableCell>
                              {nextDelivery(feed.subscriptions)}
                            </TableCell>
                          </Desktop>
                        </TableRow>
                      )
                  )}
                </TableBody>
              </Table>
            }
          </div>
        )}
        <Snackbar
          open={this.state.deliverySnackbarOpen}
          message="Delivery started"
          onRequestClose={() => {
            this.setState({
              deliverySnackbarOpen: false,
            });
          }}
        />
        <Snackbar
          open={this.state.subscriptionSnackbarOpen}
          message="Deliveries scheduled"
          onRequestClose={() => {
            this.setState({
              subscriptionSnackbarOpen: false,
            });
          }}
        />
      </div>
    );
  }
}

Home.propTypes = {
  token: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Home;
