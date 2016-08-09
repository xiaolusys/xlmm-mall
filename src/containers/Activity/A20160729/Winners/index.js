import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Image } from 'components/Image';
import * as actionCreators from 'actions/activity/entrepreneurship';

import './index.scss';

@connect(
  state => ({
    entrepreneurship: state.entrepreneurship,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

export default class Winners extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    entrepreneurship: React.PropTypes.any,
    fetchInviteAward: React.PropTypes.func,
    fetchIncomeAward: React.PropTypes.func,
    fetchTeamAward: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }
  state = {
    activeTab: 'invite',
  }

  componentWillMount() {
    this.props.fetchInviteAward();
    this.props.fetchIncomeAward();
    this.props.fetchTeamAward();
  }

  componentWillReceiveProps(nextProps) {
    const { inviteAward, incomeAward, teamAward } = nextProps.entrepreneurship;
    if (inviteAward.isLoading || incomeAward.isLoading || teamAward.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  onTabItemClick = (e) => {
    const { type } = e.currentTarget;
    this.setState({ activeTab: type });
  }

  render() {
    const { activeTab } = this.state;
    const { inviteAward, incomeAward, teamAward } = this.props.entrepreneurship;
    let awardData = [];
    if (activeTab === 'invite') {
      awardData = inviteAward && inviteAward.data || {};
    } else if (activeTab === 'income') {
      awardData = incomeAward && incomeAward.data || {};
    } else {
      awardData = teamAward && teamAward.data || {};
    }
    return (
      <div>
        <Header title="中奖名单" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content entrepreneurship-winner-container">
          <div className="row no-margin">
              <img className="col-xs-12 no-padding" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/20160729/v1/winner-banner.jpg'} />
            </div>
          <div className="winner-tabs text-center bottom-border">
            <ul className="row no-margin">
              <li type="invite" className={'col-xs-4' + (activeTab === 'invite' ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>推荐奖</div>
              </li>
              <li type="income" className={'col-xs-4' + (activeTab === 'income' ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>业绩奖</div>
              </li>
              <li type="team" className={'col-xs-4' + (activeTab === 'team' ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>团队奖</div>
              </li>
            </ul>
          </div>
          <If condition={activeTab === 'income'}>
            <p className="row no-margin margin-top-xs text-center">前50名奖励一罐花果茶</p>
          </If>
          <If condition={activeTab === 'team'}>
            <p className="row no-margin margin-top-xs text-center">前50名奖励一罐花果茶和一张凉席</p>
          </If>
          <If condition={!_.isEmpty(awardData)}>
            <ul className="winner-list">
              <li key={-1} className="row no-margin bottom-border padding-bottom-xxs padding-top-xxs">
                <div className="col-xs-9 no-padding text-left">
                  <div className="col-xs-2 no-padding">排名</div>
                  <div className="col-xs-3 no-padding">图像</div>
                  <p className="no-margin">昵称</p>
                </div>
                <div className="col-xs-3 text-center">奖金(元)</div>
              </li>
            {awardData.map((item, index) => {
              return (
                <li key={index} className="row no-margin bottom-border padding-bottom-xxs padding-top-xxs">
                  <div className="col-xs-9 no-padding">
                    <If condition={index === 0}>
                      <div className="col-xs-2 padding-left-xxs">
                        <img className="rank-icon" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/20160729/v1/rank-1.png'} />
                      </div>
                    </If>
                    <If condition={index === 1}>
                      <div className="col-xs-2 padding-left-xxs">
                        <img className="rank-icon" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/20160729/v1/rank-2.png'} />
                      </div>
                    </If>
                    <If condition={index === 2}>
                      <div className="col-xs-2 padding-left-xxs">
                        <img className="rank-icon" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/20160729/v1/rank-3.png'} />
                      </div>
                    </If>
                    <If condition={index !== 0 && index !== 1 && index !== 2}>
                      <p className="col-xs-2 no-margin padding-top-xxs text-left">{index + 1}</p>
                    </If>
                    <div className="col-xs-3 no-padding">
                      <If condition={item.thumbnail}>
                        <img src={item.thumbnail + constants.image.square} />
                      </If>
                      <If condition={!item.thumbnail}>
                        <i className="icon-xiaolu font-grey-light"></i>
                      </If>
                    </div>
                    <p className="no-margin padding-top-xxs no-wrap text-left">{item.mama_nick}</p>
                  </div>
                  <p className="col-xs-3 no-margin no-wrap text-center font-orange">{Number(item.award || 200)}</p>
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
