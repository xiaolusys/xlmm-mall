import * as utils from 'utils';
import _ from 'underscore';

const setupWebViewJavascriptBridge = (callback) => {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  const WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(() => { document.documentElement.removeChild(WVJBIframe); }, 0);
};

export const invoke = (params) => {
  if (utils.detector.isApp() && utils.detector.isIOS()) {
    setupWebViewJavascriptBridge((bridge) => {
      bridge.callHandler(params.method, params.data || {}, params.callback || _.noop);
    });
  } else if (utils.detector.isApp() && utils.detector.isAndroid()) {
    if (!window.AndroidBridge) {
      throw String('this context does not support ' + params.method);
    }
    window.AndroidBridge[params.method](JSON.stringify(params.data));
  }
};
