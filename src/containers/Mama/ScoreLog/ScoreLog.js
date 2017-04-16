import React, { Component } from 'react';
import LazyLoad from 'react-lazy-load';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as constants from 'constants';

import { Image } from 'components/Image';
import { Product } from 'components/Product';
import { Loader } from 'components/Loader';
import { Toast } from 'components/Toast';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import * as actionCreators from 'actions/mama/mamaDetailInfo';

import './ScoreLog.scss';

@connect(
  state => ({
    mamaDetailInfo: state.mamaDetailInfo,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class EliteScoreLogList extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    params: React.PropTypes.any,
    mamaDetailInfo: React.PropTypes.any,
    fetchMamaEliteScoreLog: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    pageIndex: 0,
    pageSize: 20,
    hasMore: true,
  }

  componentWillMount() {
    const { pageIndex, pageSize } = this.state;
    this.props.fetchMamaEliteScoreLog(pageIndex + 1, pageSize);
  }

  componentDidMount() {

    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { pageIndex, pageSize } = this.state;
    const { mamaDetailInfo } = nextProps;
    const { mamaEliteScoreLog } = mamaDetailInfo;
    if (mamaEliteScoreLog.success) {
      const count = mamaEliteScoreLog.data.count;
      const size = mamaEliteScoreLog.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onScroll = (e) => {
    const { pageSize, pageIndex } = this.state;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();

    if (scrollTop === documentHeight - windowHeight && !this.props.mamaDetailInfo.mamaEliteScoreLog.isLoading && this.state.hasMore) {
      this.props.fetchMamaEliteScoreLog(pageIndex + 1, pageSize);
    }
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  renderList(list) {
    return (
      list.map((item, index) => {
        return (
          <div key={index} className="no-padding bottom-border" data-index={index} onClick={this.onItemClick}>
            <div className="cashout-info ">
              <div className="cashout-status col-xs-8 no-padding" >
                <p>
                  <span className="col-xs-offset-1 font-grey font-xs">{item.created.replace('T', ' ')}</span>
                  <span className="cashout-status-span col-xs-offset-1 no-padding font-xs">{item.type}</span>
                </p>
                <p className="col-xs-offset-1 no-padding font-xs">{item.desc}</p>
              </div>
              <div className="cashout-desc col-xs-4 text-center">
                  <p className="font-xs">{item.score + '积分'}</p>
              </div>
            </div>
          </div>
        );
      })
    );
  }

  render() {
    const { query } = this.props.location;
    const hasHeader = !utils.detector.isApp();
    const { mamaEliteScoreLog } = this.props.mamaDetailInfo;
    const data = mamaEliteScoreLog.data.results || [];
    return (
      <div>
        <Header title="积分纪录" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content scorelog-container no-padding">
            <div className={'list-head text-center bottom-border ' + (hasHeader ? 'has-header' : '')}>
              <p className="cash">{query.score}</p>
              <p className="cash-prompt">积分 </p>
            </div>
            <If condition={!_.isEmpty(data)}>
              {this.renderList(data)}
            </If>
          </div>
      </div>
    );
  }
}
