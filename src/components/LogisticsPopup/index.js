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
        {companies.map((item) => {
          return (
            <div className="col-xs-12 bottom-border padding-bottom-xxs padding-top-xxs logistics-item" key={item.id} data-value={item.id} data-name={item.name} onClick={onItemClick}>
              <If condition={!item.code}>
                <Image className="col-xs-2 login-banner border" thumbnail={70} crop={70 + 'x' + 70} quality={100} src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/logistics/XIAOLU.png'}/>
              </If>
              <If condition={item.code}>
                <Image className="col-xs-2 login-banner border" thumbnail={70} crop={70 + 'x' + 70} quality={100} src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/logistics/' + item.code + '.png'}/>
              </If>
              <p className="no-margin text-center font-md">{item.name}</p>
            </div>
          );
        })}
        </If>
      </Popup>
    );
  }
}
