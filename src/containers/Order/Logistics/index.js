import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Timeline, TimelineItem } from 'components/Timeline';
import * as actionCreators from 'actions/order/logistics';

import './index.scss';

@connect(
  state => ({
    logistics: state.logistics.data,
    isLoading: state.logistics.isLoading,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Logistics extends Component {
  static propTypes = {
    params: React.PropTypes.any,
    logistics: React.PropTypes.object,
    isLoading: React.PropTypes.bool,
    fetchLogistics: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    this.props.fetchLogistics(this.props.params.id);
  }

  render() {
    const { logistics, isLoading } = this.props || {};
    const logisticsInfo = logistics.data || [];
    return (
      <div>
        <Header title="物流信息" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content">
          {isLoading ? <Loader/> : null}
            <p className="logistics-item bottom-border"><span>快递公司</span><span className="pull-right">{logistics.name || logistics.message}</span></p>
            <p className="logistics-item bottom-border"><span>快递单号</span><span className="pull-right">{logistics.order || logistics.message}</span></p>
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
            <Footer />
          </div>
      </div>
    );
  }
}
