class Url {

  getQueryValue(name) {
    const querys = window.location.search.substring(1).split('&');
    for (let i = 0; i < querys.length; i++) {
      const pair = querys[i].split('=');
      if (decodeURIComponent(pair[0]) === name) {
        return decodeURIComponent(pair[1]);
      }
    }
  }

  getBaseUrl() {
    const href = window.location.href;
    return href.substring(0, href.indexOf('/mall/')) + '/mall/';
  }

  parseParam2URIString(params) {
    return Object.keys(params).map(key => (`${key}=${encodeURIComponent(params[key] || '')}`)).join('&');
  }
}

export default new Url();
