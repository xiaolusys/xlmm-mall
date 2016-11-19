import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Link } from 'react-router';
import classnames from 'classnames';
import * as utils from 'utils';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { Loader } from 'components/Loader';
import { Header } from 'components/Header';
import { Timer } from 'components/Timer';
import { Product } from 'components/Product';
import { Image } from 'components/Image';
import { BackTop } from 'components/BackTop';
import * as actionCreators from 'actions/mama/commissionList';

import './CommissionList.scss';

@connect(
  state => ({
    mamaCommission: state.mamaCommission,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class CommissionList extends Component {
  static propTypes = {
    location: React.PropTypes.object,
    fetchMamaCommissionList: React.PropTypes.func,
    resetMamaCommissionList: React.PropTypes.func,
    mamaCommission: React.PropTypes.any,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    hasMore: true,
    pageIndex: 0,
    pageSize: 10,
    cid: '',
    activeTab: 'rebetAmount',
    reverse: 0,
    sticky: false,
  }

  componentWillMount() {
    const { pageIndex, pageSize, activeTab, reverse } = this.state;
    this.props.fetchMamaCommissionList(pageIndex + 1, activeTab === 'rebetAmount' ? 'rebet_amount' : 'sale_num', this.state.cid, reverse);
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    let count = 0;
    let size = 0;
    if (nextProps.mamaCommission.success) {
      count = nextProps.mamaCommission.data.count;
      size = nextProps.mamaCommission.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
    this.setState({ pageIndex: 0 });
  }

  onItemClick = (e) => {
    const dataSet = e.currentTarget.dataset;
    window.location.href = `/mall/product/details/${dataSet.modelid}`;
  }

  onTabItemClick = (e) => {
    const { pageIndex, pageSize, cid } = this.state;
    const { type } = e.currentTarget.dataset;
    let reverse = this.state.reverse;

    if (reverse === 0) {
      reverse = 1;
    } else {
      reverse = 0;
    }

    this.setState({
      activeTab: type,
      pageIndex: 0,
      reverse: reverse,
    });
    this.props.resetMamaCommissionList();
    this.props.fetchMamaCommissionList(1, type === 'rebetAmount' ? 'rebet_amount' : 'sale_num', cid, reverse);
  }

  onScroll = (e) => {
    const { pageSize, pageIndex, cid, activeTab, reverse } = this.state;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    const tabsOffsetTop = utils.dom.offsetTop('.product-list-tabs');
    if (scrollTop === documentHeight - windowHeight && !this.props.mamaCommission.isLoading && this.state.hasMore) {
      this.props.fetchMamaCommissionList(pageIndex + 1, activeTab === 'rebetAmount' ? 'rebet_amount' : 'sale_num', cid, reverse);
    }
    if (scrollTop > tabsOffsetTop) {
      this.setState({ sticky: true });
    } else {
      this.setState({ sticky: false });
    }
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const { mamaCommission } = this.props;
    const hasHeader = !utils.detector.isApp();
    const { activeTab, sticky } = this.state;

    return (
      <div className="commission-list">
        <Header title="选品佣金" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goSmartBack} hide={utils.detector.isApp()}/>
        <div className="content content-white-bg">
          <div className={'product-list-tabs text-center bottom-border ' + (sticky ? 'sticky ' : '') + (hasHeader ? 'has-header' : '')}>
            <ul className="row no-margin">
              <li className={'col-xs-6' + (activeTab === 'rebetAmount' ? ' active' : '')} data-type={'rebetAmount'} onClick={this.onTabItemClick}>
                <div>佣金排序</div>
              </li>
              <li className={'col-xs-6' + (activeTab === 'saleNum' ? ' active' : '')} data-type={'saleNum'} onClick={this.onTabItemClick}>
                <div>销量排序</div>
              </li>
            </ul>
          </div>
          <div className="product-list-p" >
          <If condition={mamaCommission && mamaCommission.success && mamaCommission.data && mamaCommission.data.results.length > 0}>
            {mamaCommission.data.results.map((item, key) => {
              return (
                <div className="col-xs-12" key={key}>
                <div className="col-xs-3 no-padding">
                  <img src={item.pic_path + constants.image.square} data-modelid={item.id} onClick={this.onItemClick}/>
                </div>
                <div className="col-xs-9 no-padding padding-top-xxs font-xs" data-key={key}>
                  <p className="row no-margin no-wrap">{item.name}</p>
                  <p className="row no-margin margin-top-xxxs">
                    <span className="">{'￥' + Number(item.lowest_agent_price).toFixed(2) + '/' + '￥' + Number(item.lowest_std_sale_price).toFixed(2)}</span>
                    <span className="padding-left-xs">{item.sale_num_desc}</span>
                  </p>
                  <p className="row no-margin margin-top-xxxs font-grey">
                    <span className="padding-left-xs">{'返利佣金' }</span>
                    <span className="">{item.rebet_amount_desc}</span>
                    <span className="padding-left-xs">{item.level_info.next_agencylevel_desc}</span>
                    <span className="icon-yellow padding-left-xs">{item.next_rebet_amount_desc}</span>
                  </p>
                </div>
                </div>
                );
            })}
          </If>
          </div>
          {mamaCommission && mamaCommission.isLoading ? <Loader/> : null}
          <BackTop />
        </div>
      </div>
    );
  }
}
