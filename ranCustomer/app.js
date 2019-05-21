//app.js
const network = require('utils/network.js');

App({
  onLaunch: function () {
    wx.onNetworkStatusChange(function (res) {
      if(!res.isConnected){
        wx.showToast({
          title: '网络断开，请连接网络',
          icon: 'none'
        });
      }
    })
  },

  login: function(successCallBack, errorCallBack, noauthCallBack, loadMsg){
    //登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  res.userInfo.code = code;
                  res.userInfo.user_name = res.userInfo.nickName;
                  res.userInfo.photo = res.userInfo.avatarUrl;
                  wx.setStorageSync("wxUserInfo", res.userInfo);
                  // callback(res.userInfo);
                  var rawData = res.rawData, signature = res.signature;
                  let params = {
                    type: "wx_login",
                    code: code,
                    raw_data: rawData,
                    signature: signature
                  }
                  network.ajax(network.LOGIN, "post", params, r=>{
                    if (typeof successCallBack == "function"){
                      successCallBack(r.data);
                    }
                  }, err=>{
                    if (typeof successCallBack == "function") {
                      errorCallBack(err);
                    }
                  }, loadMsg);
                  return;
                }
              })
            }

            else {
              if (typeof noauthCallBack == "function"){
                noauthCallBack();
              }
            }
          }
        })
      }
    });

    
  },

  globalData: {
    userInfo: null,
    refreshStore: 0,  //刷新门店列表
    refreshTopic: 0,  //刷新专题活动列表
  }
})