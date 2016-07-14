import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { Image } from 'components/Image';
import { Checkbox } from 'components/Checkbox';
import { Input } from 'components/Input';
import * as invitedAction from 'actions/activity/invited';
import * as inviteSharingAction from 'actions/activity/inviteSharing';
import moment from 'moment';
import * as plugins from 'plugins';

import './index.scss';

const base = 'http://7xogkj.com1.z0.glb.clouddn.com/mall/';
const actionCreators = _.extend(invitedAction, inviteSharingAction);
const shareType = {
  full: 26,
  trial: 27,
};

@connect(
  state => ({
    invited: state.invited,
    inviteSharing: state.inviteSharing,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class ShopInvited extends Component {
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
    this.props.fetchInvited(this.state.activeTab);
    this.props.fetchInviteSharing(shareType[this.state.activeTab]);
  }

  componentDidMount() {
    document.body.style.backgroundColor = '#FFCB00';
  }

  componentWillUnmount() {
    document.body.style.backgroundColor = '';
  }

  onTabItemClick = (e) => {
    const activeTab = e.currentTarget.id;
    this.setState({ activeTab: activeTab });
    this.props.fetchInvited(activeTab);
    this.props.fetchInviteSharing(shareType[activeTab]);
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
          <li id="full" className={'col-xs-6 no-padding' + (activeTab === 'full' ? ' active' : '')} style={{ marginTop: '16px' }} onClick={this.onTabItemClick}>
            <img style={{ width: '16%', marginBottom: '10px' }} src={`${base}full-icon.png`} />
            <div>正式会员</div>
          </li>
          <li id="trial" className={'col-xs-6 no-padding' + (activeTab === 'trial' ? ' active' : '')} style={{ marginTop: '16px' }} onClick={this.onTabItemClick}>
            <img style={{ width: '16%', marginBottom: '10px' }} src={`${base}trial-icon.png`} />
            <div>一元体验</div>
          </li>
        </ul>
        <div className="spec">
          <If condition={this.state.activeTab === 'full'}>
            <h5>正式会员享受三大利益来源：</h5>
            <p>享有推荐奖最高110元/人，销售佣金8-30%，点击补贴0.1-1元，续费1年可享用活跃值延长期限特权，从产品品质把控，IT大数据系统, 物流全包全程孵化培训四个方面全面支持小鹿妈妈会员.</p>
          </If>
          <If condition={this.state.activeTab === 'trial'}>
            <h5>1元体验：</h5>
            <p>获得15天的小鹿妈妈功能使用权限，期间享有推荐奖最高110元/人，销售佣金8-30%，点击补贴0.1-1元你所得到的收入可以用于支付购买衣服。也可续费后把你的资金进行提现。</p>
          </If>
        </div>
        <div className="invited-list text-center">
          <h5>{`邀请${invited.data.count || 0}位好友`}</h5>
          <ul>
            {_.map(invited.data.results, (item) => {
              return (
                <li className="row no-margin">
                  <img className="pull-left avatar" src={item.thumbnail} />
                  <div style={{ display: 'inline-block', maxWidth: '200px' }} className="no-wrap">
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
        <div className="row no-margin text-center margin-bottom-xs">
          <button className="col-xs-10 col-xs-offset-1 button button-energized" onClick={this.onShareClick}>分享</button>
        </div>
      </div>
    );
  }
}
