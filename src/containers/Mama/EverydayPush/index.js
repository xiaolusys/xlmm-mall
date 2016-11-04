import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as plugins from 'plugins';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Image } from 'components/Image';

const banner = 'http://img.xiaolumeimei.com/MG_1476807122352-_01.jpg?imageMogr2/strip/format/jpg/quality/90/interlace/1/thumbnail/640/';

export default class EverydayPush extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {

  }

  onLeftBtnClick = (e) => {
    if (utils.detector.isApp()) {
      plugins.invoke({
        method: 'callNativeBack',
      });
      return;
    }
    this.context.router.goBack();
  }

  onSaveBtnClick = (e) => {
    const { id, type } = e.currentTarget.dataset;
    console.log('save pic');
    try {
        /* const elemIF = document.createElement('iframe');
        elemIF.src = banner;
        elemIF.style.display = 'none';
        document.body.appendChild(elemIF);*/

        const objIframe = document.createElement('IFRAME');
        // const re = setTimeout('onSaveBtnClick()', 1);
        if (document.all.ifrm === null) {
           document.body.insertBefore(objIframe);
           objIframe.outerHTML = "<iframe name=ifrm style='width:0;hieght:0' src=" + banner + '></iframe>';
          } else {
           // clearTimeout(re);
           const files = window.open(banner, 'ifrm');
           files.document.execCommand('SaveAs');
           document.all.ifrm.removeNode(true);
        }
    } catch (err) {
      console.log('error ' + err);
    }
    e.preventDefault();
  }

  render() {
    const { topTab } = this.state;

    return (
      <div className="home-root">
        <Header title="每日推送" leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick}/>
        <div className="content mamahome">
          <div className="mamahome-container">
            <img style={{ width: '100%', marginBottom: '10px' }} src={banner} />
            <button className="col-xs-10 col-xs-offset-1 button button-energized" onClick={this.onSaveBtnClick}>保存图片</button>
          </div>
        </div>
      </div>
    );
  }
}
