import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import Pagination from "../Pagination";

import "./Deliveries.css";

const PAGE_SIZE = 20;

class Deliveries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      data: []
    };

    this.handlePageChanged = this.handlePageChanged.bind(this);
  }

  componentWillMount() {
    this.loadCommentsFromServer(1);
  }

  handlePageChanged(page) {
    this.setState({ page });
    this.loadCommentsFromServer(page);
  }

  loadCommentsFromServer(page) {
    fetch(
      this.props.url + "/deliveries?page=" + page + "&pageSize=" + PAGE_SIZE,
      {
        headers: {
          Authorization: this.props.token
        }
      }
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          data: json
        });
      });
  }

  render() {
    return (
      <div className="Deliveries__table">
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Feeds</TableHeaderColumn>
              <TableHeaderColumn>Delivery date</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.data.map((delivery, index) =>
              <TableRow key={index}>
                <TableRowColumn>
                  {delivery.items &&
                    delivery.items.map(item => item.title).join(" \u2022 ")}
                </TableRowColumn>
                <TableRowColumn>
                  {delivery.deliveryDate &&
                    moment(delivery.deliveryDate).format("llll")}
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination
          currentPage={this.state.page}
          handlePageChange={this.handlePageChanged}
        />
      </div>
    );
  }
}

Deliveries.propTypes = {
  token: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default Deliveries;
