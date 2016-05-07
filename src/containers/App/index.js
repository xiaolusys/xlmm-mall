import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// global styles for app
import './styles/app.scss';

export class App extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    location: React.PropTypes.any,
  };

  componentWillMount() {
    const query = this.props.location.query;
    window.document.cookie = 'mm_linkid=' + query.mm_linkid;
    window.document.cookie = 'ufrom=' + query.ufrom;
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
