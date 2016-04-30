import React, { Component } from 'react';
import _ from 'underscore';
import classnames from 'classnames';

import './index.scss';

export class Header extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    leftIcon: React.PropTypes.string,
    rightIcon: React.PropTypes.string,
    leftText: React.PropTypes.string,
    rightText: React.PropTypes.string,
    dispatch: React.PropTypes.func,
    onLeftBtnClick: React.PropTypes.func,
    onRightBtnClick: React.PropTypes.func,
    leftBtnPressed: React.PropTypes.bool,
    rightBtnPressed: React.PropTypes.bool,
  };

  static defaultProps = {
    title: '',
    leftIcon: '',
    rightIcon: '',
    leftBtnPressed: false,
    rightBtnPressed: false,
    onLeftBtnClick: _.noop,
    onRightBtnClick: _.noop,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { title, leftIcon, rightIcon, leftText, rightText, dispatch, onLeftBtnClick, onRightBtnClick, leftBtnPressed, rightBtnPressed } = this.props;
    const leftBtnCls = classnames({
      ['icon-btn ' + leftIcon + ' icon-yellow']: 1,
      ['no-icon']: leftText ? true : false,
      ['pressed']: leftBtnPressed,
    });
    const rightBtnCls = classnames({
      ['icon-btn ' + rightIcon + ' icon-yellow']: 1,
      ['no-icon']: rightText ? true : false,
      ['pressed']: rightBtnPressed,
    });
    return (
      <header className="bar bar-header">
        <button className={leftBtnCls} onClick={onLeftBtnClick}>{leftText}</button>
        <p className="title">{title}</p>
        <button className={rightBtnCls} onClick={onRightBtnClick}>{rightText}</button>
      </header>
    );
  }
}
