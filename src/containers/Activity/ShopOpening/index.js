import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Image } from 'components/Image';
import { Checkbox } from 'components/Checkbox';
import { Input } from 'components/Input';

import './index.scss';

const banner = 'http://7xogkj.com1.z0.glb.clouddn.com/mall/opening-shop-banner.jpg';

export default class OpeningShop extends Component {
  static propTypes = {
    children: React.PropTypes.array,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    
  }

  render() {
    return (
      <div className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding content-white-bg opening-shop">
        <Image style={{ width: '100%' }} src={banner} />
        <Input type="number" placeholder="请输入手机号" onChange={this.onPhoneChange}/>
        <div className="row no-margin password-box bottom-border margin-bottom-xs">
          <input className="col-xs-9" type="number" placeholder="请输入验证码" onChange={this.onVerifyCodeChange} onBlur= {this.onVerifyCodeBlur} />
          <button className="col-xs-3 button button-sm button-light" type="button" onClick={this.onGetVerifyCodeBtnClick}>获取验证码</button>
        </div>
        <div className="row no-margin text-center margin-bottom-xs">
          <button className="col-xs-10 col-xs-offset-1 button button-energized">马上一元开店</button>
        </div>
        <div className="row no-margin text-center margin-bottom-xs">
          <Checkbox className="margin-bottom-xs" checked="true">勾选代同意一元体验15天</Checkbox>
          <Link to="/activity/shop/agreement">小鹿妈妈服务条款！</Link>
        </div>
      </div>
    );
  }
}
