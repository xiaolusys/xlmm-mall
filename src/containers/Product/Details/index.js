import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Carousel } from 'components/Carousel';
import { Timer } from 'components/Timer';
import { Image } from 'components/Image';
import * as actionCreators from 'actions/product/details';
import * as constants from 'constants';
import _ from 'underscore';

import './index.scss';

const tabs = {
  details: 0,
  faq: 1,
};

@connect(
  state => ({
    details: state.productDetails.data,
    isLoading: state.productDetails.isLoading,
    error: state.productDetails.error,
    success: state.productDetails.success,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Detail extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    params: React.PropTypes.object,
    details: React.PropTypes.object,
    fetchProductDetails: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };


  static defaultProps = {
    prefixCls: 'product-details',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    stickyTab: false,
    activeTab: 0,
  }

  componentWillMount() {
    const { params } = this.props;
    this.props.fetchProductDetails(params.id);
  }

  render() {
    const { prefixCls, details } = this.props;
    const { stickyTab, activeTab } = this.state;
    return (
      <div className={`${prefixCls}`}>
        <div className="back" onClick={this.context.router.goBack}>
          <i className="icon-angle-left icon-yellow-light"></i>
        </div>
        <If condition={!_.isEmpty(details.detail_content)}>
          <Carousel>
            {details.detail_content && details.detail_content.head_imgs.map((image, index) => {
              return (
                <div key={index} >
                  <Image className="head-image" thumbnail={640} src={image} />
                </div>
              );
            })}
          </Carousel>
          <div className="product-info bottom-border bg-white">
            <div className="row no-margin"><p>{details.detail_content.name}</p></div>
            <div className="row no-margin">
              <p className="col-xs-6 no-padding">
                <span className="font-32">{'￥' + details.detail_content.lowest_agent_price}</span>
                <span className="font-xs font-grey-light">{'/￥' + details.detail_content.lowest_std_sale_price}</span>
              </p>
              <p className="col-xs-6 no-padding margin-top-xs">
                {details.detail_content.item_marks.map((tag, index) => {
                  return (<span className="tag" key={index}>{tag}</span>);
                })}
              </p>
            </div>
          </div>
          <p className="on-shelf-countdown bottom-border bg-white margin-bottom-xxs">
            <span>剩余时间</span>
            <Timer className="pull-right" endDateString={details.detail_content.offshelf_time} format="dd天:hh时:mm分:ss秒" />
          </p>
          <div className="row no-margin text-center bg-white">
            <div className="col-xs-3 no-padding">
              <i className="icon-new icon-3x icon-red"></i>
              <p>天天上新</p>
            </div>
            <div className="col-xs-3 no-padding">
              <i className="icon-shield icon-3x icon-red"></i>
              <p>100%正品</p>
            </div>
            <div className="col-xs-3 no-padding">
              <i className="icon-truck-o icon-3x icon-red"></i>
              <p>全国包邮</p>
            </div>
            <div className="col-xs-3 no-padding">
              <i className="icon-seven-o icon-3x icon-red"></i>
              <p>七天退货</p>
            </div>
          </div>
          <div className="product-spec bg-white margin-top-xxs">
            <p className="font-md font-weight-700">商品参数</p>
            <p><span>商品编号</span><span className="margin-left-xxs font-grey-light">{details.detail_content.name}</span></p>
            <p><span>商品材质</span><span className="margin-left-xxs font-grey-light">{details.detail_content.properties.material}</span></p>
            <p><span>可选颜色</span><span className="margin-left-xxs font-grey-light">{details.detail_content.properties.color}</span></p>
            <p><span>洗涤说明</span><span className="margin-left-xxs font-grey-light">{details.detail_content.properties.wash_instructions}</span></p>
          </div>
          <div className={'tabs text-center bottom-border margin-top-xxs' + (stickyTab ? 'sticky' : '')}>
            <ul className="row no-margin">
              <li className={'col-xs-6' + (activeTab === tabs.details ? ' active' : '')} data-id={tabs.details} onClick={this.onTabItemClick}>
                <div>内容展示</div>
              </li>
              <li className={'col-xs-6' + (activeTab === tabs.faq ? ' active' : '')} data-id={tabs.faq} onClick={this.onTabItemClick}>
                <div>购买咨询</div>
              </li>
            </ul>
          </div>
          <div className="details">
            {details.detail_content.content_imgs.map((image, index) => {
              return (<Image key={index} className="col-xs-12 no-padding" thumbnail={640} src={image} />);
            })}
          </div>
        </If>
      </div>
    );
  }
}
