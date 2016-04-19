class Detector {

  constructor(userAgent) {
    this.userAgent = userAgent;
  }

  test(ua) {
    return this.userAgent.indexOf(ua) >= 0;
  }

  isApp() {
    return this.test('XLMM');
  }

  isWechat() {
    return this.test('MicroMessenger');
  }

  isIOS() {
    return this.test('iPhone') || this.test('iPad') || this.test('iPod');
  }

  isAndroid() {
    return this.test('Android');
  }
}

export default new Detector(window.navigator.userAgent);
