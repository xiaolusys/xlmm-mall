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
}

export default new Url();
