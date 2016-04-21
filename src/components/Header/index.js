import React, { Component } from 'react';
import _ from 'underscore';
import classnames from 'classnames';

import './index.scss';

export class Header extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    leftIcon: React.PropTypes.string,
    rightIcon: React.PropTypes.string,
    dispatch: React.PropTypes.func,
    leftBtnClick: React.PropTypes.func,
    rightBtnClick: React.PropTypes.func,
  };

  static defaultProps = {
    leftIcon: '',
    rightIcon: '',
    leftBtnClick: _.noop,
    rightBtnClick: _.noop,
  }

  constructor(props) {
    super(props);
  }

  state = {
    leftBtnPressed: false,
    rightBtnPressed: false,
  }

  onRightBtnClick = (e) => {
    const self = this;
    this.setState({ rightBtnPressed: this.state.rightBtnPressed ? false : true });
    this.props.rightBtnClick(e);
    _.delay(() => {
      self.setState({ rightBtnPressed: false });
    }, 50);
    e.preventDefault();
  }

  onLeftBtnClick = (e) => {
    const self = this;
    this.setState({ leftBtnPressed: true });
    this.props.leftBtnClick(e);
    _.delay(() => {
      self.setState({ leftBtnPressed: false });
    }, 50);
    e.preventDefault();
  }

  render() {
    const props = this.props;
    const leftBtnCls = classnames({
      ['icon-btn ' + props.leftIcon + ' icon-yellow']: 1,
      ['pressed']: this.state.leftBtnPressed,
    });
    const rightBtnCls = classnames({
      ['icon-btn ' + props.rightIcon + ' icon-yellow']: 1,
      ['pressed']: this.state.rightBtnPressed,
    });

    return (
      <header className="bar bar-header">
        <button className={leftBtnCls} onClick={this.onLeftBtnClick}></button>
        <p className="title">{props.title}</p>
        <button className={rightBtnCls} onClick={this.onRightBtnClick}></button>
      </header>
    );
  }
}
