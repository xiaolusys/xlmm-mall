import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import * as utils from 'utils';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Image } from 'components/Image';
import * as actionCreators from 'actions/mama/activity/list';

import './index.scss';

@connect(
  state => ({
    mamaActivityList: state.mamaActivityList,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

export default class List extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    mamaActivityList: React.PropTypes.any,
    fetchActivityList: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    this.props.fetchActivityList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mamaActivityList.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  render() {
    const data = this.props.mamaActivityList.data || [];
    console.log(data);
    return (
      <div>
        <Header title="参加活动" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content mama-activity-container">
          <If condition={!_.isEmpty(data)}>
            <ul className="margin-bottom-lg">
              {data.map((activity, index) => {
                return (
                  <a href={activity.act_link} key={activity.id}>
                    <li className="row no-margin margin-top-xs">
                      <Image className="col-xs-12 no-padding" src={activity.act_img} key={index}/>
                      <p className="col-xs-12 no-margin no-padding padding-top-xs padding-bottom-xs content-white-bg">
                        <span className="col-xs-8 text-left no-wrap">{activity.title}</span>
                        <span className="col-xs-4 text-right font-orange">{activity.total_member_num + '人参与'}</span>
                      </p>
                    </li>
                  </a>
                );
              })}
            </ul>
          </If>
          <div className="row no-margin text-center top-border tab">
            <a href="">
              <p className="col-xs-6 no-margin no-padding">
                <span>课堂知识</span>
              </p>
            </a>
            <p className="col-xs-6 no-margin no-padding font-orange">
              <span>参加活动</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
