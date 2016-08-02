import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import * as actionCreators from 'actions/favorite/index';

import './index.scss';

@connect(
  state => ({
    favorite: state.favorite,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Logistics extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    order: React.PropTypes.any,
    params: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    fetchFavoriteList: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    activeTab: 'onSale',
    sticky: false,
  }

  componentWillMount() {
    this.props.fetchFavoriteList();
  }

  componentWillReceiveProps(nextProps) {

  }

  onTabItemClick = (e) => {
    const { id } = e.currentTarget;
    this.setState({ activeTab: id });
    e.preventDefault();
  }

  render() {
    const { activeTab, sticky } = this.state;
    const hasHeader = !utils.detector.isApp();
    return (
      <div>
        <Header title="我的收藏" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content favorite-container">
            <div className={'favorite-tabs text-center bottom-border ' + (sticky ? 'sticky ' : '') + (hasHeader ? 'has-header' : '')}>
              <ul className="row no-margin">
                <li id="onSale" className={'col-xs-6' + (activeTab === 'onSale' ? ' active' : '')} onClick={this.onTabItemClick}>
                  <p className="no-margin">热售商品</p>
                </li>
                <li id="soldOut" className={'col-xs-6' + (activeTab === 'soldOut' ? ' active' : '')} onClick={this.onTabItemClick}>
                  <p className="no-margin">下架商品</p>
                </li>
              </ul>
            </div>
          </div>
      </div>
    );
  }
}
