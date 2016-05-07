import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import classnames from 'classnames';
import * as utils from 'utils';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { Carousel } from 'components/Carousel';
import { Loader } from 'components/Loader';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Side } from 'components/Side';
import { Product } from 'components/Product';
import * as portalAction from 'actions/home/portal';
import * as productAction from 'actions/home/product';

import logo from './images/logo.png';
import today from './images/today.png';
import todayActive from './images/today-active.png';
import tomorrow from './images/tomorrow.png';
import tomorrowActive from './images/tomorrow-active.png';
import yesterday from './images/yesterday.png';
import yesterdayActive from './images/yesterday-active.png';

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
      data: state.portal.data,
      isLoading: state.portal.isLoading,
      error: state.portal.error,
      success: state.portal.success,
    },
    product: {
      data: state.product.data,
      isLoading: state.product.isLoading,
      error: state.product.error,
      success: state.product.success,
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

  constructor(props) {
    super(props);
  }

  state = {
    menuActive: false,
    hasMore: true,
    pageIndex: 0,
    pageSize: 20,
    activeTab: tabs.today,
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
    if (dataSet.modelid) {
      window.location.href = '/tongkuan.html?id=' + dataSet.modelid;
      return;
    }
    window.location.href = '/pages/shangpinxq.html?id=' + dataSet.productid;
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
    const { activeTab } = this.state;
    const mainCls = classnames({
      ['menu-active']: this.state.menuActive,
    });
    return (
      <div className={mainCls}>
        <Side />
        <div className="slide-menu-mask" onClick={this.toggleMenuActive}></div>
        <div className="home-container">
          <Header title={logo} titleType="image" leftIcon="icon-bars" onLeftBtnClick={this.toggleMenuActive} />
          <div className="content content-white-bg has-header">
            <div className="home-poster">
              {portal.isLoading ? <Loader/> : null}
              <Carousel>
                {posters.map((item, index) => {
                  return (
                    <div key={index} >
                      <a href={item.item_link}>
                        <img src={item.pic_link} />
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
                          <img src={item.cat_img} />
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
                        <a href={item.act_link}>
                          <img className="col-xs-12 no-padding" src={item.act_img} />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </If>
            <div className="home-tabs text-center bottom-border">
              <ul className="row no-margin">
                <li id="yesterday" className="col-xs-4" onClick={this.onTabItemClick}>
                  <img src={activeTab === tabs.yesterday ? yesterdayActive : yesterday} />
                </li>
                <li id="today" className="col-xs-4" onClick={this.onTabItemClick}>
                  <img src={activeTab === tabs.today ? todayActive : today} />
                </li>
                <li id="tomorrow" className="col-xs-4" onClick={this.onTabItemClick}>
                  <img src={activeTab === tabs.tomorrow ? tomorrowActive : tomorrow} />
                </li>
              </ul>
            </div>
            <div className="home-products clearfix">
              {products.map((item) => {
                return <Product key={item.model_id} product={item} onItemClick = {this.onItemClick} />;
              })}
            </div>
            {product.isLoading ? <Loader/> : null}
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}
