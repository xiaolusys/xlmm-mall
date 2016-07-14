import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Image } from 'components/Image';
import { Checkbox } from 'components/Checkbox';
import { Input } from 'components/Input';

// import './index.scss';

const banner = 'http://7xogkj.com1.z0.glb.clouddn.com/mall/opening-shop-succeed.png';

export default class ShopOpeningSucceed extends Component {
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

  componentDidMount() {
    document.body.classList.add('content-white-bg');
  }

  componentWillUnmount() {
    document.body.classList.remove('content-white-bg');
  }

  render() {
    return (
      <div className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding opening-shop">
        <Image style={{ width: '100%' }} src={banner} />
        <div className="row no-margin text-center margin-bottom-xs">
          <button className="col-xs-10 col-xs-offset-1 button button-energized">邀请好友一元开店</button>
        </div>
      </div>
    );
  }
}
