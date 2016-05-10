import React, { Component } from 'react';
import _ from 'underscore';
import * as utils from 'utils';
import classnames from 'classnames';
import { If } from 'jsx-control-statements';

import './index.scss';

export class Header extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
    titleType: React.PropTypes.string,
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
    prefixCls: 'header-bar',
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
    const { prefixCls, title, titleType, leftIcon, rightIcon, leftText, rightText, dispatch, onLeftBtnClick, onRightBtnClick, leftBtnPressed, rightBtnPressed } = this.props;
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
      <div className={`${prefixCls}-wrapper`}>
        <If condition={!utils.detector.isApp()}>
          <header className="bar bar-header">
            <button className={leftBtnCls} onClick={onLeftBtnClick}>{leftText}</button>
            <If condition={titleType === 'image'}>
              <div className="text-center image-title">
                <img src={title} />
              </div>
            </If>
            <If condition={titleType !== 'image'}>
              <p className="title">{title}</p>
            </If>
            <button className={rightBtnCls} onClick={onRightBtnClick}>{rightText}</button>
          </header>
          <div className="has-header"></div>
        </If>
      </div>
    );
  }
}
