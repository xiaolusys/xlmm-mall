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
    leftBtnActive: false,
    rightBtnActive: false,
  }

  onRightBtnClick = (e) => {
    const self = this;
    this.setState({ rightBtnActive: this.state.rightBtnActive ? false : true });
    this.props.rightBtnClick(e);
    _.delay(() => {
      self.setState({ rightBtnActive: false });
    }, 100);
    e.preventDefault();
  }

  onLeftBtnClick = (e) => {
    const self = this;
    this.setState({ leftBtnActive: true });
    this.props.leftBtnClick(e);
    _.delay(() => {
      self.setState({ leftBtnActive: false });
    }, 100);
    e.preventDefault();
  }

  render() {
    const props = this.props;
    const leftBtnCls = classnames({
      ['icon-btn ' + props.leftIcon + ' icon-yellow']: 1,
      ['active']: this.state.leftBtnActive,
    });
    const rightBtnCls = classnames({
      ['icon-btn ' + props.rightIcon + ' icon-yellow']: 1,
      ['active']: this.state.rightBtnActive,
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
