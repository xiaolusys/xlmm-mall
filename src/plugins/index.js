import * as utils from 'utils';
import _ from 'underscore';

const supportNewBridgeVerison = {
  iOS: 190,
  android: 144,
};

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
  alert('invoke');
  if (utils.detector.isApp() && utils.detector.isIOS() && utils.detector.osMainVersion() > 7 && utils.detector.appVersion() >= supportNewBridgeVerison.iOS) {
    if (!window.webkit) {
      return;
    }
    const messageHandlers = window.webkit.messageHandlers;
    params.data ? messageHandlers[params.method].postMessage(JSON.stringify(params.data)) : messageHandlers[params.method].postMessage();
    alert('iOS native');
    return;
  } else if (utils.detector.isApp() && utils.detector.isAndroid()) {
    if (!window.AndroidBridge) {
      return;
    }
    params.data ? window.AndroidBridge[params.method](JSON.stringify(params.data)) : window.AndroidBridge[params.method]();
    return;
  } else if (utils.detector.isApp() && utils.detector.isIOS()) {
    setupWebViewJavascriptBridge((bridge) => {
      bridge.callHandler(params.method, params.data || {}, function() {
        const callback = params.callback || _.noop;
        window.WVJBIframe = null;
        window.WVJBCallbacks = [];
      });
    });
    return;
  }
};
