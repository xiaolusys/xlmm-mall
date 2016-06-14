import React, { Component, PropTypes } from 'react';
import _ from 'underscore';
import Swipe from 'swipe-js-iso';

import './index.scss';

export class Carousel extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    id: React.PropTypes.string,
    swipeOptions: React.PropTypes.any,
  };

  static defaultProps = {
    swipeOptions: {
      startSlide: 0,
      speed: 400,
      auto: 3000,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
    },
  };

  state = {

  }

  componentDidMount() {
    this.initSwipe();
  }

  componentDidUpdate() {
    if (this.swipe) {
      this.killSwipe();
    }
    this.initSwipe();
  }

  componentWillUnmount() {
    this.killSwipe();
  }


  setActive = (index, el) => {

  }

  getPos() {
    return this.swipe.getPos();
  }

  getNumSlides() {
    return this.swipe.getNumSlides();
  }

  killSwipe = () => {
    this.swipe && this.swipe.kill();
    this.swipe = null;
  }

  initSwipe = () => {
    let { swipeOptions } = this.props;
    swipeOptions = _.extend({}, swipeOptions, { transitionEnd: this.setActive });
    this.swipe = new Swipe(this.refs.carousel, swipeOptions);
  }

  next() {
    this.swipe.next();
  }

  prev() {
    this.swipe.prev();
  }

  slide(...args) {
    this.swipe.slide(...args);
  }

  render() {
    const { children, id } = this.props;
    return (
      <div ref="carousel" id={id} className="carousel">
        <div className="carousel-wrap">
          {React.Children.map(children, child => {
            return React.cloneElement(child, { className: 'carousel-item' });
          })}
        </div>
      </div>
    );
  }
}
