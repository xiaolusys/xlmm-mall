import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { DownloadAppBanner } from 'components/DownloadAppBanner';
import { Carousel } from 'components/Carousel';
import { Image } from 'components/Image';
import { BottomBar } from 'components/BottomBar';
import { Radio } from 'components/Radio';
import { Checkbox } from 'components/Checkbox';
import { Popup } from 'components/Popup';
import { LogisticsPopup } from 'components/LogisticsPopup';
import { Toast } from 'components/Toast';
import classnames from 'classnames';
import * as constants from 'constants';
import * as utils from 'utils';
import pingpp from 'vendor/pingpp';
import _ from 'underscore';
import * as spellGroupAction from 'actions/order/spellGroup';

import './index.scss';

const actionCreators = _.extend(spellGroupAction);

@connect(
  state => ({
    spellGroup: state.spellGroup,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Progress extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    spellGroup: React.PropTypes.any,
    fetchSpellGroupDetails: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'spell-group-progress',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {}

  componentWillMount() {
    const { sId } = this.props.params;
    this.props.fetchSpellGroupDetails(sId);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {

  }

  renderCarousel(images) {
    const windowWidth = utils.dom.windowWidth();
    const carouselHeight = Number((utils.dom.windowHeight() * 0.7).toFixed(0));
    return (
      <Carousel >
      {images.map((image, index) => {
        return (
          <div key={index}>
            <Image className="head-image" style={{ width: windowWidth, height: carouselHeight }} thumbnail={windowWidth} crop={ windowWidth + 'x' + carouselHeight } src={image} />
          </div>
        );
      })}
      </Carousel>
    );
  }

  renderProductInfo(info) {
    return (
      <div>
        <div className="product-info bottom-border bg-white">
          <div className="row no-margin">
            <p className="col-xs-8 margin-top-xxs no-wrap font-md">{info.name}</p>
            <p className="col-xs-4 text-right team-price">{`¥${info.team_price}`}</p>
          </div>
          <div className="row no-margin">
            <p className="col-xs-8 no-wrap font-xs">{info.desc}</p>
            <p className="col-xs-4 text-right font-xs">{`独购价${info.agent_price}`}</p>
          </div>
        </div>
      </div>
    );
  }

  renderPresenter(presenters) {
    return (
      <div className="row no-margin presenter-list">
        {presenters.map((presenter, index) => {
        return (
          <div className="col-xs-2" key={index}>
            <Image className="head-image" src={presenter.customer_thumbnail} />
          </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { prefixCls, spellGroup } = this.props;
    return (
      <div className={`${prefixCls}`}>
        <Header title="小鹿美美商城" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content">
          <DownloadAppBanner />
          <If condition={!_.isEmpty(spellGroup.data)}>
            {this.renderCarousel(spellGroup.data.product_info.head_imgs)}
            {this.renderProductInfo(spellGroup.data.product_info)}
            {this.renderPresenter(spellGroup.data.detail_info)}
          </If>
        </div>
      </div>
    );
  }
}
