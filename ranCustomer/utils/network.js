const util = require('util.js');

/**
 * @params: url 请求地址
 * @params: method get/post
 * @params: data 请求参数
 * @params: successCallBack 请求成功回调函数
 * @params: errorCallBack 请求失败回调函数
 * @params: 等待框提示文字
 */
function ajax(url, method, data, successCallBack, errorCallBack, loadMsg) {
  if (loadMsg && loadMsg !='') {
    wx.showLoading({
      title: loadMsg
    });
  }
  wx.request({
    url: util.url + url,
    method: method,
    data: data,
    success: r => {
      if (loadMsg && loadMsg != '') {
        wx.hideLoading();
      }
      if(r.data.code == 200){
        if (typeof successCallBack == "function") {
          successCallBack(r.data);
        }
      } else {
        if (typeof errorCallBack == "function"){
          errorCallBack(r.data);
        } else {
          var msg = r.data.msg || "请求失败，请检查网络后重试";
          wx.showToast({
            title: msg,
            icon: 'none'
          })
        }
      }
    },
    fail: r=>{
      if (loadMsg && loadMsg != '') {
        wx.hideLoading();
      }
      wx.showToast({
        title: "请求失败，请检查网络后重试",
        icon: 'none'
      })
    }
  })
}



/**
 * 请求接口汇总
 */

//登录
const LOGIN = 'api/auth/login';

//绑定手机号登录
const REGISTER = 'api/auth/register';

/**首页模块 */
//首页大图
const INDEX_BANNER = 'api/banner';

//获取活动分类
const TOPIC_TYPE = 'api/topic/topic_type';

//获取活动列表
const TOPIC_LIST = 'api/topic/topic_list';

//活动详情
const TOPIC_DETAIL = 'api/topic/topic';


/**门店模块 */
//门店类别
const SHOP_TYPE = 'api/shop_cat';

//门店列表
const SHOP_LIST = 'api/shop_list';

//门店点赞
const SHOP_LIKE = 'api/shop_like';

//门店详情
const SHOP_DETAIL = 'api/shop';

//门店服务列表
const SHOP_SERVE_LIST = 'api/shop_serve_list';

//门店服务详情
const SHOP_SERVE = 'api/shop_serve';

//生成订单
const PLACE_ORDER = 'api/order/place_order';

//查询优惠券
const COUPON_LIST = 'api/coupon/coupon';

//领取优惠券
const GET_COUPON = 'api/coupon/user_add_coupon';

//余额支付
const BALANCE_PAY = 'api/pay/balance_pay';

/**我的模块 */
//查询用户信息
const USER_INFO = 'api/user/user';

//获取账户流水
const USER_ACCOUNT = 'api/user/user_account';

//获取用户消费积分流水
const USER_PAY_POINTS = 'api/user/user_pay_point';

//用户签到
const USER_SIGN = 'api/user/user_sign';




module.exports = {
  ajax: ajax,


  INDEX_BANNER: INDEX_BANNER,
  TOPIC_TYPE: TOPIC_TYPE,
  TOPIC_LIST: TOPIC_LIST,
  TOPIC_DETAIL: TOPIC_DETAIL,

  SHOP_TYPE: SHOP_TYPE,
  SHOP_LIST: SHOP_LIST,
  SHOP_DETAIL: SHOP_DETAIL,
  SHOP_LIKE: SHOP_LIKE,
  SHOP_SERVE_LIST: SHOP_SERVE_LIST,
  SHOP_SERVE: SHOP_SERVE,
  PLACE_ORDER: PLACE_ORDER,
  COUPON_LIST: COUPON_LIST,
  GET_COUPON: GET_COUPON,
  BALANCE_PAY: BALANCE_PAY,

  LOGIN: LOGIN,
  REGISTER: REGISTER,

  USER_INFO: USER_INFO,
  USER_ACCOUNT: USER_ACCOUNT,
  USER_PAY_POINTS: USER_PAY_POINTS,
  USER_SIGN: USER_SIGN
}