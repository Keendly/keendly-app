import React from "react";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import Chip from "material-ui/Chip";
import Badge from "material-ui/Badge";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";

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
      selectedRows: []
    };
    this.onRowSelection = this.onRowSelection.bind(this);
    this.onSearchTextChanged = this.onSearchTextChanged.bind(this);
    this.handleDeliveryOpen = this.handleDeliveryOpen.bind(this);
    this.handleDeliveryClose = this.handleDeliveryClose.bind(this);
    this.handleSubscriptionOpen = this.handleSubscriptionOpen.bind(this);
    this.handleSubscriptionClose = this.handleSubscriptionClose.bind(this);
    this.categoryColors = {};
  }

  componentWillMount() {
    this.loadFeedsFromServer();
  }

  loadFeedsFromServer() {
    fetch(this.props.url + "/feeds", {
      headers: {
        Authorization: this.props.token
      }
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          data: json.filter(n => n.title)
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

  onRowSelection(selectedRows) {
    console.log(selectedRows);
    if (selectedRows === "none") {
      this.setState({ selectedRows: [] }, () =>
        this.tableBody.setState({ selectedRows: [] })
      );
    } else if (selectedRows === "all") {
      const rows = this.state.data.map((item, index) => index);
      this.setState({ selectedRows: rows }, () =>
        this.tableBody.setState({ selectedRows: rows })
      );
    } else {
      this.setState({ selectedRows }, () =>
        this.tableBody.setState({ selectedRows })
      );
    }
  }

  onSearchTextChanged(e) {
    this.setState({
      search_text: e.target.value
    });
  }

  handleDeliveryOpen() {
    console.log(this.state.selectedRows);
  }

  handleDeliveryClose() {}

  handleSubscriptionOpen() {}

  handleSubscriptionClose() {}

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
    return (
      <div className="Home__table">
        <div className="Home__buttons">
          <RaisedButton
            className="Home__button"
            onTouchTap={this.handleDeliveryOpen}
            label="Deliver now"
            secondary={true}
          />

          <RaisedButton
            secondary={true}
            className="Home__button"
            label="Schedule delivery"
          />

          <TextField
            className="Home__search"
            hintText="Search for feeds"
            onChange={this.onSearchTextChanged}
          />
        </div>
        <Table multiSelectable={true} onRowSelection={this.onRowSelection}>
          <TableHeader enableSelectAll={true}>
            <TableRow>
              <TableHeaderColumn style={{ width: "50%" }}>
                Title
              </TableHeaderColumn>
              <TableHeaderColumn>Last delivery</TableHeaderColumn>
              <TableHeaderColumn>Next delivery</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            ref={tableBody => {
              this.tableBody = tableBody;
            }}
          >
            {this.state.data.map(
              (feed, index) =>
                (!this.state.search_text ||
                  feed.title
                    .toLowerCase()
                    .includes(this.state.search_text.toLowerCase())) &&
                <TableRow
                  key={index}
                  className="Home__feed_row"
                  selected={this.state.selectedRows.indexOf(index) !== -1}
                >
                  >
                  <TableRowColumn style={{ width: "50%" }}>
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
                  </TableRowColumn>
                  <TableRowColumn>
                    {feed.lastDelivery &&
                      moment(feed.lastDelivery.deliveryDate).fromNow()}
                  </TableRowColumn>
                  <TableRowColumn>
                    {nextDelivery(feed.subscriptions)}
                  </TableRowColumn>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

Home.propTypes = {
  token: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default Home;
