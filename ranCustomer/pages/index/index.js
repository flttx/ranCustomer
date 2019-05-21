//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
const network = require('../../utils/network.js');

Page({
  data: {
    userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    banners: [],  //首页banner图
    dailyImg: [],  //daily图
    activities: [], //单图活动数组，包括新人大礼，门店TOP榜，好货上新，专题页
    buttonClicked: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getImg();
  },

  /**
   * 用户点击底部tab
   */
  onTabItemTap(item) {
    this.getImg();
  },



  /**
   * 获取轮播图
   */
  getImg: function(){
    var that = this;
    var param = {};
    // if(type_id != ''){
    //   param = {
    //     type_id: type_id
    //   }
    // }
    network.ajax(network.INDEX_BANNER, 'post', param, r=>{
        if(r.data.length>0){
          let banners = [], dailyImg = [], activities = [];
          for(var i = 0,len = r.data.length;i<len;i++){
            if(r.data[i].type_id == 1){  //首页轮播图
              banners.push(r.data[i]);
            } else if (r.data[i].type_id == 3) {  //daily双图
              dailyImg.push(r.data[i]);
            } else {
              if (r.data[i].type_id == 2){  //新人大礼
                r.data[i].type_name = "新人大礼";
              } else if (r.data[i].type_id == 4){ //门店TOP榜
                r.data[i].type_name = "门店TOP榜";
              } else if (r.data[i].type_id == 5) { //好货上新
                r.data[i].type_name = "好货上新";
              } else if (r.data[i].type_id == 6) { //专题页
                r.data[i].type_name = "专题页";
              }
              activities.push(r.data[i]);
            }
          }
          that.setData({
            banners: banners,
            dailyImg: dailyImg,
            activities: activities
          });
        }
    },null,"加载中...");
  },

  /**
   * 跳转活动
   */
  toActivity: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../packageActivity/pages/activityList/activityList',
      });
    }
  },

   /**
   * 跳转好货
   */
  toGoodsList: function () {
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../packageMe/pages/goodsList/goodsList',
      });
    }
  },

})
