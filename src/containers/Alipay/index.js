import React, { Component } from 'react';
import $ from 'jquery';
import * as utils from 'utils';
import _ from 'underscore';

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
    utils.ui.loadingSpinner.hide();
    const target = e.currentTarget;
    console.log('>>>>>>>>>' + target.contentWindow.location.href || '');
    console.log(_.contains(target.contentWindow.location.href, window.location.host));
    if (target.contentWindow.location.href && _.contains(target.contentWindow.location.href || '', window.location.host)) {
      window.location.replace(target.contentWindow.location.href);
    }
    e.preventDefault();
  }

  render() {
    const { location } = this.props;
    return (
      <div className="alipay-mask">
        <iframe id="alipay-container" ref="alipay" src={location.query.url} width="100%" height="100%" onLoad={this.onAliPayLoad}/>
      </div>
    );
  }
}
