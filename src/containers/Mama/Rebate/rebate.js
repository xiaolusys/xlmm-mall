import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as plugins from 'plugins';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Image } from 'components/Image';
import * as mamaBaseInfoAction from 'actions/mama/mamaDetailInfo';
import * as mamaRebateAction from 'actions/mama/rebate';

import './rebate.scss';

const actionCreators = _.extend(mamaBaseInfoAction, mamaRebateAction);

@connect(
  state => ({
    mamaBaseInfo: state.mamaDetailInfo,
    rebate: state.rebate,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class MamaRebate extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    rebate: React.PropTypes.any,
    fetchMamaFortune: React.PropTypes.func,
    fetchMamaRebate: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {

    sticky: false,
    hasMore: false,

  }

  componentWillMount() {
    // this.props.fetchMamaFortune();
    this.props.fetchMamaRebate();
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaFortune, mamaTeamMember } = this.props.mamaBaseInfo;

    if (mamaFortune.isLoading || mamaTeamMember.isLoading) {
      utils.ui.loadingSpinner.show();
    }

    if (!nextProps.mamaBaseInfo.mamaFortune.isLoading || !nextProps.mamaBaseInfo.mamaTeamMember.isLoading) {
      utils.ui.loadingSpinner.hide();
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onScroll = (e) => {
  }

  onLeftBtnClick = (e) => {
    this.context.router.goBack();
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  renderMember = (member, index) => {

    return (
      <li key={index} className="col-xs-12 member-item bottom-border" data-index={index}>
        <div className="col-xs-3 member-img-div no-padding no-margin">
          <Image className="member-img no-padding no-margin" src={member.mama.thumbnail} quality={70} />
        </div>
        <div className="col-xs-3 no-padding no-margin member-name">
          <p className="text-center font-xs no-margin">{member.mama.nick.length <= 10 ? member.mama.nick : member.mama.nick.substring(0, 9)}</p>
          <p className="text-center font-xs no-margin">{'ID:' + member.mama.mama_id}</p>
        </div>
        <div className="col-xs-3 no-padding no-margin member-mobile">
          <p className="text-left font-xs no-margin">{}</p>
        </div>
        <div className="col-xs-3 member-score no-padding no-margin">
          <p className="text-center font-xs no-margin">{member.budeget_detail_cash + '元' }</p>
        </div>
      </li>
    );
  }

  render() {
    const rebate = this.props.rebate;
    return (
      <div className="rebate-container no-padding">
        <Header title="返点精英妈妈" leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick}/>
        <div className="my-level bottom-border">
          <p className="my-mama-id margin-left-xxs">{'上月获得返点精英妈妈如下'}</p>
        </div>
        <div className="rebate-members bg-white">
          <If condition={rebate.success && rebate.data && rebate.data.results.length > 0}>
            <ul>
            {rebate.data.results.map((item, index) => this.renderMember(item, index))
            }
            </ul>
          </If>
          <If condition={rebate.success && rebate.data && rebate.data.results.length === 0}>
            <div className="no-team-members bg-white">
              <p className="font-blue font-xs" onClick={this.onJumpClick} >上月没有精英团队获得返点，赶紧加油吧></p>
            </div>
          </If>
        </div>
      </div>
    );
  }
}
