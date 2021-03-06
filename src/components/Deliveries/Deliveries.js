import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Pagination from '../Pagination';
import LinearProgress from 'material-ui/LinearProgress';
import Chip from 'material-ui/Chip';

import {AboveMobile} from '../../breakpoints';

import './Deliveries.css';

const PAGE_SIZE = 20;

class Deliveries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      data: [],
      loading: false,
    };

    this.handlePageChanged = this.handlePageChanged.bind(this);
  }

  componentWillMount() {
    this.loadDeliveriesFromServer(1);
  }

  componentDidMount() {
    document.title = 'History | Keendly';
  }

  handlePageChanged(page) {
    this.setState({page});
    this.loadDeliveriesFromServer(page);
  }

  loadDeliveriesFromServer(page) {
    this.setState({
      loading: true,
    });
    fetch(
      this.props.url + '/deliveries?page=' + page + '&pageSize=' + PAGE_SIZE,
      {
        headers: {
          Authorization: this.props.token,
        },
      }
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          data: json,
          loading: false,
        });
      })
      .catch(error => {
        window.location.replace('login');
      });
  }

  status(delivery) {
    if (delivery.deliveryDate) {
      return 'delivered';
    }
    if (delivery.error) {
      if (delivery.error === 'NO ARTICLES') {
        return 'no articles';
      } else {
        return 'failed';
      }
    } else {
      if (
        moment(delivery.created)
          .add(30, 'minutes')
          .isAfter(moment())
      ) {
        return 'in progress';
      } else {
        return 'failed';
      }
    }
  }

  statusChip(delivery) {
    const status = this.status(delivery);
    const color = {
      delivered: '#C5E1A5',
      failed: '#ef9a9a',
      'in progress': '#81D4FA',
      'no articles': '#BDBDBD',
    }[status];

    return (
      <Chip className="Deliveries__status" style={{'background-color': color}}>
        {status}
      </Chip>
    );
  }

  render() {
    return (
      <div className="Deliveries__wrapper">
        {this.state.loading && <LinearProgress mode="indeterminate" />}

        <div className="Deliveries__table">
          {!this.state.loading &&
            this.state.data.length === 0 &&
            this.state.page === 1 && (
              <div className="Deliveries__message">
                Looks like your history is empty. Go to <a href="/">Home</a> to
                send some articles to your Kindle.
              </div>
            )}
          {!this.state.loading &&
            (this.state.data.length !== 0 || this.state.page > 1) && (
              <div>
                <Table selectable={false}>
                  <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                  >
                    <TableRow>
                      <TableHeaderColumn>Feeds</TableHeaderColumn>
                      <AboveMobile>
                        <TableHeaderColumn style={{width: '100px'}}>
                          Status
                        </TableHeaderColumn>
                      </AboveMobile>
                      <TableHeaderColumn>Delivery date</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    {this.state.data.map((delivery, index) => (
                      <TableRow key={index}>
                        <TableRowColumn>
                          {delivery.items &&
                            delivery.items
                              .map(item => item.title)
                              .join(' \u2022 ')}
                        </TableRowColumn>
                        <AboveMobile>
                          <TableRowColumn style={{width: '100px'}}>
                            {this.statusChip(delivery)}
                          </TableRowColumn>
                        </AboveMobile>
                        <TableRowColumn>
                          {delivery.deliveryDate &&
                            moment(delivery.deliveryDate).format('llll')}
                        </TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  currentPage={this.state.page}
                  pageSize={PAGE_SIZE}
                  handlePageChange={this.handlePageChanged}
                />
              </div>
            )}
        </div>
      </div>
    );
  }
}

Deliveries.propTypes = {
  token: PropTypes.string,
  url: PropTypes.string.isRequired,
};

export default Deliveries;
