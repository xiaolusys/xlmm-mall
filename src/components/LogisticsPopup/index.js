import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';
import * as utils from 'utils';
import _ from 'underscore';
import { Popup } from 'components/Popup';
import { Image } from 'components/Image';
import { If } from 'jsx-control-statements';

import './index.scss';

export class LogisticsPopup extends Component {
  static propTypes = {
    active: React.PropTypes.bool,
    companies: React.PropTypes.array,
    onItemClick: React.PropTypes.func,
    onColsePopupClick: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  state = {
    imageLoadError: false,
  }

  onImageLoadError = (e) => {
    this.setState({
      imageLoadError: true,
    });
  }

  render() {
    const { active, companies, onItemClick, onColsePopupClick } = this.props;
    const imageCls = classnames({
      ['hide']: this.state.imageLoadError,
    });
    return (
      <Popup className="logistics-content" active={active} onPopupOverlayClick={onColsePopupClick}>
        <div className="col-xs-12 bottom-border padding-bottom-xxs">
          <i className="col-xs-1 margin-top-xxs no-padding icon-1x text-left icon-close font-orange" onClick={onColsePopupClick}></i>
          <p className="col-xs-11 no-margin padding-top-xxs text-center font-lg">物流配送</p>
        </div>
        <If condition={!_.isEmpty(companies)}>
        {companies.map((item, index) => {
          return (
            <div className="col-xs-12 bottom-border padding-bottom-xxs padding-top-xxs logistics-item" key={index} data-value={item.code} data-name={item.name} onClick={onItemClick}>
              <If condition={!item.code}>
                <Image className="col-xs-2 no-padding border" thumbnail={30} crop={30 + 'x' + 30} quality={90} src={'//og224uhh3.qnssl.com/mall/logistics/XIAOLU.png'} onError={this.onImageLoadError}/>
              </If>
              <If condition={item.code}>
                <Image className="col-xs-2 no-padding border" thumbnail={30} crop={30 + 'x' + 30} quality={90} src={'//og224uhh3.qnssl.com/mall/logistics/' + item.code + '.png'} onError={this.onImageLoadError}/>
              </If>
              <p className="col-xs-10 no-margin text-center font-md">{item.name}</p>
            </div>
          );
        })}
        </If>
      </Popup>
    );
  }
}
