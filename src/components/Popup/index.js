import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';
import * as utils from 'utils';
import _ from 'underscore';

import './index.scss';

export class Popup extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    className: React.PropTypes.string,
    prefixCls: React.PropTypes.string,
    height: React.PropTypes.string,
    maxHeight: React.PropTypes.string,
    active: React.PropTypes.bool,
    onPopupOverlayClick: React.PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'popup',
    className: 'className',
    onPopupOverlayClick: _.noop,
    height: 'auto',
    maxHeight: (utils.dom.windowHeight() * 0.6).toFixed(0) + 'px',
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
    const { className, prefixCls, children, height, maxHeight, active, onPopupOverlayClick } = this.props;
    const popupCls = classnames({
      [`${prefixCls}`]: true,
      [className]: true,
      ['hide']: !active,
      [`${prefixCls}-active`]: active,
    });
    return (
      <div className={popupCls}>
        <div className={`${prefixCls}-content row no-margin`} style={{ height: height, maxHeight: maxHeight }}>
          {children}
        </div>
        <div className={`${prefixCls}-overlay`} onClick= {onPopupOverlayClick} ></div>
      </div>
    );
  }
}
