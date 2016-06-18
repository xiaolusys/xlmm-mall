class Detector {

  constructor(userAgent) {
    this.userAgent = userAgent.toLocaleLowerCase();
  }

  test(ua) {
    return this.userAgent.indexOf(ua) >= 0;
  }

  isApp() {
    return this.test('xlmm');
  }

  isWechat() {
    return this.test('micromessenger');
  }

  isIOS() {
    return this.test('iphone') || this.test('ipad') || this.test('ipod');
  }

  isAndroid() {
    return this.test('android');
  }

  appVersion() {
    if (this.userAgent.match(/xlmm\/(\d+).(\d+).(\d+)/)) {
      return this.userAgent.match(/xlmm\/(\d+).(\d+).(\d+)/)[0].split('/')[1].replace(/\./g, '');
    }
    return 0;
  }

  deviceId() {
    this.userAgent.substr(this.userAgent.indexOf('uuid')).split('/')[1];
  }
}

export default new Detector(window.navigator.userAgent);
