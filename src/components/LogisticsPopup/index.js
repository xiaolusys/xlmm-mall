import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';
import * as utils from 'utils';
import _ from 'underscore';
import { Popup } from 'components/Popup';
import { If } from 'jsx-control-statements';

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
    return (
      <Popup active={active} onPopupOverlayClick={onColsePopupClick}>
        <div className="col-xs-12 bottom-border padding-bottom-xxs">
          <i className="col-xs-1 margin-top-xxs no-padding icon-1x text-left icon-close font-orange" onClick={onColsePopupClick}></i>
          <p className="col-xs-11 no-margin padding-top-xxs text-center font-lg">物流配送</p>
        </div>
        <If condition={!_.isEmpty(companies)}>
        {companies.map((item) => {
          return (
            <div className="col-xs-12 bottom-border padding-bottom-xxs padding-top-xxs" key={item.id} data-value={item.id} data-name={item.name} onClick={onItemClick}>
              <i className="col-xs-1 no-padding icon-2x text-center icon-xiaolu icon-grey"></i>
              <p className="no-margin padding-top-xxs text-center font-md">{item.name}</p>
            </div>
          );
        })}
        </If>
      </Popup>
    );
  }
}
