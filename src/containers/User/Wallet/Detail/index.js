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

import './index.scss';

@connect(
  state => ({
    cashoutList: state.userCashout.cashoutList,
  }),
)
export default class Detail extends Component {
  static propTypes = {
    location: React.PropTypes.object,
    params: React.PropTypes.object,
    cashoutList: React.PropTypes.any,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
  }

  componentWillMount() {
    const { index } = this.props.params;
    console.log('index= ' + index);
    console.log(this.props.cashoutList);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {

  }

  render() {
    const { query } = this.state;
    const hasHeader = !utils.detector.isApp();

    return (
      <div>
        <Header title="账单明细" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content favorite-container">
            <div className={'favorite-tabs text-center bottom-border ' + (hasHeader ? 'has-header' : '')}>
              <p className="cash">{query.index}</p>
              <p className="cash-prompt">出账金额（元）</p>
            </div>

          </div>
      </div>
    );
  }
}
