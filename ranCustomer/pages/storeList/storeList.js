// pages/storeList/storeList.js
const app = getApp();
const util = require('../../utils/util.js');
const network = require('../../utils/network.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeType: [],  //门店类型
    currentTab: 0,  //当前tab
    pageIndex: 1, //第几页
    pageSize: 10, //一页加载多少条
    userInfo: null, //用户信息
    login: false, //是否显示登录框
    buttonClicked: false, //是否点击过按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
    });
    this.getStoreType();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.refreshStore === 1){
      this.getStoreList(this.data.storeType[this.data.currentTab].id, this.data.currentTab, true);
    }

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 用户点击底部tab
   */
  onTabItemTap(item) {

    if (this.data.storeType.length > 0){
      this.getStoreList(this.data.storeType[this.data.currentTab].id, this.data.currentTab, true);
    }
  },

  /**
   * 获取门店类型
   */
  getStoreType: function(){
    var that = this;
    var param = {};
    network.ajax(network.SHOP_TYPE, 'post', param, r=>{
      if(r.data.length > 0){
        var storeType = that.data.storeType;
        storeType.push({
          id: '',
          type_name: '全部门店',
          storeList: []
        });
        for(var i = 0, len = r.data.length;i<len;i++){
          r.data[i].storeList = [];
          storeType.push(r.data[i]);
        }
        that.setData({
          storeType: storeType
        });
        that.getStoreList(that.data.storeType[that.data.currentTab].id, that.data.currentTab, false);
      }
    });
  },

  /**
   * 获取指定类型下的门店数据
   * @params: shop_type_id  门店类别id
   * @params: index 类别索引
   * @params: needClear 是否需要清空数组
   */
  getStoreList: function(shop_type_id, index, needClear){
    var that = this;
    var param = {};
    if(that.data.userInfo != ""){
      param.user_id = that.data.userInfo.id;
    }
    if (shop_type_id != ''){
      param.shop_type_id = shop_type_id;
    }
    network.ajax(network.SHOP_LIST, 'post', param, r => {
      if (r.data.length > 0) {
        var storeList = that.data.storeType[index].storeList;   //取出当前类别下的门店数组
        if(needClear){
          storeList = [];
        }
        
        var arr = [];
        if(storeList.length > 0){       
          arr = storeList[that.data.pageIndex-1].arr;
        } else {
          storeList.push({
            index: that.data.pageIndex,   //第几页
            arr: []  //第几页的数据
          });
        }
        for (var i = 0, len = r.data.length;i<len;i++){
          r.data[i].businessTime = r.data[i].start_time.substring(0, 5) + "-" + r.data[i].end_time.substring(0, 5);
          r.data[i].hasLiked = r.data[i].shop_like.length>0;   //判断当前用户是否点赞过该门店
          arr.push(r.data[i]);
        }
        storeList[that.data.pageIndex-1].arr = arr;

        that.setData({  //局部刷新
          [`storeType[${that.data.currentTab}].storeList`]: storeList,
        });
      }
    },null,"加载中...");
  },


  /**
   * 跳转门店详情
   */
  toStoreDetail: function(e){
    if(!this.buttonClicked){
      util.buttonClicked(this);
      let shop_id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../../packageStore/pages/storeHome/storeHome?shop_id=' + shop_id,
      })
    }
  },

  /**
   * 切换tab
   */
  changeTab: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.current
    });
    if (this.data.storeType[this.data.currentTab].storeList.length == 0) {
      this.getStoreList(this.data.storeType[this.data.currentTab].id, this.data.currentTab, true);
    }

  },

  /**
   * 切换轮播内容
   */
  changeSwiper: function (e) {
    if (e.detail.source == 'touch') {
      this.setData({
        currentTab: e.detail.current
      });
      if (this.data.storeType[this.data.currentTab].storeList.length == 0) {
        this.getStoreList(this.data.storeType[this.data.currentTab].id, this.data.currentTab, true);
      }
    }
    
  },

  /**
   * 门店点赞
   */
  clickThumb: function(e){
    var that = this;
    var userInfo = that.data.userInfo;
    let dataset = e.currentTarget.dataset;
    let shop_id = dataset.id;
    let arrIndex = dataset.arrindex;
    let storeIndex = dataset.storeindex;
    let params = {
      shop_id: shop_id,
      token: userInfo.token,
      user_id: userInfo.id
    };
    network.ajax(network.SHOP_LIKE, 'post', params, res=>{
      let msg = res.msg;
      var arr = that.data.storeType[that.data.currentTab].storeList[arrIndex].arr;
      if(msg.indexOf("add")>-1){  //点赞
        arr[storeIndex].hasLiked = true;
        arr[storeIndex].shop_like_count = arr[storeIndex].shop_like_count + 1;
      }
      else {  //取消点赞
        arr[storeIndex].hasLiked = false;
        arr[storeIndex].shop_like_count = arr[storeIndex].shop_like_count - 1;
      }

      that.setData({
        [`storeType[${that.data.currentTab}].storeList[${arrIndex}].arr[${storeIndex}]`]: arr[storeIndex]
      });
    }, err=>{
      if(err.code == 401){
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        });
          that.setData({
            login: true
          });
      }
    });
  },

  //刷新用户信息
  refreshUserInfo(e){
    this.setData({
      userInfo: e.detail
    });
  }

})