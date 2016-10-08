import React, { Component } from 'react';
import _ from 'underscore';
import * as utils from 'utils';
import * as constants from 'constants';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { Image } from 'components/Image';
import { Header } from 'components/Header';
import * as fetchMamaQrcodeAction from 'actions/mama/mamaQrcode';

import './index.scss';

const actionCreators = _.extend(fetchMamaQrcodeAction);

@connect(
  state => ({
    mamaQrcode: state.mamaQrcode,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class ZeroOpeningIntroduce extends Component {
  static propTypes = {
    mamaQrcode: React.PropTypes.object,
    fetchMamaQrcode: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
      this.props.fetchMamaQrcode();
    }

  componentDidMount() {
    document.body.style.backgroundColor = '#FFCB00';
  }

  componentWillReceiveProps(nextProps) {


  }

  componentWillUnmount() {
    document.body.style.backgroundColor = '';
  }

  render() {
    return (
      <div>
        <Header title="开店介绍" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content open-introduce-container">
            <Image src={`http://7xogkj.com1.z0.glb.clouddn.com//mall/mama/open/v2/banner.jpg`}/>
            <Image src={`http://7xogkj.com1.z0.glb.clouddn.com//mall/mama/open/v2/introduce.png`}/>
          </div>
      </div>
    );
  }
}