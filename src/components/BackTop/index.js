import React, { Component } from 'react';
import _ from 'underscore';
import classnames from 'classnames';
import Animate from 'rc-animate';
import omit from 'object.omit';

import './index.scss';

const getScroll = (w, top) => {
  let ret = w[`page${top ? 'Y' : 'X'}Offset`];
  const method = `scroll${top ? 'Top' : 'Left'}`;
  if (typeof ret !== 'number') {
    const d = w.document;
    // ie6,7,8 standard mode
    ret = d.documentElement[method];
    if (typeof ret !== 'number') {
      // quirks mode
      ret = d.body[method];
    }
  }
  return ret;
};

export class BackTop extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    className: React.PropTypes.string,
    children: React.PropTypes.object,
    visibilityHeight: React.PropTypes.number,
    onClick: React.PropTypes.func,
  };

  static defaultProps = {
    visibilityHeight: window.screen.availHeight,
    prefixCls: 'back-top',
    onClick: _.noop,
  };

  constructor(props) {
    super(props);
    const scrollTop = getScroll(window, true);
    this.state = {
      visible: scrollTop > this.props.visibilityHeight,
    };
  }

  state = {}

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    const scrollTop = getScroll(window, true);
    this.setState({
      visible: scrollTop > this.props.visibilityHeight,
    });
  }

  setScrollTop(value) {
    document.body.scrollTop = value;
    document.documentElement.scrollTop = value;
  }

  scrollToTop = (e) => {
    if (e) e.preventDefault();
    this.setScrollTop(0);
    this.props.onClick(e);
  }

  render() {
    const { prefixCls, className, children, ...otherProps } = this.props;
    const classString = classnames({
      [prefixCls]: true,
      [className]: !!className,
    });

    const defaultElement = (
      <div className={`${prefixCls}-content`}>
        <i className="icon-angle-up icon-yellow"></i>
      </div>
    );

    const style = {
      display: this.state.visible ? 'block' : 'none',
    };

    // fix https://fb.me/react-unknown-prop
    const divProps = omit(otherProps, [
      'visibilityHeight',
    ]);

    return (
      <Animate component="" transitionName="fade">
        {
          this.state.visible ?
            <div data-show={this.state.visible} style={style}>
              <div {...divProps} className={classString} onClick={this.scrollToTop}>
                {children || defaultElement}
              </div>
            </div>
          : null
        }
      </Animate>
    );
  }

}
