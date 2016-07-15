import React, { Component } from 'react';

const banner = 'http://7xogkj.com1.z0.glb.clouddn.com/mall/opening-shop-failed.png';

export default class ShopOpeningFailed extends Component {
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

  render() {
    return (
      <div className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding opening-shop text-center">
        <img className="margin-top-xlg" style={{ width: '30%' }} src={banner} />
        <p className="font-grey-light">哎呀~出错啦</p>
      </div>
    );
  }
}
