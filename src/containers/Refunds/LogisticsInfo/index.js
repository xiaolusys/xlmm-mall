import React, { Component } from 'react';

export default class LogisticsInfo extends Component {
  static PropTypes = {
    children: React.PropTypes.array,
    data: React.PropTypes.any,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  componentWillMount() {

  }

  render() {

  }

}
