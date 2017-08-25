import React from "react";
import PropTypes from "prop-types";
import Checkbox from "material-ui/Checkbox";
import RaisedButton from "material-ui/RaisedButton";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui-next/Table";
import Pagination from "../Pagination";
import LinearProgress from "material-ui/LinearProgress";
import Chip from "material-ui/Chip";

import "./Subscriptions.css";

const PAGE_SIZE = 20;

class Subscriptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      data: [],
      selected: [],
      loading: false
    };

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.onSelectAllClick = this.onSelectAllClick.bind(this);
  }

  componentWillMount() {
    this.loadSubscriptionsFromServer(1);
  }

  componentDidMount() {
    document.title = "Scheduled | Keendly";
  }

  handlePageChanged(page) {
    this.setState({ page });
    this.loadSubscriptionsFromServer(page);
  }

  loadSubscriptionsFromServer(page) {
    this.setState({
      loading: true
    });
    fetch(
      this.props.url + "/subscriptions?page=" + page + "&pageSize=" + PAGE_SIZE,
      {
        headers: {
          Authorization: this.props.token
        }
      }
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          data: json,
          loading: false
        });
      });
  }

  onSelectAllClick(event, isInputChecked) {
    if (isInputChecked) {
      this.setState({ selected: this.state.data });
    } else {
      this.setState({ selected: [] });
    }
  }

  onSelectClick(subscription, isInputChecked) {
    if (isInputChecked) {
      this.setState((previousState, props) => {
        previousState.selected.push(subscription);
        return {
          selected: previousState.selected
        };
      });
    } else {
      this.setState((previousState, props) => {
        const index = previousState.selected.indexOf(subscription);
        previousState.selected.splice(index, 1);
        return {
          selected: previousState.selected
        };
      });
    }
  }

  render() {
    const ids = this.state.selected.map(s => s.id);

    return (
      <div className="Deliveries__wrapper">
        {this.state.loading && <LinearProgress mode="indeterminate" />}
        <div className="Subscriptions__table">
          {this.state.data.length === 0 && <div>empty</div>}
          <div className="Subscriptions__buttons">
            <RaisedButton
              className="Subscription__delete"
              onTouchTap={this.handleDeliveryOpen}
              label="Delete"
              secondary={true}
            />
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell checkbox>
                  <Checkbox
                    onCheck={this.onSelectAllClick}
                    checked={
                      this.state.selected.length === this.state.data.length
                    }
                  />
                </TableCell>
                <TableCell>Feeds</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Delivery time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.data.map((subscription, index) =>
                <TableRow key={index}>
                  <TableCell checkbox>
                    <Checkbox
                      onCheck={(event, isInputChecked) =>
                        this.onSelectClick(subscription, isInputChecked)}
                      checked={ids.indexOf(subscription.id) !== -1}
                    />
                  </TableCell>
                  <TableCell>
                    {subscription.feeds &&
                      subscription.feeds
                        .map(item => item.title)
                        .join(" \u2022 ")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      className="Subscriptions__status"
                      style={{ "background-color": "#C5E1A5" }}
                    >
                      active
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {subscription.time} ({subscription.timezone})
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination
            currentPage={this.state.page}
            pageSize={PAGE_SIZE}
            handlePageChange={this.handlePageChanged}
          />
        </div>
      </div>
    );
  }
}

Subscriptions.propTypes = {
  token: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default Subscriptions;
