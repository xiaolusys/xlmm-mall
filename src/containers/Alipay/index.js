import React, { Component } from 'react';

import './index.scss';

export class Alipay extends Component {
  static propTypes = {
    location: React.PropTypes.any,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {}

  componentDidMount() {
    this.refs.alipay.getDOMNode().addEventListener('load', this.onAliPayLoad);
  }

  componentWillUnmount() {
    this.refs.alipay.getDOMNode().removeEventListener('load', this.onAliPayLoad);
  }

  onAliPayLoad = (e) => {

  }

  render() {
    const { location } = this.props;
    return (
      <div className="alipay-mask">
        <iframe ref="alipay" src={location.query.url} width="100%" height="100%"/>
      </div>
    );
  }
}
