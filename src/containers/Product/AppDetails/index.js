import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Image } from 'components/Image';
import classnames from 'classnames';
import * as actionCreators from 'actions/product/details';
import * as constants from 'constants';
import * as utils from 'utils';
import _ from 'underscore';

import './index.scss';

@connect(
  state => ({
    details: state.productDetails.data,
    isLoading: state.productDetails.isLoading,
    error: state.productDetails.error,
    success: state.productDetails.success,
    wechatSign: state.wechatSign,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class AppDetail extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    details: React.PropTypes.object,
    isLoading: React.PropTypes.bool,
    fetchProductDetails: React.PropTypes.func,
    resetProductDetails: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'product-detail-app',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    trasparentHeader: false,
    productId: 0,
  }

  componentWillMount() {
    const { params } = this.props;
    const productId = params.id.match(/(\d+)/)[0];
    this.props.fetchProductDetails(productId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoading) {
      utils.ui.loadingSpinner.show();
    } else if (!nextProps.isLoading) {
      utils.ui.loadingSpinner.hide();
    }
  }

  componentWillUnmount() {
    this.props.resetProductDetails();
  }

  renderRow(cells) {
    return (
      <tr>
        {cells.map((cell, cellIndx) => {
          return (<th key={cellIndx} className="text-center font-weight-200">{cell}</th>);
        })}
      </tr>
    );
  }

  renderProductSpec(rows) {
    const self = this;
    return (
      <div className="table-container">
        <table className="table">
          <thead>{self.renderRow(rows[0])}</thead>
          <tbody>
          {rows.map((cells, rowIndex) => {
            if (rowIndex > 0) {
              return self.renderRow(cells);
            }
          })}
          </tbody>
        </table>
      </div>
    );
  }

  renderDetails(images) {
    return (
      <div className="bg-white">
        <div className="font-md font-weight-700 bottom-border padding-bottom-xxs padding-top-xxs padding-left-xxs">商品展示</div>
        <div className="details">
          {images.map((image, index) => {
            return (<Image key={index} className="col-xs-12 no-padding" quality={90} thumbnail={640} src={image} />);
          })}
        </div>
      </div>
    );
  }

  render() {
    const self = this;
    const { prefixCls, details } = this.props;
    return (
      <div>
        <div className={`content ${prefixCls}`}>
          <If condition={!_.isEmpty(details.detail_content)}>
            <If condition={!_.isEmpty(details.comparison)}>
              {details.comparison.tables.map((spec, tableIndex) => {
                return self.renderProductSpec(spec.table);
              })}
            </If>
            {this.renderDetails(details.detail_content.content_imgs)}
          </If>
        </div>
      </div>
    );
  }
}
