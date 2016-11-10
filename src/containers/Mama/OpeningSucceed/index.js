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
import * as summerMatAction from 'actions/activity/summerMat';
import * as administratorInfoAction from 'actions/mama/administratorInfo';

import './index.scss';

const actionCreators = _.extend(summerMatAction, administratorInfoAction);
const banner = '//og224uhh3.qnssl.com//mall/mama/open/success/banner.jpg';

@connect(
  state => ({
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
    this.props.fetchAdministratorInfo();
  }

  componentDidMount() {
    document.body.classList.add('content-white-bg');
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {
    document.body.classList.remove('content-white-bg');
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
      </div>
    );
  }
}
