import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import LinearProgress from 'material-ui/LinearProgress';
import ExpansionPanel from '../ExpansionPanel';
// import moment from "moment";
import moment from 'moment-timezone';

class DeliveryDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: moment().format('HH:00'),
      timezone: moment.tz.guess(),
      simpleMode: true,
      simple: {
        includeImages: true,
        extractArticle: true,
        markAsRead: true,
      },
    };
  }

  handleTimeChange = (event, index, time) => this.setState({time});

  handleTimezoneChange = (event, index, timezone) => this.setState({timezone});

  render() {
    if (this.state.simpleMode) {
      const title =
        this.props.feeds.length === 1
          ? 'Schedule daily deliveries'
          : 'Schedule daily deliveries of ' +
            this.props.feeds.length +
            ' feeds';

      const timeItems = [].concat(
        [...Array(24)].map((x, i) => (i < 10 ? '0' + i : i)).map(hour => {
          return [
            <MenuItem value={hour + ':00'} primaryText={hour + ':00'} />,
            <MenuItem value={hour + ':30'} primaryText={hour + ':30'} />,
          ];
        })
      );

      const timezones = moment.tz
        .names()
        .map(timezone => (
          <MenuItem value={timezone} primaryText={timezone} key={timezone} />
        ));

      return (
        <Dialog
          title={title}
          autoScrollBodyContent={true}
          actions={[
            <FlatButton
              label="Cancel"
              primary={true}
              onTouchTap={this.props.handleClose}
            />,
            <FlatButton
              label="Schedule"
              primary={true}
              keyboardFocused={true}
              onTouchTap={() => {
                this.setState({
                  loading: true,
                });
                this.props.handleSubscribe(
                  this.state.time,
                  this.state.timezone,
                  this.state.simple.includeImages,
                  this.state.simple.extractArticle,
                  this.state.simple.markAsRead,
                  () =>
                    this.setState({
                      loading: false,
                    })
                );
              }}
            />,
          ]}
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
        >
          {this.state.loading && <LinearProgress mode="indeterminate" />}
          <SelectField
            className="Home__timeSelect"
            floatingLabelText="Delivery time"
            value={this.state.time}
            onChange={this.handleTimeChange}
          >
            {timeItems}
          </SelectField>
          <SelectField
            className="Home__timezoneSelect"
            floatingLabelText="Your timezone"
            value={this.state.timezone}
            onChange={this.handleTimezoneChange}
          >
            {timezones}
          </SelectField>
          <List className="Home__feedList">
            {this.props.feeds.map(feed => (
              <ListItem
                className="Home__feedListItem"
                disabled
                primaryText={feed.title}
              />
            ))}
          </List>
          <ExpansionPanel title="Options" expandedTitle="Expanded Title">
            <div className="Home__feedOption">
              <Checkbox
                onCheck={(event, isInputChecked) => {
                  this.setState((previousState, props) => {
                    const simple = previousState.simple;
                    simple.includeImages = isInputChecked;
                    return {
                      simple,
                    };
                  });
                }}
                checked={this.state.simple.includeImages}
                label="Include images"
                labelPosition="left"
              />
            </div>
            <div className="Home__feedOption">
              <Checkbox
                onCheck={(event, isInputChecked) => {
                  this.setState((previousState, props) => {
                    const simple = previousState.simple;
                    simple.extractArticle = isInputChecked;
                    return {
                      simple,
                    };
                  });
                }}
                checked={this.state.simple.extractArticle}
                label="Fetch full article content from webpage"
                labelPosition="left"
              />
            </div>
            <div className="Home__feedOption">
              <Checkbox
                onCheck={(event, isInputChecked) => {
                  this.setState((previousState, props) => {
                    const simple = previousState.simple;
                    simple.markAsRead = isInputChecked;
                    return {
                      simple,
                    };
                  });
                }}
                checked={this.state.simple.markAsRead}
                label=" Mark sent articles as read"
                labelPosition="left"
              />
            </div>
          </ExpansionPanel>
        </Dialog>
      );
    } else {
      return {};
    }
  }
}

DeliveryDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubscribe: PropTypes.func.isRequired,
  feeds: PropTypes.array.isRequired,
};

export default DeliveryDialog;
