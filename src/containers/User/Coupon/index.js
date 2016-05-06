import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Loader } from 'components/Loader';
import * as pointAction from 'actions/user/point';
import * as pointLogAction from 'actions/user/pointLog';

import './index.scss';
const actionCreators = _.extend(pointAction, pointLogAction);

@connect(
  state => ({
    point: {
      data: state.point.data,
      isLoading: state.point.isLoading,
      error: state.point.error,
      success: state.point.success,
    },
    pointLog: {
      data: state.pointLog.data,
      isLoading: state.pointLog.isLoading,
      error: state.pointLog.error,
      success: state.pointLog.success,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

export default class Coupon extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    point: React.PropTypes.any,
    pointLog: React.PropTypes.any,
    fetchPoint: React.PropTypes.func,
    fetchPointLogs: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    this.props.fetchPoint();
    this.props.fetchPointLogs();
  }

  render() {
    return (
      <div>
        <Header title="优惠劵" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="has-header content point-container">
          <Footer/>
        </div>
      </div>
    );
  }
}
