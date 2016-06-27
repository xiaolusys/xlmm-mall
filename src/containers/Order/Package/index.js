import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { Timeline, TimelineItem } from 'components/Timeline';
import * as logisticsAction from 'actions/order/logistics';
import * as orderPackagesAction from 'actions/order/package';

import './index.scss';

const actionCreators = _.extend(logisticsAction, orderPackagesAction);

@connect(
  state => ({
    package: state.package,
    logistics: state.logistics,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Package extends Component {
  static propTypes = {
    package: React.PropTypes.any,
    params: React.PropTypes.any,
    logistics: React.PropTypes.object,
    isLoading: React.PropTypes.bool,
    fetchLogistics: React.PropTypes.func,
    fetchPackages: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    this.props.fetchLogistics(this.props.params.tradeId);
    if (_.isEmpty(this.props.package.data)) {
      this.props.fetchPackages(this.props.params.tradeId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.package.isLoading || nextProps.logistics.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
    if (nextProps.package.success) {
      this.setState({
        logisticsCompanyName: nextProps.package.data,
        logisticsOutSid: '',
      });
    }

  }

  renderPackages(packages = [], index) {
    const tradeId = this.props.params.tradeId;
    return (
      <div className="order-list">
        {packages[index].map((od, i) => {
          return (
            <div key={i} className="row no-margin bottom-border">
              <div className="col-xs-3 no-padding">
                <img src={od.pic_path + constants.image.square} />
              </div>
              <div className="col-xs-9 no-padding">
                <p className="row no-margin">
                  <span className="col-xs-8 no-wrap no-padding">{od.title}</span>
                  <span className="pull-right">{'￥' + od.payment}</span>
                </p>
                <p className="row no-margin">
                  <span className="col-xs-8 no-wrap no-padding">数量</span>
                  <span className="pull-right">{'x' + od.num}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const packagesOrders = _.isEmpty(this.props.package.data) ? [] : this.props.package.data;
    debugger;
    const { packageIndex, tradeId } = this.props.params;
    const packages = [];
    let packageGroupKey = '';
    let j = 0;
    packages[0] = [];
    for (let i = 0; i < packagesOrders.length; i++) {
      if (i > 0 && packageGroupKey !== packagesOrders[i].package_group_key) {
        j = j + 1;
        packages[j] = [];
      }
      packages[j].push(packagesOrders[i]);
      packageGroupKey = packagesOrders[i].package_group_key;
    }
    debugger;
    return (
      <div>
        <Header title={'包裹' + (Number(packageIndex) + 1)} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content package-content">
            <If condition={!_.isEmpty(packages)}>
              <p className="row no-margin express-item bottom-border"><span>快递公司</span><span className="pull-right">{'暂无'}</span></p>
              <p className="row no-margin margin-bottom-xs express-item bottom-border"><span>快递单号</span><span className="pull-right">{'暂无'}</span></p>
              {this.renderPackages(packages, Number(packageIndex))}
            </If>
          </div>
      </div>
    );
  }
}
