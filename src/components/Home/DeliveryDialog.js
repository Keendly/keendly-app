import React from "react";
import PropTypes from "prop-types";
import Checkbox from "material-ui/Checkbox";
import Chip from "material-ui/Chip";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import { List, ListItem } from "material-ui/List";
import ExpansionPanel from "../ExpansionPanel";

class DeliveryDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simpleMode: true,
      simple: {
        includeImages: true,
        extractArticle: true,
        markAsRead: true
      }
    };
  }

  render() {
    if (this.state.simpleMode) {
      const articlesCount = this.props.feeds
        .map(feed => feed.unreadCount)
        .reduce((a, b) => a + b, 0);
      const title =
        this.props.feeds.length === 1
          ? "Deliver " + articlesCount + " articles"
          : "Deliver " +
            articlesCount +
            " articles from " +
            this.props.feeds.length +
            " feeds";

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
              label="Deliver now"
              primary={true}
              keyboardFocused={true}
              onTouchTap={() =>
                this.props.handleDeliver(
                  this.state.simple.includeImages,
                  this.state.simple.extractArticle,
                  this.state.simple.markAsRead
                )}
            />
          ]}
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
        >
          <List className="Home__feedList">
            {this.props.feeds.map(feed =>
              <ListItem
                className="Home__feedListItem"
                disabled
                primaryText={feed.title}
                rightAvatar={
                  <Chip className="Home__feedListUnread" size={30}>
                    {feed.unreadCount} new
                  </Chip>
                }
              />
            )}
          </List>
          <ExpansionPanel title="Options" expandedTitle="Expanded Title">
            <div className="Home__feedOption">
              <Checkbox
                onCheck={(event, isInputChecked) => {
                  this.setState((previousState, props) => {
                    const simple = previousState.simple;
                    simple.includeImages = isInputChecked;
                    return {
                      simple
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
                      simple
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
                      simple
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
  handleDeliver: PropTypes.func.isRequired,
  feeds: PropTypes.array.isRequired
};

export default DeliveryDialog;
