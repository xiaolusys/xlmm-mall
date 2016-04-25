import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import classnames from 'classnames';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Side } from 'components/Side';
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
  }

  componentWillMount() {
    this.props.fetchActivity();
    this.props.fetchPoster();
    this.props.fetchProduct(requestAction.today);
  }

  onMenuBtnClick = (e) => {
    this.setState({
      menuActive: this.state.menuActive ? false : true,
    });
  }

  render() {
    const { activity, poster, product } = this.props;
    const mainCls = classnames({
      ['menu-active']: this.state.menuActive,
    });
    if (!_.isArray(activity.data)) {
      activity.data = [];
    }
    return (
      <div className={mainCls}>
        <Side />
        <div className="home-container">
          <Header title="小鹿美美" leftIcon="icon-bars" leftBtnClick={this.onMenuBtnClick} />
          <div className="content has-header">
            <div className="home-activity">
              <ul>
                {activity.data.map((item, index) => {
                  return (
                    <li className="col-xs-12" key={index}>
                      <a href={item.act_link}><img src={item.act_img} /></a>
                    </li>
                  );
                })}
              </ul>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}
