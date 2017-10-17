import React from 'react';

import IconButton from 'material-ui/IconButton';

export default class ExpansionPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      expandedTitle: this.props.expandedTitle,
      titleContent: this.props.titleContent,
      panelState: 'collapsed',
    };
  }

  render() {
    const iconStyle = {
      color: 'black',
      opacity: 0.54,
    };

    return (
      <div
        className="expPanel"
        ref={panel => {
          this.panel = panel;
        }}
      >
        <div
          className="panelTitle"
          onClick={event => {
            this.toggleExpand(event);
          }}
        >
          <div className="title">
            <span className="text">{this.state.title}</span>
          </div>

          <div className="actions">
            {this.state.panelState === 'collapsed' ? (
              <IconButton iconStyle={iconStyle} iconClassName="material-icons">
                expand_more
              </IconButton>
            ) : (
              <IconButton iconStyle={iconStyle} iconClassName="material-icons">
                expand_less
              </IconButton>
            )}
          </div>
          <div className="clear" />
        </div>
        <div className="panelExpanded">
          <div className="panelContent">{this.props.children}</div>
        </div>
      </div>
    );
  }

  actionIconsClick(event, callback, additionalParams) {
    event.stopPropagation();
    if (!callback) {
      this.toggleExpand(event);
    } else {
      callback(additionalParams);
    }
  }

  toggleExpand(event) {
    console.log(event);
    if (this.state.panelState === 'collapsed') {
      this.setState({
        panelState: 'expanded',
      });
    } else {
      this.setState({
        panelState: 'collapsed',
      });
    }
    this.panel.classList.toggle('active');
  }

  componentDidMount() {}
  componentWillUnmount() {}
}
