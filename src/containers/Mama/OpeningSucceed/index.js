import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Image } from 'components/Image';
import { Checkbox } from 'components/Checkbox';
import { Input } from 'components/Input';
import { WechatPopup } from 'components/WechatPopup';
import * as utils from 'utils';
import * as inviteSharingAction from 'actions/mama/inviteSharing';
import * as wechatSignAction from 'actions/wechat/sign';

const actionCreators = _.extend(inviteSharingAction, wechatSignAction);
const banner = 'http://img.xiaolumeimei.com/top101470982118078succeed.jpg';

@connect(
  state => ({
    inviteSharing: state.inviteSharing,
    wechatSign: state.wechatSign,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Succeed extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    fetchInviteSharing: React.PropTypes.func,
    fetchWechatSign: React.PropTypes.func,
    inviteSharing: React.PropTypes.object,
    wechatSign: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    sharePopupActive: false,
  }

  componentWillMount() {
    this.props.fetchWechatSign();
    this.props.fetchInviteSharing(27);
  }

  componentDidMount() {
    document.body.classList.add('content-white-bg');
  }

  componentWillReceiveProps(nextProps) {
    const { mamaCharge, wechatSign, inviteSharing } = nextProps;
    utils.wechat.config(wechatSign);

    if (!inviteSharing.isLoading && inviteSharing.success) {
      const shareInfo = {
        success: inviteSharing.success,
        data: {
          title: inviteSharing.data.title,
          desc: inviteSharing.data.active_dec,
          share_link: inviteSharing.data.share_link,
          share_img: inviteSharing.data.share_icon,
        },
      };
      utils.wechat.configShareContent(shareInfo);
    }

  }

  componentWillUnmount() {
    document.body.classList.remove('content-white-bg');
  }

  onShareBtnClick = (e) => {
    if (utils.detector.isWechat()) {
      this.setState({ sharePopupActive: true });
      return;
    }
  }

  onCloseBtnClick = (e) => {
    this.setState({ sharePopupActive: false });
  }

  render() {
    return (
      <div className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding opening-shop">
        <Image style={{ width: '100%' }} src={banner} />
        <div className="row no-margin text-center margin-bottom-xs">
          <button className="col-xs-10 col-xs-offset-1 button button-energized" onClick={this.onShareBtnClick}>邀请好友开店</button>
        </div>
        <WechatPopup active={this.state.sharePopupActive} onCloseBtnClick={this.onCloseBtnClick}/>
      </div>
    );
  }
}
