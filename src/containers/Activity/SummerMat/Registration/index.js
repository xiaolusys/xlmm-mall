import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/activity/summerMat';
import * as utils from 'utils';
import _ from 'underscore';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { Image } from 'components/Image';
import { Dialog } from 'components/Dialog';
import { BottomBar } from 'components/BottomBar';
import * as constants from 'constants';

import './index.scss';

@connect(
  state => ({
    summerMat: state.summerMat,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Registration extends Component {

  static propTypes = {
    summerMat: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    location: React.PropTypes.object,
    fetchMumInfo: React.PropTypes.func,
    fetchRegisters: React.PropTypes.func,
    register: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    pageIndex: 1,
    pageSize: 20,
    hasMore: true,
  }

  componentWillMount() {
    const groupId = this.props.location.query.groupId || '';
    const { pageIndex, pageSize } = this.state;
    this.addScrollListener();
    if (groupId) {
      this.props.fetchMumInfo(groupId);
      this.props.fetchRegisters(groupId, pageIndex, pageSize);
      this.props.register(groupId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fetchMumInfo, fetchRegisters, register } = nextProps.summerMat;
    if (fetchMumInfo.isLoading || fetchRegisters.isLoading || register.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
    if (fetchRegisters.success) {
      const count = fetchRegisters.data.count;
      const size = fetchRegisters.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onScroll = (e) => {
    const { pageSize, pageIndex } = this.state;
    const groupId = this.props.location.query.groupId || '';
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    if (scrollTop === documentHeight - windowHeight && !this.props.summerMat.fetchRegisters.isLoading && this.state.hasMore) {
      this.props.fetchRegisters(groupId, pageIndex + 1, pageSize);
    }
  }

  onDownloadClick = (e) => {
    Toast.show('首次下载App领取100元新人大礼包！');
    _.delay(function() {
      const uFrom = utils.cookie.getCookie('ufrom') || '';
      window.location.href = `${constants.downloadAppUri}?ufrom=${uFrom}`;
    }, 1000);

  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const { fetchMumInfo, fetchRegisters, register } = this.props.summerMat;
    return (
      <div>
        <Header title="签到页面" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goSmartBack} hide={utils.detector.isApp()} />
        <div className="content summer-mat-register">
          <div className="top">
            <Image src={fetchMumInfo.data.head_img_url}/>
            <p className="row no-margin font-md text-center">{'我是' + fetchMumInfo.data.nick}</p>
            <div className="row no-margin margin-top-xs font-xs">
              <p className="col-xs-6 text-right padding-right-xs">
                <span>妈妈编号：</span>
                <span>{fetchMumInfo.data.mama_id}</span>
              </p>
              <p className="col-xs-6 text-left padding-left-xs">
                <span className="text-left">签到人数：</span>
                <span>{fetchRegisters.data.count}</span>
              </p>
            </div>
          </div>
          <div className="row no-margin register-center">
            <p className="row no-margin bottom-border">已签到名单</p>
            <ul className="register-list">
              <If condition={fetchRegisters.data && fetchRegisters.data.results}>
                {fetchRegisters.data.results.map((item, index) => {
                  return (
                    <li className="col-xs-12 col-md-6 col-md-offset-3 bottom-border" key={index} >
                      <Image className="col-xs-4 no-padding" src={item.head_img_url} />
                      <div className="col-xs-8">
                        <p>
                          <span>昵称：</span>
                          <span>{item.nick}</span>
                        </p>
                        <p>{item.created.substr(0, 10)}</p>
                      </div>
                    </li>
                  );
                })}
              </If>
            </ul>
          </div>
        </div>
        <BottomBar size="medium">
          <button className="col-xs-10 col-xs-offset-1 button button-energized" onClick={this.onDownloadClick}>去领100元红包</button>
        </BottomBar>
      </div>
    );
  }
}
