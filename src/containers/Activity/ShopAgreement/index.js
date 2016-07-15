import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Header } from 'components/Header';
import { Checkbox } from 'components/Checkbox';
import { Input } from 'components/Input';

// import './index.scss';

const banner = 'http://7xogkj.com1.z0.glb.clouddn.com/mall/opening-shop-banner.jpg';

export default class OpeningShop extends Component {
  static propTypes = {
    children: React.PropTypes.array,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {

  }

  render() {
    return (
      <div>
        <Header title="小鹿妈妈一元体验条款" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="col-xs-12 col-sm-8 col-sm-offset-2 content">
          <h5 >小鹿美美特惠一元体验妈妈条款</h5>
          <p>服务提供方：上海己美网络科技有限公司</p>
          <p>服务享受方：所有支付</p>
          <h5 >1元小鹿妈妈体验包含以下服务</h5>
          <p>15天的小鹿妈妈适用权限，享有小鹿妈妈的推荐奖金、销售佣金、点击提交等全部特权和赚钱方式。</p>
          <p>获得参与我们全国100万妈妈的入门扶持计划，享有开启讲课挣钱（自选或选用我们官方教材，每节课收益30-60元）的权利。</p>
          <p>参与通过分享自己的专属编码链接的活动。带来的销售利益我们会发放8%-30%的佣金给你。</p>
          <p>在你两个星期的体验结束前。也许你已经赚取了一些钱，几十块钱、几百块钱、或者1-2千块钱。你可以选择把这些资金用来购买小鹿美美的衣服，也可以选择提现，只要按照相关的步骤操作即可。</p>
        </div>
      </div>
    );
  }
}
