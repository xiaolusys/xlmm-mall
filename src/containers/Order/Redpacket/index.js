import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Toast } from 'components/Toast';
import { WechatPopup } from 'components/WechatPopup';
import { Image } from 'components/Image';
import _ from 'underscore';
import * as utils from 'utils';
import * as profileAction from 'actions/user/profile';
import * as shareRedpacketAction from 'actions/order/shareRedpacket';
import * as receiveRedpacketAction from 'actions/order/receiveRedpacket';
import * as usersRedpacketAction from 'actions/order/usersRedpacket';
import * as wechatSignAction from 'actions/wechat/sign';

import './index.scss';

const actionCreators = _.extend(profileAction, usersRedpacketAction, receiveRedpacketAction);
const staticBase = 'http://7xogkj.com1.z0.glb.clouddn.com/mall/';

@connect(
  state => ({
    profile: state.profile,
    usersRedpacket: state.usersRedpacket,
    receiveRedpacket: state.receiveRedpacket,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Redpacket extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.object,
    profile: React.PropTypes.object,
    usersRedpacket: React.PropTypes.object,
    receiveRedpacket: React.PropTypes.object,
    fetchProfile: React.PropTypes.func,
    fetchUsersRedpacket: React.PropTypes.func,
    fetchReceiveRedpacket: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'order-redpacket',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    phone: '',
  }

  componentWillMount() {
    const { query } = this.props.location;
    this.props.fetchProfile();
    this.props.fetchUsersRedpacket();
  }

  componentWillReceiveProps(nextProps) {
    const { profile, receiveRedpacket } = nextProps;
    if (!profile.isLoading && profile.success && profile.data.mobile) {
      this.setState({ phone: profile.data.mobile, inputDisabled: true });
    }
    if (!receiveRedpacket.isLoading && receiveRedpacket.success && receiveRedpacket.data.msg) {
      Toast.show(receiveRedpacket.data.msg);
    }
  }

  onInputTextChange = (e) => {
    this.setState({ phone: e.target.value });
  }

  onReceiveRedPacketClick = (e) => {
    const tid = this.props.location.query.uniq_id;
    if (this.props.profile.data.mobile) {
      this.props.fetchReceiveRedpacket(tid);
      return false;
    }
    this.props.fetchReceiveRedpacket(tid, this.state.phone);
  }

  render() {
    const { prefixCls } = this.props;
    return (
      <div className={`${prefixCls}`}>
        <Image className={`${prefixCls}-bg`} src={`${staticBase}sharing-redpacket-bg.png`} />
        <img className={`${prefixCls}-opened`} src={`${staticBase}redpacket-opened.png`} />
        <div className={`${prefixCls}-container`}>
          <div className={`${prefixCls}-content`}>
            <p className="text-center font-lg margin-top-lg">绑定手机号领取红包</p>
            <div className="text-center input-box">
              <input type="number" placeholder="请输入您的手机号" value={this.state.phone} onChange={this.onInputTextChange} disabled={this.state.inputDisabled}/>
            </div>
            <div className="divider margin-top-lg margin-bottom-md"></div>
            <div className={`${prefixCls}-rules`}>
              <h4 className="text-center font-red">红包领取规则</h4>
              <p><span className="badge">1</span><span>发放至手机号的红包需在App用手机号注册，或将手机号绑定的小鹿美美账户后才可使用。</span></p>
              <p><span className="badge">2</span><span>每位用户每个红包只限领取一次，红包使用以后，订单发生退款红包则不进行补发。</span></p>
              <p><span className="badge">3</span><span>每个订单仅限使用一张红包，红包不找零。</span></p>
              <p><span className="badge">4</span><span>若订单产生部分退款，将不退回分摊至每个商品优惠的金额。</span></p>
              <p><span className="badge">5</span><span>小鹿美美可在法律法规允许范围内对本次活动规则进行解释。</span></p>
            </div>
          </div>
        </div>
        <button className="button button-red" type="button" onClick={this.onReceiveRedPacketClick}>领取红包</button>
      </div>
    );
  }

}
