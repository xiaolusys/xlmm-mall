import React, { Component } from 'react';

export class Image extends Component {

  static propTypes = {
    src: React.PropTypes.string,
    thumbnail: React.PropTypes.number,
    crop: React.PropTypes.string,
    quality: React.PropTypes.number,
    interlace: React.PropTypes.number,
  };

  static defaultProps = {
    thumbnail: 640,
    quality: 90,
    interlace: 1,
  }

  render() {
    const { src, thumbnail, crop, quality, interlace, ...restProps } = this.props;
    const imgSrc = `${src}?imageMogr2/strip/thumbnail/${thumbnail}/format/jpg/quality/${quality}/interlace/${interlace}/` + (crop ? `crop/${crop}` : '');
    return (<img {...restProps} src= {imgSrc} onLoad={this.onLoad} />);
  }
}
