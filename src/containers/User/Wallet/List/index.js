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
import * as actionCreators from 'actions/user/userCashout';

import './index.scss';

@connect(
  state => ({
    userCashout: state.userCashout,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class List extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    params: React.PropTypes.any,
    userCashout: React.PropTypes.any,
    fetchCashoutList: React.PropTypes.func,
    resetCashoutList: React.PropTypes.func,
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
    this.props.fetchCashoutList(pageIndex + 1, pageSize);
  }

  componentDidMount() {

    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { pageIndex, pageSize } = this.state;
    const { userCashout } = nextProps;
    const { cashoutList } = userCashout;
    if (cashoutList.success) {
      const count = cashoutList.data.count;
      const size = cashoutList.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onItemClick = (e) => {
    const dataSet = e.currentTarget.dataset;
    window.location.href = `/mall/cashout/detail/${dataSet.index}`;
    e.preventDefault();
  }

  onScroll = (e) => {
    const { pageSize, pageIndex } = this.state;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    if (scrollTop === documentHeight - windowHeight && !this.props.userCashout.cashoutList.isLoading && this.state.hasMore) {
      this.props.fetchCashoutList(pageIndex + 1, pageSize);
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
          <div key={index} className="no-padding row bottom-border" data-index={index} onClick={this.onItemClick}>
            <div className="cashout-info ">
              <div className="cashout-status row col-xs-9" >
                <p>
                  <span className="cashout-status-span col-xs-offset-1 no-padding">{item.get_status_display}</span>
                  <span className="col-xs-offset-3 font-grey">{item.budget_date}</span>
                </p>
                <p className="col-xs-offset-1 no-padding">{item.desc}</p>
              </div>
              <div className="cashout-desc col-xs-3">
                <If condition={item.budget_type === 0}>
                  <p className="row no-margin">{'+' + item.budeget_detail_cash + '元'}</p>
                </If>
                <If condition={item.budget_type === 1}>
                  <p className="row no-margin">{'-' + item.budeget_detail_cash + '元'}</p>
                </If>
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
    const { cashoutList } = this.props.userCashout;
    const data = cashoutList.data.results || [];
    return (
      <div>
        <Header title="零钱" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content list-container">
            <div className={'list-head text-center bottom-border ' + (hasHeader ? 'has-header' : '')}>
              <p className="cash">{query.cash}</p>
              <p className="cash-prompt">零钱（元）</p>
            </div>
            <If condition={!_.isEmpty(data)}>
              {this.renderList(data)}
            </If>
          </div>
      </div>
    );
  }
}
