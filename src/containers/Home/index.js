import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Link } from 'react-router';
import classnames from 'classnames';
import * as utils from 'utils';
import * as constants from 'constants';
import * as plugins from 'plugins';
import { If } from 'jsx-control-statements';
import { Carousel } from 'components/Carousel';
import { Loader } from 'components/Loader';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Timer } from 'components/Timer';
import { Side } from 'components/Side';
import { Product } from 'components/Product';
import { Brand } from 'components/Brand';
import { Image } from 'components/Image';
import { ShopBag } from 'components/ShopBag';
import { Favorite } from 'components/Favorite';
import { BackTop } from 'components/BackTop';
import { DownloadAppBanner } from 'components/DownloadAppBanner';
import { Toast } from 'components/Toast';
import * as portalAction from 'actions/home/portal';
import * as productAction from 'actions/home/product';
import * as mamaInfoAction from 'actions/mama/mamaInfo';
import * as mamaFocusAction from 'actions/mama/focus';
import * as wechatSignAction from 'actions/wechat/sign';

import logo from './images/logo.png';

import './index.scss';

const actionCreators = _.extend(portalAction, productAction, mamaInfoAction, mamaFocusAction, wechatSignAction);
const requestAction = {
  yesterday: 'yesterday',
  today: '',
  tomorrow: 'tomorrow',
};
const tabs = {
  yesterday: 0,
  today: 1,
  tomorrow: 2,
};

@connect(
  state => ({
    portal: {
      data: state.portal.data || {},
      isLoading: state.portal.isLoading,
      error: state.portal.error,
      success: state.portal.success,
    },
    product: {
      data: state.products.data,
      isLoading: state.products.isLoading,
      error: state.products.error,
      success: state.products.success,
    },
    mamaFocus: state.mamaFocus,
    mamaInfo: state.mamaInfo,
    wechatSign: state.wechatSign,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class Home extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    children: React.PropTypes.any,
    fetchPortal: React.PropTypes.func,
    fetchProduct: React.PropTypes.func,
    fetchMamaInfoById: React.PropTypes.func,
    focusMamaById: React.PropTypes.func,
    resetFocusMama: React.PropTypes.func,
    fetchWechatSign: React.PropTypes.func,
    portal: React.PropTypes.any,
    product: React.PropTypes.any,
    mamaFocus: React.PropTypes.any,
    mamaInfo: React.PropTypes.any,
    wechatSign: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    menuActive: false,
    hasMore: true,
    pageIndex: 0,
    pageSize: 20,
    activeTab: tabs.today,
    sticky: false,
  }

  componentWillMount() {
    const { pageIndex, pageSize } = this.state;
    const mmLinkId = this.props.location.query.mm_linkid;
    this.props.fetchPortal();
    this.props.fetchProduct(requestAction.today, pageIndex + 1, pageSize);
    if (mmLinkId) {
      this.props.fetchMamaInfoById(mmLinkId);
    }
    this.props.fetchWechatSign();
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    let count = 0;
    let size = 0;
    utils.wechat.config(nextProps.wechatSign);
    if (nextProps.product.success) {
      count = nextProps.product.data.count;
      size = nextProps.product.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
    if (nextProps.mamaFocus.success) {
      Toast.show(nextProps.mamaFocus.data.info);
    }
    if (nextProps.mamaFocus.error) {
      switch (nextProps.mamaFocus.status) {
        case 403:
          this.context.router.push(`/user/login?next=${this.props.location.pathname}`);
          return;
        case 500:
          Toast.show(nextProps.mamaFocus.data.detail);
          break;
        default:
          Toast.show(nextProps.mamaFocus.data.detail);
          break;
      }
    }
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {
    this.removeScrollListener();
    this.setState({ pageIndex: 0 });
    this.props.resetFocusMama();
  }

  onItemClick = (e) => {
    const dataSet = e.currentTarget.dataset;
    window.location.href = `/mall/product/details/${dataSet.modelid}`;
  }

  onTabItemClick = (e) => {
    this.setState({
      activeTab: tabs[e.currentTarget.id],
      pageIndex: 0,
    });
    const { pageSize, pageIndex } = this.state;
    this.props.fetchProduct(requestAction[e.currentTarget.id], 1, pageSize);
  }

  onFocusClick = (e) => {
    const mmLinkId = this.props.location.query.mm_linkid;
    this.props.focusMamaById(mmLinkId);
    e.preventDefault();
  }

  onScroll = (e) => {
    const { pageSize, pageIndex, activeTab } = this.state;
    const { fetchProduct, product } = this.props;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    const tabsOffsetTop = utils.dom.offsetTop('.home-tabs');
    if (scrollTop === documentHeight - windowHeight && !this.props.product.isLoading && this.state.hasMore) {
      switch (activeTab) {
        case tabs.yesterday:
          fetchProduct(requestAction.yesterday, pageIndex + 1, pageSize);
          break;
        case tabs.today:
          fetchProduct(requestAction.today, pageIndex + 1, pageSize);
          break;
        case tabs.tomorrow:
          fetchProduct(requestAction.tomorrow, pageIndex + 1, pageSize);
          break;
        default:
          fetchProduct(requestAction.today, pageIndex + 1, pageSize);
      }
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

  toggleMenuActive = () => {
    this.setState({
      menuActive: this.state.menuActive ? false : true,
    });
  }

  render() {
    const { portal, product, children, mamaInfo } = this.props;
    const activities = portal.data.activitys || [];
    const categories = portal.data.categorys || [];
    const posters = portal.data.posters || [];
    const brands = portal.data.promotion_brands || [];
    const products = product.data.results || [];
    const { activeTab, sticky } = this.state;
    const mainCls = classnames({
      ['menu-active']: this.state.menuActive,
    });
    const hasHeader = !utils.detector.isApp();
    return (
      <div className={mainCls}>
        <Side />
        <div className="slide-menu-mask" onClick={this.toggleMenuActive}></div>
        <div className="home-container">
          <Header title={logo} titleType="image" leftIcon="icon-bars" onLeftBtnClick={this.toggleMenuActive} hide={!hasHeader}/>
          <div className="content content-white-bg">
            <DownloadAppBanner />
            <If condition={!_.isEmpty(mamaInfo && mamaInfo.data)}>
              <div className="row no-margin focus-container">
                <div className="col-xs-2 no-padding">
                  <img src={`${mamaInfo.data.thumbnail}${constants.image.square}`} />
                </div>
                <p className="no-margin margin-top-xs col-xs-7 no-padding no-wrap">{`${mamaInfo.data.nick}的店铺`}</p>
                <div className="pull-right">
                  <button className="button button-energized button-sm" style={{ height: '32px', margin: '8px 0px' }} type="button" onClick={this.onFocusClick}>+关注</button>
                </div>
              </div>
            </If>
            <div className="home-poster">
              {portal.isLoading ? <Loader/> : null}
              <Carousel>
                {posters.map((item, index) => {
                  return (
                    <div key={index} >
                      <a href={item.item_link}>
                        <Image src={item.pic_link} />
                      </a>
                    </div>
                  );
                })}
              </Carousel>
            </div>
            <If condition={ portal.isLoading || !_.isEmpty(categories)}>
              <div className="home-categories bottom-border">
                {portal.isLoading ? <Loader/> : null}
                <ul className="clearfix">
                  {categories.map((item) => {
                    return (
                      <li className="col-xs-6 no-padding" key={item.id}>
                        <a href={item.cat_link}>
                          <Image src={item.cat_img} />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </If>
            <If condition={ portal.isLoading || !_.isEmpty(activities)}>
              <div className="home-activities">
                {portal.isLoading ? <Loader/> : null}
                <ul className="row no-margin">
                  {activities.map((item, index) => {
                    return (
                      <li key={item.id}>
                        <a href={item.act_link}>
                          <Image style={{ padding: '10px 0px' }} className="col-xs-12 no-padding bottom-border" src={item.act_img} />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </If>
            <If condition={ portal.isLoading || !_.isEmpty(brands)}>
              <div className="home-brands">
                {portal.isLoading ? <Loader/> : null}
                <ul className="row no-margin">
                  {brands.map((brand) => {
                    return (<Brand data={brand} />);
                  })}
                </ul>
              </div>
            </If>
            <div className={'home-tabs text-center bottom-border ' + (sticky ? 'sticky ' : '') + (hasHeader ? 'has-header' : '')}>
              <ul className="row no-margin">
                <li id="yesterday" className={'col-xs-4' + (activeTab === tabs.yesterday ? ' active' : '')} onClick={this.onTabItemClick}>
                  <div>昨日热卖</div>
                </li>
                <li id="today" className={'col-xs-4' + (activeTab === tabs.today ? ' active' : '')} onClick={this.onTabItemClick}>
                  <div>今日特卖</div>
                </li>
                <li id="tomorrow" className={'col-xs-4' + (activeTab === tabs.tomorrow ? ' active' : '')} onClick={this.onTabItemClick}>
                  <div>即将上新</div>
                </li>
              </ul>
            </div>
            <If condition={product.data.downshelf_deadline}>
            <div className="col-xs-12 text-center">
              <p className="countdown">
                <span className="font-grey-light margin-right-xxs">{'距本场' + (activeTab === tabs.tomorrow ? '开始' : '结束')}</span>
                <Timer endDateString={(activeTab === tabs.tomorrow ? product.data.upshelf_starttime : product.data.downshelf_deadline)} />
              </p>
            </div>
            </If>
            <div className="home-products clearfix">
              {products.map((item) => {
                return <Product key={item.model_id} product={item} onItemClick = {this.onItemClick} />;
              })}
            </div>
            {product.isLoading ? <Loader/> : null}
            <Favorite />
            <ShopBag />
            <BackTop />
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}
