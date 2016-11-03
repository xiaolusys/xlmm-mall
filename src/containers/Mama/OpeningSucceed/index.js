import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { Image } from 'components/Image';
import { Checkbox } from 'components/Checkbox';
import { Input } from 'components/Input';
import { WechatPopup } from 'components/WechatPopup';
import { DownloadAppBanner } from 'components/DownloadAppBanner';
import * as utils from 'utils';
import * as inviteSharingAction from 'actions/mama/inviteSharing';
import * as wechatSignAction from 'actions/wechat/sign';
import * as summerMatAction from 'actions/activity/summerMat';
import * as administratorInfoAction from 'actions/mama/administratorInfo';

import './index.scss';

const actionCreators = _.extend(inviteSharingAction, wechatSignAction, summerMatAction, administratorInfoAction);
const banner = '//og224uhh3.qnssl.com//mall/mama/open/success/banner.jpg';

@connect(
  state => ({
    inviteSharing: state.inviteSharing,
    wechatSign: state.wechatSign,
    summerMat: state.summerMat,
    administratorInfo: state.administratorInfo,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Succeed extends Component {
  static propTypes = {
    location: React.PropTypes.object,
    children: React.PropTypes.array,
    fetchInviteSharing: React.PropTypes.func,
    fetchWechatSign: React.PropTypes.func,
    inviteSharing: React.PropTypes.object,
    wechatSign: React.PropTypes.object,
    summerMat: React.PropTypes.any,
    signUp: React.PropTypes.func,
    administratorInfo: React.PropTypes.object,
    fetchAdministratorInfo: React.PropTypes.func,
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
    this.props.signUp();
    this.props.fetchWechatSign();
    this.props.fetchInviteSharing(27);
    this.props.fetchAdministratorInfo();
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
    const data = this.props.administratorInfo && this.props.administratorInfo.data || [];
    return (
      <div className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding opening-shop-succeed">
        <DownloadAppBanner />
        <Image style={{ width: '100%' }} src={banner} quality={50}/>
        <If condition={!data.referal_mama_avatar || !data.referal_mama_nick}>
          <div className="qr-code-bg-v3">
            <Image className="qr-code" src={data.qr_img} quality={50}/>
          </div>
        </If>
        <If condition={data.referal_mama_avatar && data.referal_mama_nick}>
          <div className="qr-code-bg-v4">
            <Image className="qr-code" src={data.qr_img} quality={50}/>
            <div className="row no-margin">
              <Image className="col-xs-3 col-xs-offset-2 no-padding referal-mama-avatar" src={data.referal_mama_avatar} quality={50}/>
              <p className="col-xs-7 no-padding no-margin margin-top-xxs text-center">
                <span className="col-xs-6 no-padding no-wrap">{data.referal_mama_nick}</span>
                <span className="col-xs-6 no-padding">推荐成功</span>
              </p>
            </div>
          </div>
        </If>
        //<div className="row no-margin text-center margin-bottom-xs">
        //<button className="col-xs-10 col-xs-offset-1 button button-energized" onClick={this.onShareBtnClick}>邀请好友开店</button>
        //</div>
        <WechatPopup active={this.state.sharePopupActive} onCloseBtnClick={this.onCloseBtnClick}/>
      </div>
    );
  }
}
