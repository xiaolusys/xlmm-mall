const shareMethods = [
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',
];

class WechatUtils {

  config(wechatSign) {
    if (!wechatSign.success) {
      return;
    }
    console.log('wx config');
    window.wx.error(function (res) {
      console.log('wx error');
      console.log(res.errMsg);
    });

    const params = wechatSign.data;
    window.wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: params.app_id, // 必填，公众号的唯一标识
      timestamp: params.timestamp, // 必填，生成签名的时间戳
      nonceStr: params.noncestr, // 必填，生成签名的随机串
      signature: `${encodeURIComponent(params.signature)}`, // 必填，签名，见附录1
      jsApiList: shareMethods, // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
  }

  configShareContent(shareInfo) {
    if (!shareInfo.success) {
      return;
    }

    console.log('configShareContent');
    console.log(shareInfo);

    window.wx.ready(() => {
      console.log('wx ready');
      const params = shareInfo.data;
      /* shareMethods.map(method => {
        window.wx[method]({
          title: params.title,
          desc: params.desc,
          link: params.share_link,
          imgUrl: params.share_img,
          success: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareSucceed',
              eventAction: method,
              eventLabel: params.share_link,
            });
          },
          cancel: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareCanceled',
              eventAction: method,
              eventLabel: params.share_link,
            });
          },
          fail: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareFailed',
              eventAction: method,
              eventLabel: params.share_link,
            });
          },
        });
      });*/

      window.wx.onMenuShareTimeline({
          title: params.title,
          desc: params.desc,
          link: params.share_link,
          imgUrl: params.share_img,
          success: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareSucceed',
              eventAction: 'onMenuShareTimeline',
              eventLabel: params.share_link,
            });
          },
          cancel: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareCanceled',
              eventAction: 'onMenuShareTimeline',
              eventLabel: params.share_link,
            });
          },
          fail: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareFailed',
              eventAction: 'onMenuShareTimeline',
              eventLabel: params.share_link,
            });
          },
        });

        window.wx.onMenuShareAppMessage({
          title: params.title,
          desc: params.desc,
          link: params.share_link,
          imgUrl: params.share_img,
          success: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareSucceed',
              eventAction: 'onMenuShareAppMessage',
              eventLabel: params.share_link,
            });
          },
          cancel: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareCanceled',
              eventAction: 'onMenuShareAppMessage',
              eventLabel: params.share_link,
            });
          },
          fail: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareFailed',
              eventAction: 'onMenuShareAppMessage',
              eventLabel: params.share_link,
            });
          },
        });

        window.wx.onMenuShareQQ({
          title: params.title,
          desc: params.desc,
          link: params.share_link,
          imgUrl: params.share_img,
          success: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareSucceed',
              eventAction: 'onMenuShareQQ',
              eventLabel: params.share_link,
            });
          },
          cancel: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareCanceled',
              eventAction: 'onMenuShareQQ',
              eventLabel: params.share_link,
            });
          },
          fail: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareFailed',
              eventAction: 'onMenuShareQQ',
              eventLabel: params.share_link,
            });
          },
        });

        window.wx.onMenuShareWeibo({
          title: params.title,
          desc: params.desc,
          link: params.share_link,
          imgUrl: params.share_img,
          success: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareSucceed',
              eventAction: 'onMenuShareWeibo',
              eventLabel: params.share_link,
            });
          },
          cancel: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareCanceled',
              eventAction: 'onMenuShareWeibo',
              eventLabel: params.share_link,
            });
          },
          fail: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareFailed',
              eventAction: 'onMenuShareWeibo',
              eventLabel: params.share_link,
            });
          },
        });

        window.wx.onMenuShareQZone({
          title: params.title,
          desc: params.desc,
          link: params.share_link,
          imgUrl: params.share_img,
          success: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareSucceed',
              eventAction: 'onMenuShareQZone',
              eventLabel: params.share_link,
            });
          },
          cancel: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareCanceled',
              eventAction: 'onMenuShareQZone',
              eventLabel: params.share_link,
            });
          },
          fail: () => {
            window.ga && window.ga('send', {
              hitType: 'event',
              eventCategory: 'ShareFailed',
              eventAction: 'onMenuShareQZone',
              eventLabel: params.share_link,
            });
          },
        });

    });
  }

}

export default new WechatUtils();
