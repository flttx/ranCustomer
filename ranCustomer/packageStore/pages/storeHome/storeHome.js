// packageStore/storeHome/storeHome.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    shop_id: "", //门店id
    shop_detail: null,  //门店详情对象

    selectVideo: true,  //选择视频
    imgList: [], //图片数组
    currentImg: 0, //当前图片索引
    playing: false, //播放视频
    introText: '', //门店介绍
    originalText: '大灰色空间和对快接啊时抠脚大汉金卡和复健科阖家安大灰色空间和对快接啊时抠脚大汉金卡和复健科阖家安', //原文本
    textIsOver: false, //文本是否需要隐藏
    clickShowAllText: false,
    storeType: 1, //门店类型，1-名车护理，2-奢侈品护理，3-花艺
    tabs: ['价目', '优惠', '晒一晒'], //tab
    currentTab: 0, //当前选中的tab
    tabTop: 0, //tab距页面顶部距离
    priceTop: 0, //价目区域距页面顶部距离
    discountTop: 0, //优惠区域距页面顶部距离
    commentTop: 0, //晒一晒区域距页面顶部距离
    tabFixed: false, //是否固定tab栏
    windowHeight: 0, //窗口高度
    scrollTop: 0, //页面滚动距离
    item0Playing: false,
    buttonClicked: false, //防止重复点击
    couponList: [], //优惠券列表
    serveList: [], //服务列表
    login: false, //是否显示登录框
    shop_like_count: 0,  //点赞数
    priceList: [], //价目表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.shop_id){
      this.setData({
        shop_id: options.shop_id
      });
    }


    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });


    this.getShopDetail();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    var that = this;
    var tabTop = 0, itemTop0 = 0, itemTop1 = 0, itemTop2 = 0;
    const query = wx.createSelectorQuery();
    // 查询tab栏距页面顶部距离
    query.select('#myTab').boundingClientRect();
    // 查询价目距页面顶部距离
    query.select('#item0').boundingClientRect();
    // 查询优惠距页面顶部距离
    query.select('#item1').boundingClientRect();
    // 查询晒一晒距页面顶部距离
    query.select('#item2').boundingClientRect();
    query.exec(function (res) {
      tabTop = res[0].top;
      itemTop0 = res[1].top;
      itemTop1 = res[2].top;
      itemTop2 = res[3].top;

      that.setData({
        tabTop: tabTop,
        priceTop: itemTop0,
        discountTop: itemTop1,
        commentTop: itemTop2,

      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //创建视频上下文对象
    this.videoContext = wx.createVideoContext('myVideo');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let shop_like_count = this.data.shop_like_count;
    let shop_detail = this.data.shop_detail;
    //如果点赞数改变，门店列表需要刷新
    if (shop_like_count != shop_detail.shop_like_count) {
      app.globalData.refreshStore = 1;
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  //查询门店详情
  getShopDetail() {
    var that = this;
    var param = {};
    if (that.data.userInfo != "") {
      param.user_id = that.data.userInfo.id;
    }
    param.shop_id = that.data.shop_id;

    network.ajax(network.SHOP_DETAIL, 'post', param, r => {


      //判断简介是否需要收起
      var text = '';
      var textIsOver = false;
      if (r.data.shop_brief.length > 37) {
        text = r.data.shop_brief.substring(0, 37) + '...';
        textIsOver = true;
      } else {
        text = r.data.shop_brief
      }

      //营业时间取时分
      r.data.start_time = r.data.start_time.substring(0, 5);
      r.data.end_time = r.data.end_time.substring(0, 5);

      //判断当前用户是否点过赞
      r.data.hasLiked = r.data.shop_like.length > 0;

      that.setData({
        introText: text,
        originalText: r.data.shop_brief,
        textIsOver: textIsOver,
        shop_detail: r.data,
        storeType: r.data.shop_type_id,
        shop_like_count: r.data.shop_like_count,
        imgList: r.data.shop_photo
      });

      if (r.data.shop_type_id != 3){
        that.getShopServeList();
        that.getPriceList();
      }
      that.getCouponList();

    }, null, "加载中...");
  },

  //获取价目表
  getPriceList(){
    let that = this;
    let param = {};
    param.shop_id = that.data.shop_id;
    network.ajax(network.PRICE_LIST, "post", param, res => {
      let arr = [];
      let count = 0;
      for(let i = 0, len = res.data.length;i<len;i++){
        if(count == 4){
          break;
        }
        for(let j = 0, len = res.data[i].price_list.length;j<len;j++){
          arr.push(res.data[i].price_list[j]);
          count++;
        }
      }
      that.setData({
        priceList: arr
      });

    }, err=>{
      if(err.code == 404){

      } else {
        wx.showToast({
          title: err.msg,
          icon: 'none'
        });
      }
    });
  },

  //获取门店服务列表
  getShopServeList: function(){
    let that = this;
    let param = {};
    param.shop_id = that.data.shop_id;
    param.page = 1;
    param.limit = 3;
    network.ajax(network.SHOP_SERVE_LIST, 'post', param, r => {
      that.setData({
        serveList: r.data.data
      });

    });
  },

  //获取优惠券列表
  getCouponList: function(){
    let that = this;
    let param = {};
    param.subject_type = 2;
    param.shop_id = that.data.shop_detail.id;
    if(that.data.userInfo.token){
      param.token = that.data.userInfo.token;
    }
    network.ajax(network.COUPON_LIST, 'post', param, r => {
      that.setData({
        couponList: r.data
      });

    });
  },


  /**
   * 门店点赞
   */
  clickThumb: function (e) {
    var that = this;
    var userInfo = that.data.userInfo;
    let shop_id = that.data.shop_id;
    let params = {
      shop_id: shop_id,
      token: userInfo.token,
      user_id: userInfo.id
    };
    network.ajax(network.SHOP_LIKE, 'post', params, res => {
      let msg = res.msg;
      var shop_detail = that.data.shop_detail;
      if (msg.indexOf("add") > -1) {  //点赞
        shop_detail.hasLiked = true;
        shop_detail.shop_like_count = shop_detail.shop_like_count + 1;
      }
      else {  //取消点赞
        shop_detail.hasLiked = false;
        shop_detail.shop_like_count = shop_detail.shop_like_count - 1;
      }

      that.setData({
        shop_detail: shop_detail
      });
     
    }, err => {
      if (err.code == 401) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        });
        app.login(null, null, err => {
          that.setData({
            login: true
          });
        });
      }
    });
  },

  //抢购优惠券
  clickPurchase: function(e){
    if(!this.data.buttonClicked){
      util.buttonClicked(this);

      if (this.data.userInfo.token) {
        let index = e.currentTarget.dataset.index;
        let coupon = this.data.couponList[index];
        if (coupon.f_user_number == coupon.user_number) {
          wx.showToast({
            title: '您已领取过',
            icon: 'none'
          });
          return;
        }

        let param = {
          token: this.data.userInfo.token,
          coupon_id: coupon.id
        };

        //领取优惠券
        network.ajax(network.GET_COUPON, "post", param, r => {
          if (r.msg.indexOf("success") > -1) {
            wx.showToast({
              title: '领取成功',
              icon: 'none'
            })
          } else {
            let data = r.data;
            wx.navigateTo({
              url: '../commitOrder/commitOrder?order_type=3&goods_id=' + data.id + "&goods_name=" + data.name + "&price=" + data.pay_money
            });
          }
        });
      } else {
        this.setData({
          login: true
        });
      }
    }
    
  

  },


  /**
   * 监听页面滚动
   */
  pageScroll: function(e){
    var top = e.detail.scrollTop;
    var centerTop = this.data.windowHeight/3;
    if (top >= (this.data.tabTop-10)) {
      var currentTab = this.data.currentTab;
      if (!this.data.tabFixed) {
        this.setData({
          tabFixed: true
        });
      }
      if (Math.abs(this.data.discountTop - top) <= centerTop) {
        currentTab = 1;
      } else if (Math.abs(this.data.commentTop - top) <= centerTop) {
        currentTab = 2;
      } else if (top <= this.data.priceTop){
        currentTab = 0;
      }
      if (this.data.currentTab != currentTab) {
        this.setData({
          currentTab: currentTab
        });
      }
    } else {
      if (this.data.tabFixed == true){
        this.setData({
          tabFixed: false,
          currentTab: 0
        });
      }
     
    }
  },

  /**
   * 播放视频
   */
  playVideo: function(){
    this.setData({
      playing: true
    });
    this.videoContext.play();
  },

  /**
   * 选择视频
   */
  selectVideo: function(){
    this.setData({
      selectVideo: true
    });
  },

  /**
   * 选择图片
   */
  selectImg: function () {
    this.setData({
      selectVideo: false,
      playing: false
    });
  },

  /**
   * 切换图片
   */
  changeImg: function(e){
    this.setData({
      currentImg: e.detail.current
    });
  },
  /**
   * 查看所有文本
   */
  showAllText: function(){
    var text = '';
    if (this.data.clickShowAllText) {
      if (this.data.originalText.length > 37) {
        text = this.data.originalText.substring(0, 37) + '...';
      } else {
        text = this.data.originalText
      }
    } else {
      text = this.data.originalText;
    }

    this.setData({
      introText: text,
      clickShowAllText: !this.data.clickShowAllText
    });
  },

  /**
   * 切换tab
   */
  changeTab: function(e){
    var current = e.currentTarget.dataset.current;
    var centerTop = this.data.windowHeight/4;
    var scrollTop = 0;
    if(current == 0){
      scrollTop = this.data.priceTop - 40;
    } else if(current == 1){
      scrollTop = this.data.discountTop - centerTop;
    } else if(current == 2){
      scrollTop = this.data.commentTop - centerTop;
    }
    this.setData({
      scrollTop: scrollTop,
      currentTab: current,
      tabFixed: true,
    });
  },

  /**
   * 跳转地图
   */
  toStoreMap: function(){
    if(!this.data.buttonClicked){
      util.buttonClicked(this);
      var shop_detail = this.data.shop_detail;
      wx.openLocation({
        latitude: Number(shop_detail.latitude),
        longitude: Number(shop_detail.longitude),
        name: shop_detail.shop_type.type_name + "（" + shop_detail.shop_name + "）",
        address: shop_detail.address
      })
    }
    
  },

  //拨打电话
  phoneCall: function(){
    if (this.data.shop_detail.shop_phone) {
      let phoneNumber = this.data.shop_detail.shop_phone;
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      })
    }
  },

  /**
   * 跳转预约(奢侈品护理/名车护理))
   */
  toStoreOrder: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      var storeType = this.data.storeType;
      if (storeType == 1 || storeType == 2){
        wx.navigateTo({
          url: '/packageStore/pages/orderService/orderService?shop_id=' + this.data.shop_id + '&storeType=' + storeType,
        })
      } else {
        wx.navigateTo({
          url: '/packageStore/pages/orderFlower/orderFlower?shop_id=' + this.data.shop_id,
        })
      }
    }
  },

  /**
   * 跳转服务项目
   */
  toServiceList: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '/packageStore/pages/serviceList/serviceList?shop_id='+this.data.shop_id,
      })
    }
  },

  /**
   * 跳转优惠套餐详情
   */
  toDiscountDetail: function(e){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/packageStore/pages/discountDetail/discountDetail?id='+id,
      })
    }
  },

  /**
   * 跳转全部晒一晒
   */
  toAllComments: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '/packageStore/pages/allComments/allComments',
      })
    }
  },

  /**
   * 跳转优惠券详情
   */
  toCouponDetail: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '/packageStore/pages/couponDetail/couponDetail',
      })
    }
  },

  /**
   * 播放晒一晒的视频
   */
  playCommentVideo: function(e){
    this.setData({
      item0Playing: true
    });
    var id = e.currentTarget.dataset.id;
    var video = wx.createVideoContext(id);
    video.play();
  },

  //刷新用户信息
  refreshUserInfo(e) {
    this.setData({
      userInfo: e.detail
    });
  }
})