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
  static propTypes = {
    location: React.PropTypes.any,
    params: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  render() {
    return (
      <div>
        <Header title="开店介绍" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content open-introduce-container">
            <Image src={`http://7xogkj.com1.z0.glb.clouddn.com//mall/mama/open/introduce.jpg`}/>
            <Link className="row no-margin" to={`/mct.html`}>
              <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button">1元体验15天</button>
            </Link>
            <Link className="row no-margin" to={`/mcf.html`}>
              <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button">成为正式会员</button>
            </Link>
          </div>
      </div>
    );
  }
}
