export const baseEndpoint = '/rest/v2/';

export const baseEndpointV1 = '/rest/v1/';

export const offset = 250;

export const image = {
  square: '?imageMogr2/thumbnail/200/format/jpg/quality/90/crop/200x200',
};

export const couponStatus = {
  available: 0,
  used: 1,
  unavailable: 2,
  expired: 3,
  selected: 4,
  negotiable: 5,
};

export const shareType = {
  product: 'model',
  shop: 'shop',
};

export const paymentResults = {
  success: '/mall/order/success',
  error: '/mall/ol.html?type=1&paid=false',
};

export const tradeOperations = {
  1: { tag: '立即支付', action: 'pay' }, // 1: 待付款
  2: { tag: '提醒发货', action: 'remind' }, // 2: 已付款
};

export const gaPayTypes = {
  alipay_wap: 'Alipay',
  wx_pub: 'Wechat Wallet',
  budget: 'Xiaolu Wallet',
};

export const downloadAppUri = '/sale/promotion/appdownload/';

export const disabledDownloadApp = [
  'activity/summer/mat/home',
  'activity/summer/mat/success',
  'activity/summer/mat/register',
  'order/redpacket',
  'mct.html',
  'mcf.html',
  'mama/agreement',
  'mama/open/succeed',
  'mama/open/failed',
  'mama/invited',
];
