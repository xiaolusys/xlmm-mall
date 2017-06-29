import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { wrapReactLifecycleMethodsWithTryCatch } from 'react-component-errors';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { BottomBar } from 'components/BottomBar';
import _ from 'underscore';
import * as constants from 'constants';
import * as utils from 'utils';
import * as plugins from 'plugins';
import * as jimayAgentAction from 'actions/order/jimay';

import './index.scss';

const actionCreators = _.extend({}, jimayAgentAction);
@connect(
  state => ({
    agent: state.jimayAgent,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
export default class JimayAgentRelShip extends Component {
  static propTypes = {
    location: React.PropTypes.object,
    agent: React.PropTypes.object,
    fetchJimayAgentRelship: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
  }

  componentWillMount() {
    this.props.fetchJimayAgentRelship();
  }

  componentWillReceiveProps(nextProps) {
    const agent = nextProps.agent;
    console.log('jimay', agent);
    if (agent.success && agent.data.code > 0) {
      Toast.show(agent.data.info);
    }
    if (agent.isLoading || agent.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  componentWillUnmount() {
    // this.props.resetApplyNegotiableCoupons();
  }

  render() {
    const agent = this.props.agent || {};
    const parentAgent = _.isEmpty(agent.data) ? {} : agent.data.parent_agent;
    const subAgents = _.isEmpty(agent.data) ? {} : agent.data.sub_agents;
    return (
      <div className="jimay-agent">
        <Header title="我的关系" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="jimay-agent-container">
          <If condition={!_.isEmpty(parentAgent)}>
            <p className="margin-top-lg margin-left-xs font-xs">我de推荐导师</p>
            <ul className="row jimay-agent-list top-border">
              <li key={parentAgent.id} className="row no-margin ">
                <div className="col-xs-3 no-padding">
                  <div className="thumbnail">
                    <img src={parentAgent.thumbnail + constants.image.square} />
                  </div>
                </div>
                <div className="col-xs-9 no-padding">
                  <p>
                    <span className="font-md font-grey">{ parentAgent.name }</span>
                    <a href={ 'tel:' + parentAgent.mobile} className="font-md font-orange font-weight-600 margin-right-lg pull-right">{ parentAgent.mobile }<i className="icon-phone"></i></a>
                  </p>
                </div>
              </li>
            </ul>
          </If>
        </div>
        <div className="jimay-agent-container">
          <If condition={!_.isEmpty(subAgents)}>
            <p className="margin-top-lg margin-left-xs font-xs">我邀请de学生</p>
            <ul className="row jimay-agent-list top-border">
              {_.isEmpty(subAgents) || agent.error ? null : subAgents.map((item) => {
                return (
                  <li key={item.id} className="row no-margin ">
                    <div className="col-xs-3 no-padding">
                      <div className="thumbnail">
                        <img src={item.thumbnail + constants.image.square} />
                      </div>
                    </div>
                    <div className="col-xs-9 no-padding">
                      <p>
                        <span className="font-md font-grey">{ item.name }</span>
                        <a href={ 'tel:' + item.mobile} className="font-md font-orange font-weight-600 margin-right-lg pull-right">{ item.mobile }<i className="icon-phone"></i></a>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </If>
        </div>
      </div>
    );
  }
}
