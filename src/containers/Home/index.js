import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import classnames from 'classnames';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Side } from 'components/Side';
import { Product } from 'components/Product';
import * as posterAction from 'actions/home/poster';
import * as productAction from 'actions/home/product';
import * as activityAction from 'actions/home/activity';

import './index.scss';

const actionCreators = _.extend(activityAction, posterAction, productAction);
const requestAction = {
  yesterday: 'promote_previous',
  today: 'promote_today',
};

@connect(
  state => ({
    activity: {
      data: state.activity.data,
      isLoading: state.activity.isLoading,
      error: state.activity.error,
      success: state.activity.success,
    },
    poster: {
      data: state.poster.data,
      isLoading: state.poster.isLoading,
      error: state.poster.error,
      success: state.poster.success,
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
    fetchActivity: React.PropTypes.func,
    fetchPoster: React.PropTypes.func,
    fetchProduct: React.PropTypes.func,
    activity: React.PropTypes.any,
    poster: React.PropTypes.any,
    product: React.PropTypes.any,

  };

  constructor(props) {
    super(props);
  }

  state = {
    menuActive: false,
    hasMore: true,
  }

  componentWillMount() {
    this.props.fetchActivity();
    this.props.fetchPoster();
    this.props.fetchProduct(requestAction.today);
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onMenuBtnClick = (e) => {
    this.setState({
      menuActive: this.state.menuActive ? false : true,
    });
  }

  onItemClick = (productId, modelId) => {
    console.log(productId);
  }

  onScroll = (e) => {

  }

  addScrollListener = () => {
    // window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    // window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const { activity, poster, product, children } = this.props;
    let femaleList = [];
    let childList = [];
    const mainCls = classnames({
      ['menu-active']: this.state.menuActive,
    });
    if (!_.isArray(activity.data)) {
      activity.data = [];
    }
    if (!_.isEmpty(product.data.female_list) && !_.isEmpty(product.data.child_list)) {
      femaleList = product.data.female_list;
      childList = product.data.child_list;
    }
    return (
      <div className={mainCls}>
        <Side />
        <div className="home-container">
          <Header title="小鹿美美" leftIcon="icon-bars" leftBtnClick={this.onMenuBtnClick} />
          <div className="content has-header">
            <div className="home-activities">
              <ul>
                {activity.data.map((item, index) => {
                  return (
                    <li key={index}>
                      <a href={item.act_link}>
                        <img className="col-xs-12 no-padding" src={item.act_img} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="home-products">
              {femaleList.map((item) => {
                return <Product key={item.model_id} product={item} onItemClick = {this.onItemClick} />;
              })}
              {childList.map((item) => {
                return <Product key={item.model_id} product={item} />;
              })}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}
