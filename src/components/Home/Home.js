import React from "react";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import Chip from "material-ui/Chip";
import Badge from "material-ui/Badge";
import Checkbox from "material-ui/Checkbox";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui-next/Table";
import LinearProgress from "material-ui/LinearProgress";

import DeliveryDialog from "./DeliveryDialog";
import SubscriptionDialog from "./SubscriptionDialog";
import "./Home.css";

// https://material.io/guidelines/style/color.html#color-color-palette
const CATEGORY_COLORS = {
  "#3f51b5": "white", // indigo
  "#cddc39": "black", // lime
  "#9c27b0": "white", // purple
  "#f44336": "white", // red
  "#009688": "white", // teal
  "#ffc107": "black", // amber
  "#8bc34a": "black", // light green
  "#ff5722": "white" // deep orange
};

const nextDelivery = subscriptions => {
  if (!subscriptions) {
    return;
  }
  const now = moment().toDate().getTime();
  const scheduled = subscriptions.map(subscription => {
    const tz = subscription.timezone;
    var nowInTz = moment(now).tz(tz);
    let nextScheduledDelivery = null;
    if (nowInTz.format("HH:mm") > subscription.time) {
      nextScheduledDelivery =
        nowInTz.add(1, "d").format("YYYY-MM-DD") + " " + subscription.time;
      // next tomorrow
    } else {
      nextScheduledDelivery =
        nowInTz.format("YYYY-MM-DD") + " " + subscription.time;
      // today
    }
    return moment.tz(nextScheduledDelivery, tz).toDate().getTime();
  });
  const soonestNextScheduledDelivery = Math.min.apply(Math, scheduled);
  return moment(now).to(moment(soonestNextScheduledDelivery));
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      search_text: "",
      selectedFeeds: [],
      deliveryOpen: false,
      subscriptionOpen: false,
      loading: false
    };
    this.onSearchTextChanged = this.onSearchTextChanged.bind(this);
    this.handleDeliveryOpen = this.handleDeliveryOpen.bind(this);
    this.handleDeliveryClose = this.handleDeliveryClose.bind(this);
    this.handleSubscriptionOpen = this.handleSubscriptionOpen.bind(this);
    this.handleSubscriptionClose = this.handleSubscriptionClose.bind(this);
    this.onSelectAllClick = this.onSelectAllClick.bind(this);
    this.categoryColors = {};
  }

  componentWillMount() {
    this.loadFeedsFromServer();
  }

  loadFeedsFromServer() {
    this.setState({
      loading: true
    });
    fetch(this.props.url + "/feeds", {
      headers: {
        Authorization: this.props.token
      }
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          data: json.filter(n => n.title),
          loading: false
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
      this.setState({ selectedFeeds: this.state.data });
    } else {
      this.setState({ selectedFeeds: [] });
    }
  }

  onSelectClick(feed, isInputChecked) {
    if (isInputChecked) {
      this.setState((previousState, props) => {
        previousState.selectedFeeds.push(feed);
        return {
          selectedFeeds: previousState.selectedFeeds
        };
      });
    } else {
      this.setState((previousState, props) => {
        const index = previousState.selectedFeeds.indexOf(feed);
        previousState.selectedFeeds.splice(index, 1);
        return {
          selectedFeeds: previousState.selectedFeeds
        };
      });
    }
  }

  onSearchTextChanged(e) {
    this.setState({
      search_text: e.target.value
    });
  }

  handleDeliveryOpen = () => {
    this.setState({ deliveryOpen: true });
  };

  handleDeliveryClose = () => {
    this.setState({ deliveryOpen: false });
  };

  handleSubscriptionOpen = () => {
    this.setState({ subscriptionOpen: true });
  };

  handleSubscriptionClose = () => {
    this.setState({ subscriptionOpen: false });
  };

  renderChip(data) {
    const color = this.categoryColor(data);
    const style = { "background-color": color };
    const classNames = [
      "Home__category_chip",
      "Home__category_chip_" + CATEGORY_COLORS[color]
    ];
    return (
      <Chip className={classNames.join(" ")} style={style}>
        {data}
      </Chip>
    );
  }

  render() {
    const feedIds = this.state.selectedFeeds.map(feed => feed.feedId);

    return (
      <div className="Home__wrapper">
        {this.state.loading && <LinearProgress mode="indeterminate" />}
        <div className="Home__table">
          <div className="Home__buttons">
            <RaisedButton
              className="Home__button"
              onTouchTap={this.handleDeliveryOpen}
              label="Deliver now"
              secondary={true}
              disabled={this.state.selectedFeeds.length === 0}
            />
            <DeliveryDialog
              open={this.state.deliveryOpen}
              handleClose={this.handleDeliveryClose}
              feeds={this.state.selectedFeeds}
            />
            <RaisedButton
              secondary={true}
              className="Home__button"
              onTouchTap={this.handleSubscriptionOpen}
              label="Schedule deliveries"
              disabled={this.state.selectedFeeds.length === 0}
            />
            <SubscriptionDialog
              open={this.state.subscriptionOpen}
              handleClose={this.handleSubscriptionClose}
              feeds={this.state.selectedFeeds}
            />

            <TextField
              className="Home__search"
              hintText="Search for feeds"
              onChange={this.onSearchTextChanged}
            />
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
                  <TableCell>Last delivery</TableCell>
                  <TableCell>Next delivery</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.data.map(
                  (feed, index) =>
                    (!this.state.search_text ||
                      feed.title
                        .toLowerCase()
                        .includes(this.state.search_text.toLowerCase())) &&
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
                              feed.unreadCount > 99 ? "99+" : feed.unreadCount
                            }
                            className="Home__feed_badge"
                          >
                            {feed.title}
                          </Badge>
                        </div>
                        {feed.categories &&
                          feed.categories.map(this.renderChip, this)}
                      </TableCell>
                      <TableCell>
                        {feed.lastDelivery &&
                          moment(feed.lastDelivery.deliveryDate).fromNow()}
                      </TableCell>
                      <TableCell>
                        {nextDelivery(feed.subscriptions)}
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          }
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  token: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default Home;
