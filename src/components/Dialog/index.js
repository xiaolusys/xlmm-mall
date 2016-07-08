import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';
import * as utils from 'utils';
import _ from 'underscore';

import './index.scss';

export class Dialog extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    className: React.PropTypes.string,
    prefixCls: React.PropTypes.string,
    height: React.PropTypes.string,
    width: React.PropTypes.string,
    margin: React.PropTypes.string,
    active: React.PropTypes.bool,
    onPopupOverlayClick: React.PropTypes.func,
    title: React.PropTypes.string,
    content: React.PropTypes.string,
    onCancelBtnClick: React.PropTypes.func,
    onAgreeBtnClick: React.PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'dialog',
    className: 'className',
    onPopupOverlayClick: _.noop,
    height: 'auto',
    width: 260 + 'px',
    margin: (utils.dom.windowWidth() * 0.2).toFixed(0) + 'px',
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.body.classList.toggle('dialog-opened', this.props.active);
  }
  componentWillReceiveProps(nextProps) {
    document.body.classList.toggle('dialog-opened', nextProps.active);
  }
  componentWillUnmount() {
    document.body.classList.remove('dialog-opened');
  }

  render() {
    const { className, prefixCls, children, height, width, margin, active, onPopupOverlayClick, title, content, onCancelBtnClick, onAgreeBtnClick } = this.props;
    const dialogCls = classnames({
      [`${prefixCls}`]: true,
      [className]: true,
      ['hide']: !active,
      [`${prefixCls}-active`]: active,
    });
    return (
      <div className={dialogCls}>
        <div className={`${prefixCls}-content row no-margin`} style={{ height: height, width: width }}>
          <div className={`${prefixCls}-top row no-margin`}>
            <p className="no-margin padding-top-xs padding-bottom-xxs font-lg text-center">{title}</p>
            <p className="no-margin padding-left-xs padding-right-xs padding-bottom-xxs text-left">{content}</p>
          </div>
          <div className="row no-margin text-center font-deep-blue">
            <div className="btn-cancel col-xs-6 padding-top-xxs padding-bottom-xxs">
              <button type="button" onClick={onCancelBtnClick}>取消</button>
            </div>
            <div className="col-xs-6 padding-top-xxs padding-bottom-xxs">
              <button type="button" onClick={onAgreeBtnClick}>同意</button>
            </div>
          </div>
        </div>
        <div className={`${prefixCls}-overlay`} onClick= {onPopupOverlayClick} ></div>
      </div>
    );
  }
}
