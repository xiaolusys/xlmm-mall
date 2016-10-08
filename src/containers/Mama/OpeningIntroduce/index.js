import React, { Component } from 'react';
import _ from 'underscore';
import * as utils from 'utils';
import * as constants from 'constants';
import { Link } from 'react-router';
import { Image } from 'components/Image';
import { Header } from 'components/Header';
import * as actionCreators from 'actions/favorite/index';

import './index.scss';

export default class OpeningIntroduce extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  onBtnClick = (e) => {
    const mamaLinkId = utils.cookie.getCookie('mm_linkid');
    const { type } = e.currentTarget.dataset;
    const { protocol, host } = window.location;
    if (Number(type) === 1) {
      window.location.href = `${protocol}//${host}/rest/v1/users/weixin_login/?next=/mall/open/zeroopen?mama_id=${mamaLinkId}`;
      return;
    }
    window.location.href = `${protocol}//${host}/rest/v1/users/weixin_login/?next=/mall/mcf.html?mama_id=${mamaLinkId}`;
  }

  render() {
    return (
      <div>
        <Header title="开店介绍" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content open-introduce-container">
            <Image src={`http://7xogkj.com1.z0.glb.clouddn.com//mall/mama/open/v2/banner.jpg`}/>
            <Image src={`http://7xogkj.com1.z0.glb.clouddn.com//mall/mama/open/v2/introduce.png`}/>
            <div className="content-white-bg">
              <div className="row no-margin">
                <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button" data-type="1" onClick={this.onBtnClick}>0元开店</button>
              </div>
              <div className="row no-margin">
                <button className="col-xs-10 col-xs-offset-1 margin-top-xs margin-bottom-xs button button-energized" type="button" data-type="2" onClick={this.onBtnClick}>成为正式会员</button>
              </div>
            </div>
          </div>
      </div>
    );
  }
}
