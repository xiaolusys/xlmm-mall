import React, { Component } from 'react';
import $ from 'jquery';
import * as utils from 'utils';

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
    utils.ui.loadingSpinner.show();
    $('#alipay-container').on('load', this.onAliPayLoad);
  }

  componentWillUnmount() {
    $('#alipay-container').off('load', this.onAliPayLoad);
  }

  onAliPayLoad = (e) => {
    const $target = $(e.currentTarget);
    utils.ui.loadingSpinner.hide();
    if ($target.contentWindow.location.href && $target.contentWindow.location.href.includes(window.location.host)) {
      console.log(window.location.host);
      window.location.replace($target.contentWindow.location.href.includes);
    }
    e.preventDefault();
  }

  render() {
    const { location } = this.props;
    return (
      <div className="alipay-mask">
        <iframe id="alipay-container" src={location.query.url} width="100%" height="100%" onLoad={this.onAliPayLoad}/>
      </div>
    );
  }
}
