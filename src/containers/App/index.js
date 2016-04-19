import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// global styles for app
import './styles/app.scss';

export class App extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    location: React.PropTypes.any,
  };

  render() {
    return (
      <div>
        <ReactCSSTransitionGroup component="section" transitionName="slide" transitionEnterTimeout={800} transitionLeaveTimeout={500}>
          {React.cloneElement(this.props.children, {
            key: this.props.location.pathname,
          })}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
