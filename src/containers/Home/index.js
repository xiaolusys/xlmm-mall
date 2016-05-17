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
import { Carousel } from 'components/Carousel';
import { Loader } from 'components/Loader';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Timer } from 'components/Timer';
import { Side } from 'components/Side';
import { Product } from 'components/Product';
import { Image } from 'components/Image';
import * as portalAction from 'actions/home/portal';
import * as productAction from 'actions/home/product';

import logo from './images/logo.png';

import './index.scss';

const actionCreators = _.extend(portalAction, productAction);
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
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class Home extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    fetchPortal: React.PropTypes.func,
    fetchProduct: React.PropTypes.func,
    portal: React.PropTypes.any,
    product: React.PropTypes.any,
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
    this.props.fetchPortal();
    this.props.fetchProduct(requestAction.today, pageIndex + 1, pageSize);
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    let count = 0;
    let size = 0;
    if (nextProps.product.success) {
      count = nextProps.product.data.count;
      size = nextProps.product.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {
    this.removeScrollListener();
    this.setState({ pageIndex: 0 });
  }

  onItemClick = (e) => {
    const dataSet = e.currentTarget.dataset;
    this.context.router.push('/product/details/' + dataSet.modelid);
  }

  onTabItemClick = (e) => {
    this.setState({
      activeTab: tabs[e.currentTarget.id],
      pageIndex: 0,
    });
    const { pageSize, pageIndex } = this.state;
    this.props.fetchProduct(requestAction[e.currentTarget.id], 1, pageSize);
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
    if (scrollTop >= tabsOffsetTop) {
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
    const { portal, product, children } = this.props;
    const activities = portal.data.activitys || [];
    const categories = portal.data.categorys || [];
    const posters = portal.data.posters || [];
    const products = product.data.results || [];
    const { activeTab, sticky } = this.state;
    const mainCls = classnames({
      ['menu-active']: this.state.menuActive,
    });
    return (
      <div className={mainCls}>
        <Side />
        <div className="slide-menu-mask" onClick={this.toggleMenuActive}></div>
        <div className="home-container">
          <Header title={logo} titleType="image" leftIcon="icon-bars" onLeftBtnClick={this.toggleMenuActive} />
          <div className="content content-white-bg">
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
              <div className="home-activities bottom-border">
                {portal.isLoading ? <Loader/> : null}
                <ul className="row no-margin">
                  {activities.map((item, index) => {
                    return (
                      <li key={item.id}>
                        <a href={item.extras.html.apply}>
                          <Image className="col-xs-12 no-padding" src={item.act_img} />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </If>
            <div className={'home-tabs text-center bottom-border ' + (sticky ? 'sticky' : '')}>
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
            {products.isLoading ? <Loader/> : null}
            <Link className="shop-cart" to="/shop/bag"><i className="icon-cart icon-yellow icon-2x"></i></Link>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}
