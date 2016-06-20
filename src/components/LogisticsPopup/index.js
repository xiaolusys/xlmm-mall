import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';
import * as utils from 'utils';
import _ from 'underscore';

export class LogisticsPopup extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    className: React.PropTypes.string,
    prefixCls: React.PropTypes.string,
    height: React.PropTypes.string,
    maxHeight: React.PropTypes.string,
    active: React.PropTypes.bool,
    onPopupOverlayClick: React.PropTypes.func,
    companies: React.PropTypes.array,
    onItemClick: React.PropTypes.func,
    onColsePopupClick: React.PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'popup',
    className: 'className',
    onPopupOverlayClick: _.noop,
    height: 'auto',
    maxHeight: (utils.dom.windowHeight() * 0.8).toFixed(0) + 'px',
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.body.classList.toggle('popup-opened', this.props.active);
  }
  componentWillReceiveProps(nextProps) {
    document.body.classList.toggle('popup-opened', nextProps.active);
  }
  componentWillUnmount() {
    document.body.classList.remove('popup-opened');
  }

  render() {
    const { className, prefixCls, children, height, maxHeight, active, onPopupOverlayClick, companies, onItemClick, onColsePopupClick } = this.props;
    const popupCls = classnames({
      [`${prefixCls}`]: true,
      [className]: true,
      ['hide']: !active,
      [`${prefixCls}-active`]: active,
    });
    return (
      <div className={popupCls}>
        <div className={`${prefixCls}-content row no-margin`} style={{ height: height, maxHeight: maxHeight }}>
          <div className="col-xs-12 bottom-border padding-bottom-xxs">
            <i className="col-xs-1 margin-top-xxs no-padding icon-1x text-left icon-close font-orange" onClick={onColsePopupClick}></i>
            <p className="col-xs-11 no-margin padding-top-xxs text-center font-lg">物流配送</p>
          </div>
          {companies.map((item) => {
            return (
              <div className="col-xs-12 bottom-border padding-bottom-xxs padding-top-xxs" key={item.id} data-value={item.id} data-name={item.name} onClick={onItemClick}>
                <i className="col-xs-1 no-padding icon-2x text-center icon-xiaolu icon-grey"></i>
                <p className="no-margin padding-top-xxs text-center font-md">{item.name}</p>
              </div>
            );
          })}
        </div>
        <div className={`${prefixCls}-overlay`} onClick= {onPopupOverlayClick} ></div>
      </div>
    );
  }
}
