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

export default class Rank extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    entrepreneurship: React.PropTypes.any,
    fetchMamaInfo: React.PropTypes.func,
    fetchMamaRank: React.PropTypes.func,
    fetchTeamRank: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }
  state = {
    activeTab: 'mama',
  }

  componentWillMount() {
    this.props.fetchMamaInfo();
    this.props.fetchMamaRank();
    this.props.fetchTeamRank();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaInfo, mamaRank, teamRank } = nextProps.entrepreneurship;
    if (mamaInfo.isLoading || mamaRank.isLoading || teamRank.isLoading) {
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
    const { mamaInfo, mamaRank, teamRank } = this.props.entrepreneurship;
    let rankData = [];
    if (activeTab === 'mama') {
      rankData = mamaRank && mamaRank.data || {};
    } else {
      rankData = teamRank && teamRank.data || {};
    }
    return (
      <div>
        <Header title="一元开店大赛" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content entrepreneurship-container">
          <div className="row no-margin entrepreneurship-top">
            <div className="col-xs-2 col-xs-offset-1">
              <img src={mamaInfo.data.thumbnail} />
            </div>
            <p className="col-xs-8 no-margin no-padding">{mamaInfo.data.mama_nick}</p>
            <p className="col-xs-8 col-xs-offset-2 no-margin no-padding">
              <span className="col-xs-6 no-padding">个人推荐: {mamaInfo.data.recommended_quantity}</span>
              <span className="col-xs-6 no-padding">激活人数: {mamaInfo.data.activite_num}</span>
            </p>
          </div>
          <div className="row no-margin">
            <img className="col-xs-12 no-padding" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/20160729/v2/banner-1.png'} />
          </div>
          <Link to="/activity/20160729/introduce">
            <div className="row no-margin">
              <img className="col-xs-12 no-padding" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/20160729/v1/banner-2.png'} />
            </div>
          </Link>
          <div className="row no-margin">
            <img className="col-xs-12 no-padding" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/20160729/v1/banner-3.png'} />
          </div>
          <div className="rank-tabs text-center bottom-border">
            <ul className="row no-margin">
              <li type="mama" className={'col-xs-6' + (activeTab === 'mama' ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>个人业绩</div>
              </li>
              <li type="team" className={'col-xs-6' + (activeTab === 'team' ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>团队业绩</div>
              </li>
            </ul>
          </div>
          <div className="row no-margin">
            <p className="col-xs-6 no-margin padding-top-xs padding-bottom-xs padding-left-xs text-center">我的排名: {Number(mamaInfo.data.rank) === 0 ? '' : mamaInfo.data.rank}</p>
            <p className="col-xs-6 no-margin padding-top-xs padding-bottom-xs font-orange text-right">{mamaInfo.data && Number(mamaInfo.data.duration_total_display).toFixed(2)}</p>
          </div>
          <div className="row no-margin margin-top-xs bottom-border">
            <div className="col-xs-5 padding-left-xxs">
              <img className="pull-right rank" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/20160729/v1/banner-rank.png'} />
            </div>
            <p className="col-xs-7 no-margin no-padding padding-top-xs padding-bottom-xs">{activeTab === 'mama' ? '个人' : '团队'}收益排行榜</p>
          </div>
          <If condition={!_.isEmpty(rankData)}>
            <ul className="rank-list">
            {rankData.map((item, index) => {
              return (
                <li key={index} className="row no-margin bottom-border padding-bottom-xxs padding-top-xxs">
                  <div className="col-xs-9 no-padding">
                    <If condition={item.rank === 1}>
                      <div className="col-xs-2 padding-left-xxs">
                        <img className="rank-icon" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/20160729/v1/rank-1.png'} />
                      </div>
                    </If>
                    <If condition={item.rank === 2}>
                      <div className="col-xs-2 padding-left-xxs">
                        <img className="rank-icon" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/20160729/v1/rank-2.png'} />
                      </div>
                    </If>
                    <If condition={item.rank === 3}>
                      <div className="col-xs-2 padding-left-xxs">
                        <img className="rank-icon" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/20160729/v1/rank-3.png'} />
                      </div>
                    </If>
                    <If condition={item.rank !== 1 && item.rank !== 2 && item.rank !== 3}>
                      <p className="col-xs-2 no-margin padding-top-xxs text-left">{item.rank}</p>
                    </If>
                    <div className="col-xs-3 no-padding">
                      <img src={item.thumbnail + constants.image.square} />
                    </div>
                    <p className="no-margin padding-top-xxs no-wrap text-left">{item.mama_nick}</p>
                  </div>
                  <p className="col-xs-3 no-margin no-wrap text-right font-orange">{Number(item.duration_total_display).toFixed(2)}</p>
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
