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
};
export const shareType = {
  product: 'model',
  shop: 'shop',
};
export const paymentResults = {
  success: '/mall/ol.html?type=2',
  error: '/mall/ol.html?type=1',
};
export const tradeOperations = {
  1: { tag: '立即支付', action: 'pay' }, // 1: 待付款
  2: { tag: '提醒发货', action: 'remind' }, // 2: 已付款
  3: { tag: '确认收货', action: 'confirm' }, // 3: 已发货
  5: { tag: '退货退款', action: 'refund' }, // 3: 交易成功
  7: { tag: '删除订单', action: 'delete' }, // 3: 交易关闭
};
export const gaPayTypes = {
  alipay_wap: 'Alipay',
  wx_pub: 'Wechat Wallet',
  budget: 'Xiaolu Wallet',
};
