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
}

export default new Detector(window.navigator.userAgent);
