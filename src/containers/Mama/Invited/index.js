import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { Image } from 'components/Image';
import { Checkbox } from 'components/Checkbox';
import { Input } from 'components/Input';
import { BottomBar } from 'components/BottomBar';
import * as invitedAction from 'actions/mama/invited';
import * as inviteSharingAction from 'actions/mama/inviteSharing';
import moment from 'moment';
import * as plugins from 'plugins';

import './index.scss';

const base = 'http://7xogkj.com1.z0.glb.clouddn.com/mall/v3/';
const actionCreators = _.extend(invitedAction, inviteSharingAction);
const shareType = {
  full: 38,
  trial: 27,
};

@connect(
  state => ({
    invited: state.invited,
    inviteSharing: state.inviteSharing,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Invited extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    invited: React.PropTypes.object,
    inviteSharing: React.PropTypes.object,
    fetchInvited: React.PropTypes.func,
    fetchInviteSharing: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = { activeTab: 'full' }

  componentWillMount() {
    const { activeTab } = this.state;
    this.props.fetchInvited(activeTab);
    this.props.fetchInviteSharing(shareType[activeTab]);
  }

  componentDidMount() {
    document.body.style.backgroundColor = '#FFCB00';
  }

  componentWillReceiveProps(nextProps) {
    const { inviteSharing } = nextProps;
    const { activeTab } = this.state;
    plugins.invoke({
      method: 'changeId',
      data: {
        id: shareType[activeTab],
        title: inviteSharing.data.title || '邀请您加入小鹿正式会员',
      },
    });
  }

  componentWillUnmount() {
    document.body.style.backgroundColor = '';
  }

  onTabItemClick = (e) => {
    const activeTab = e.currentTarget.id;
    const { inviteSharing } = this.props;
    this.setState({ activeTab: activeTab });
    this.props.fetchInvited(activeTab);
    this.props.fetchInviteSharing(shareType[activeTab]);
    plugins.invoke({
      method: 'changeId',
      data: {
        id: shareType[activeTab],
        title: inviteSharing.data.title || '邀请您加入小鹿正式会员',
      },
    });
  }

  onShareClick = (e) => {
    const shareInfo = this.props.inviteSharing.data || {};
    plugins.invoke({
      method: 'callNativeUniShareFunc',
      data: {
        share_title: shareInfo.title,
        share_to: '',
        share_desc: shareInfo.active_dec,
        share_icon: shareInfo.share_icon,
        share_type: 'link',
        link: shareInfo.share_link,
      },
    });
  }

  render() {
    const { activeTab } = this.state;
    const { invited } = this.props;
    return (
      <div className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding invited">
        <ul className="row no-margin text-center tabs">
          <li id="full" className="col-xs-6 no-padding" style={{ marginTop: '16px' }} onClick={this.onTabItemClick}>
            <img style={{ width: '24px', marginBottom: '10px' }} src={`${base}full-icon${activeTab === 'full' ? '-active' : ''}.png`} />
            <div>正式会员</div>
          </li>
          <li id="trial" className="col-xs-6 no-padding" style={{ marginTop: '16px' }} onClick={this.onTabItemClick}>
            <img style={{ width: '24px', marginBottom: '10px' }} src={`${base}trial-icon${activeTab === 'trial' ? '-active' : ''}.png`} />
            <div>一元体验</div>
          </li>
        </ul>
        <div className="spec">
          <If condition={this.state.activeTab === 'full'}>
            <h5>正式会员多重收益：</h5>
            <p>享有推荐奖最高110元/人，销售佣金8-30%，点击补贴0.1-1元，限时充值188元立返230元无门槛无期限购物金，保持活跃帐户将永久有效。</p>
          </If>
          <If condition={this.state.activeTab === 'trial'}>
            <h5>1元体验：</h5>
            <p>获得15天的小鹿妈妈功能使用权限，享有推荐奖最高110元/人，销售佣金8-30%，点击补贴0.1-1元。全面了解小鹿美美模式，充值188元立返230元，即可成为正式会员！</p>
          </If>
        </div>
        <div className="invited-list text-center">
          <h5>{`邀请${invited.data.count || 0}位好友`}</h5>
          <ul>
            {_.map(invited.data.results, (item) => {
              return (
                <li className="row no-margin margin-top-xxs">
                  <img className="pull-left avatar" src={item.thumbnail} />
                  <div style={{ display: 'inline-block', maxWidth: '70%' }} className="no-wrap">
                    <p style={{ color: '#666' }}>{moment(item.charge_time).format('YYYY-MM-DD hh:mm:ss')}</p>
                    <p>
                      <span style={{ color: '#0095FF' }}>{item.nick}</span>
                      <span style={{ color: '#1E1E1E' }}>通过邀请加入小鹿</span>
                    </p>
                  </div>
                  <div className="pull-right redpacket">{item.award}</div>
                </li>
              );
            })}
          </ul>
        </div>
        <BottomBar>
          <div className="row no-margin text-center margin-bottom-xs">
            <button className="col-xs-10 col-xs-offset-1 button button-energized" onClick={this.onShareClick}>分享</button>
          </div>
        </BottomBar>
      </div>
    );
  }
}
