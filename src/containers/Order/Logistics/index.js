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
export default class Logistics extends Component {
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
    const { packageGroupKey, companyCode } = this.props.params;
    if (_.isEmpty(this.props.package.data)) {
      this.props.fetchPackages(this.props.params.tradeId);
    }
    this.props.fetchLogistics(packageGroupKey, companyCode);
  }

  componentWillReceiveProps(nextProps) {
    const { packageGroupKey } = this.props.params;
    if (nextProps.package.isLoading || nextProps.logistics.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  renderPackages(packages = [], packageGroupKey) {
    const tradeId = this.props.params.tradeId;
    return (
      <div className="margin-top-xs order-list">
        {packages[packageGroupKey].map((od, i) => {
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
    const { logistics, isLoading } = this.props || {};
    const logisticsInfo = logistics.data.data || [];
    const packagesOrders = _.isEmpty(this.props.package.data) ? [] : this.props.package.data;
    const { packageGroupKey, tradeId } = this.props.params;
    const packages = _.groupBy(packagesOrders, 'package_group_key');
    return (
      <div>
        <Header title="物流信息" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content package-content">
            <If condition={!_.isEmpty(packages)}>
              <p className="express-item bottom-border"><span>快递公司</span><span className="pull-right">{packages[packageGroupKey][0].logistics_company_name || '暂无'}</span></p>
              <If condition={packages[packageGroupKey][0].logistics_company_code}>
                <p className="express-item bottom-border"><span>快递单号</span><span className="pull-right">{logistics.order || '暂无'}</span></p>
              </If>
              <If condition={!packages[packageGroupKey][0].logistics_company_code}>
                <p className="express-item bottom-border"><span>包裹状态</span><span className="pull-right">{packages[packageGroupKey][0].assign_status_display}</span></p>
              </If>
              {this.renderPackages(packages, packageGroupKey)}
            </If>
            <If condition={!_.isEmpty(logisticsInfo)}>
              <div className="logistics-item margin-top-xs">
                <Timeline className="logistics-info">
                {logisticsInfo.map((item, index) => {
                  return (
                    <TimelineItem key={index} headColor="grey" tailColor="grey">
                      <p className="font-grey">{item.time.replace('T', ' ')}</p>
                      <p className="font-sm">{item.content}</p>
                    </TimelineItem>
                  );
                })}
                </Timeline>
              </div>
            </If>
          </div>
      </div>
    );
  }
}
