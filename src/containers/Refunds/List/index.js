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
  state => ({
    data: state.refundsList.data,
    isLoading: state.refundsList.isLoading,
    error: state.refundsList.error,
    success: state.refundsList.success,
  }),
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
    this.props.fetchRefunds(pageIndex + 1);
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
      this.props.fetchRefunds(pageIndex + 1);
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
        <div className="content">
          <If condition={_.isEmpty(data)}>
            <div className="text-center margin-top-xlg margin-bottom-lg">
              <i className="icon-order-o icon-4x icon-grey"></i>
              <p>您暂时还没有退款退货订单哦～快去看看吧</p>
              <p className="font-grey font-xs margin-bottom-xs">再不抢购，宝贝就卖光啦～</p>
              <Link className="button button-stable" to="/" >快去抢购</Link>
            </div>
          </If>
          <ul className="refunds-list">
            {data.map((refund) => {
              return (
                <Link to={'/refunds/details/' + refund.id}>
                  <li className="bottom-border row no-margin margin-top-xs" key={refund.order_id}>
                    <div className="row col-xs-12 no-margin padding-top-xxs padding-bottom-xxs bottom-border refund-item">
                      <p className="col-xs-9 no-margin no-padding text-left">
                        <span className="col-xs-4 text-left">退款编号</span>
                        <span className="col-xs-8 font-grey-light no-wrap">{refund.refund_no}</span>
                      </p>
                      <p className="col-xs-3 no-margin no-padding text-right font-orange">
                        <span>{refund.status_display}</span>
                      </p>
                    </div>
                    <div className="row no-margin bottom-border">
                      <div className="col-xs-3 padding-top-xxs padding-bottom-xxs">
                        <Image className="border" thumbnail={70} crop="70x70" quality={100} src={refund.pic_path} />
                      </div>
                      <div className="col-xs-9 padding-top-xxs padding-bottom-xxs refund-item">
                        <p className="row no-margin no-padding padding-top-xxs padding-bottom-xxs">
                          <span className="col-xs-9 no-wrap">{refund.title}</span>
                          <span className="col-xs-3 no-padding text-right">{'¥' + refund.total_fee}</span>
                        </p>
                        <p className="row no-margin no-padding padding-top-xxs padding-bottom-xxs">
                          <span className="col-xs-9 text-left">{'尺码: ' + refund.sku_name}</span>
                          <span className="col-xs-3 no-padding text-right">{'x' + refund.refund_num}</span>
                        </p>
                      </div>
                    </div>
                    <p className="row no-margin no-padding padding-top-xxs padding-bottom-xxs bottom-border">
                      <span className="col-xs-9">退款金额</span>
                      <span className="col-xs-3 text-right font-orange">{'¥' + refund.refund_fee}</span>
                    </p>
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}
