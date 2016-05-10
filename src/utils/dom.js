class Dom {

  documnetHeight() {
    const body = document.body;
    const documentElement = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight, documentElement.clientHeight, documentElement.scrollHeight, documentElement.offsetHeight);
  }

  windowHeight() {
    return window.innerHeight;
  }

  offsetTop(selector) {
    return document.querySelector(selector).offsetTop;
  }
}

export default new Dom();
