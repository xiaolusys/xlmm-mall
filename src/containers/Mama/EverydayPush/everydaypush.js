import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as plugins from 'plugins';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Image } from 'components/Image';
import { Toast } from 'components/Toast';
import * as ninepicAction from 'actions/mama/ninepic';
import * as fetchMamaQrcodeAction from 'actions/mama/mamaQrcode';
import * as wechatSignAction from 'actions/wechat/sign';

const actionCreators = _.extend(ninepicAction, fetchMamaQrcodeAction, wechatSignAction);

@connect(
  state => ({
    ninepic: state.ninepic,
    mamaQrcode: state.mamaQrcode,
    wechatSign: state.wechatSign,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class EverydayPushTab extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    location: React.PropTypes.object,
    ninepic: React.PropTypes.any,
    fetchNinePic: React.PropTypes.func,
    mamaQrcode: React.PropTypes.object,
    fetchMamaQrcode: React.PropTypes.func,
    wechatSign: React.PropTypes.object,
    fetchWechatSign: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    page: 1,
    pageSize: 2,
    remaining: 2,
  }

  componentWillMount() {
    const { mm_linkid } = this.props.location.query;

    this.props.fetchWechatSign();
    this.props.fetchNinePic('', '');
    if (!_.isEmpty(mm_linkid)) {
      this.props.fetchMamaQrcode(mm_linkid);
      this.interval = setInterval(this.tick, 2000);
    }
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { ninepic } = nextProps;

    if (!nextProps.wechatSign.isLoading && nextProps.wechatSign.success && this.props.wechatSign.isLoading) {
      utils.wechat.config(nextProps.wechatSign);
    }

    if (ninepic.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onScroll = (e) => {

    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    if (scrollTop === documentHeight - windowHeight) {
      this.setState({ page: this.state.page + 1 });
    }


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

  onShareClick = (e) => {
    const { title, pic } = e.currentTarget.dataset;
    // this.copy(title);
    Toast.show('请先点击分享按钮保存信息，然后点击右上角分享到朋友圈。下载APP分享更方便更有趣。');
    const link = title.split('http');

    utils.wechat.configShareContent({
        success: true,
        data: {
          title: title,
          desc: title,
          share_link: 'http' + link[link.length - 1],
          share_img: pic,
        },
      });
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  copy = (str) => {
    const save = function(e) {
      e.clipboardData.setData('text/plain', str);
      e.preventDefault();
    };
    document.addEventListener('copy', save);
    document.execCommand('copy');
    document.removeEventListener('copy', save);
  }

  tick = () => {
    let remaining = this.state.remaining;
    if (remaining > 0) {
      remaining--;
    }
    this.setState({ remaining: remaining });
    if (remaining === 0) {
      clearInterval(this.interval);
    }
    if (this.props.mamaQrcode && this.props.mamaQrcode.success && !_.isEmpty(this.props.mamaQrcode.data.qrcode_link)) {
      clearInterval(this.interval);
    } else {
      const { mm_linkid } = this.props.location.query;
      if (!_.isEmpty(mm_linkid)) {
        this.props.fetchMamaQrcode(mm_linkid);
      }
    }
  }

  renderPics(pics) {
    return (
      <ul className="margin-bottom-lg">
        {pics.map((item, index) => {
          return (
            <li className=" no-margin" key={index}>
              <Image className="col-xs-4 no-padding" style={{ height: (utils.dom.windowWidth() / 3) * 1.2 }} src={item} quality={90} thumbnail={640}/>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const { ninepic } = this.props;
    const renderNinePics = [];

    if (ninepic && ninepic.success && ninepic.data.length > 0) {
      for (let i = 0; i < this.state.page * this.state.pageSize; i++) {
        renderNinePics.push(ninepic.data[i]);
        if (renderNinePics[renderNinePics.length - 1].pic_arry && (renderNinePics[renderNinePics.length - 1].pic_arry.length > 1)
           && (this.props.mamaQrcode && this.props.mamaQrcode.success && !_.isEmpty(this.props.mamaQrcode.data.qrcode_link))) {
          const index = Math.round((renderNinePics[renderNinePics.length - 1].pic_arry.length + 1) / 2) - 1;
          renderNinePics[renderNinePics.length - 1].pic_arry[index] = this.props.mamaQrcode.data.qrcode_link;
        }
      }
    }

    return (
      <div className="col-xs-12 ">
        <ul className="margin-bottom-lg">
        <If condition={ninepic && ninepic.success && renderNinePics.length > 0}>
          {renderNinePics.map((item, index) => {
            return (
              <li className="row no-margin margin-top-xs bottom-border" key={index}>
                <p className="col-xs-12 no-padding" >{item.title_content}</p>
                <p className="col-xs-6 no-padding" >{item.start_time}</p>
                <p className="col-xs-12 no-padding" >{item.title}</p>
                <If condition={item.pic_arry && item.pic_arry.length > 0}>
                  { this.renderPics(item.pic_arry) }
                  <p className="col-xs-12 no-padding" >{'分享次数' + item.save_times}</p>
                  <button className="col-xs-10 col-xs-offset-1 button button-energized" data-title={item.title} data-pic={item.pic_arry[0]} onClick={this.onShareClick}>分享</button>
                </If>
              </li>
            );
          })}
        </If>
      </ul>
      </div>
    );
  }
}
