import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as actionCreators from 'actions/refunds/list';
import { Header } from 'components/Header';
import { Image } from 'components/Image';

import './index.scss';

@connect(
  state => (state.refundsList),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class List extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    data: React.PropTypes.any,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchRefunds: React.PropTypes.func,
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
    this.props.fetchRefunds(pageIndex + 1, pageSize);
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      const count = nextProps.data.count;
      const size = nextProps.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
    if (nextProps.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
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
    if (scrollTop === documentHeight - windowHeight && !this.props.isLoading && this.state.hasMore) {
      this.props.fetchRefunds(pageIndex + 1, pageSize);
    }
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const props = this.props;
    const data = this.props.data && this.props.data.results || [];
    return (
      <div>
        <Header title="退款退货" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content refunds">
          <If condition={_.isEmpty(data)}>
            <div className="text-center refunds-empty">
              <i className="icon-order-o icon-6x icon-grey"></i>
              <p>您暂时还没有退款退货订单哦～快去看看吧</p>
              <p className="font-grey font-xs margin-bottom-xs">再不抢购，宝贝就卖光啦～</p>
              <Link className="button button-stable" to="/" >快去抢购</Link>
            </div>
          </If>
          <If condition={!_.isEmpty(data)}>
            <ul className="refunds-list">
              {data.map((refund) => {
                return (
                  <Link to={'/refunds/details/' + refund.id}>
                    <li className="bottom-border row no-margin margin-top-xs" key={refund.order_id}>
                      <div className="row no-margin padding-top-xxs padding-bottom-xxs bottom-border">
                        <If condition={refund.has_good_return}>
                          <p className="col-xs-8 no-margin text-left">
                            <i className="icon-refund-goods font-refund-goods"></i>
                            <span className="padding-left-xxs font-grey-light no-wrap">{'退货'}</span>
                          </p>
                        </If>
                        <If condition={!refund.has_good_return && refund.refund_channel === 'budget'}>
                          <p className="col-xs-8 no-margin text-left">
                            <i className="icon-refund-top-speed font-refund-top-speed"></i>
                            <span className="padding-left-xxs font-grey-light no-wrap">{'极速退款'}</span>
                          </p>
                        </If>
                        <If condition={!refund.has_good_return && refund.refund_channel !== 'budget'}>
                          <p className="col-xs-8 no-margin text-left">
                            <i className="icon-refund-common font-refund-common"></i>
                            <span className="padding-left-xxs font-grey-light no-wrap">{'退款'}</span>
                          </p>
                        </If>
                        <p className="col-xs-4 no-margin text-right font-orange">
                          <span>{refund.status_display}</span>
                        </p>
                      </div>
                      <div className="row no-margin bottom-border">
                        <div className="col-xs-3 padding-top-xs padding-bottom-xs">
                          <Image className="border" thumbnail={60} crop="60x60" quality={100} src={refund.pic_path} />
                        </div>
                        <div className="col-xs-9 padding-top-xs padding-bottom-xs padding-left-xs font-xs">
                          <p className="row no-margin no-wrap">{refund.title}</p>
                          <p className="row no-margin margin-top-xxxs font-grey">{'尺寸:' + refund.sku_name}</p>
                          <p className="row no-margin margin-top-xxxs">
                            <span>交易金额:</span>
                            <span>{'￥' + refund.total_fee}</span>
                            <span className="padding-left-xs">退款金额:</span>
                            <span>{'¥' + refund.refund_fee}</span>
                          </p>
                        </div>
                      </div>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </If>
        </div>
      </div>
    );
  }
}
