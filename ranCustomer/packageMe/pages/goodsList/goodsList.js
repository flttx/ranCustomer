// packageStore/pages/goodsList/goodsList.js
const app = getApp();
const network = require('../../../utils/network.js');
const util = require('../../../utils/util.js');

var timer = null; //定时器，用于长按加减数量自动加减
var startTime = 0,
  endTime = 0; //触摸开始时间和结束时间，用于判断是点击还是按住

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsType: ["精选", "花艺", "汽车", "生活"],
    currentTab: 0,
    buttonClicked: false,
    unfold: false, //展开操作栏
    selectAll: false, //选择全部
    showCart: false, //展示购物车
    cartList: [{
      type: "生活",
      goodList: [{
        good_name: "商品名称一",
        good_spec: ["规格一", "规格二"],
        num: 1,
        price: 66,
        selected: false
      }, {
        good_name: "商品名称二",
        good_spec: ["规格一", "规格二"],
        num: 1,
        price: 100,
        selected: false
      }]
    }, {
      type: "汽车",
      goodList: [{
        good_name: "商品名称一",
        good_spec: ["规格一", "规格二"],
        num: 1,
        price: 66,
        selected: false
      }, {
        good_name: "商品名称二",
        good_spec: ["规格一", "规格二"],
        num: 1,
        price: 100,
        selected: false
      }, {
        good_name: "商品名称二",
        good_spec: ["规格一", "规格二"],
        num: 1,
        price: 100,
        selected: false
      }]
    }],
    goodSumPrice: 0, //商品总价
    cartNum: '', //购物车中商品数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  onHide: function() {
    this.setData({
      unfold: false
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  /**
   * 切换tab
   */
  changeTab: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.current
    });
  },

  /**
   * 切换轮播内容
   */
  changeSwiper: function(e) {
    if (e.detail.source == 'touch') {
      this.setData({
        currentTab: e.detail.current
      });
    }

  },

  //跳转好货详情
  toGoodDetail() {
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../goodDetail/goodDetail?type=' + this.data.currentTab,
      });
    }
  },

  //点击悬浮图标
  clickCart() {
    this.setData({
      unfold: !this.data.unfold
    });
  },

  //点击选择全部
  clickSelectAll() {
    let sumPrice = 0;
    if (!this.data.selectAll) {
      this.data.cartList.map((type, index) => {
        type.goodList.map((good, index) => {
          good.selected = true;
          sumPrice += good.price * good.num;
        });
      });
    }
    this.setData({
      selectAll: !this.data.selectAll,
      goodSumPrice: sumPrice
    });
  },

  //点击购物车图标
  clickCartIcon() {
    this.setData({
      showCart: !this.data.showCart
    });
  },

  //隐藏蒙版
  hideMask() {
    this.setData({
      showCart: false
    });
  },

  //点击加号
  clickAdd(e) {
    let index = e.currentTarget.dataset.index;
    let goodIndex = e.currentTarget.dataset.goodindex;
    this.data.cartList[index].goodList[goodIndex].num++;

    this.setData({
      [`cartList[${index}].goodList[${goodIndex}]`]: this.data.cartList[index].goodList[goodIndex]
    });
    this.calculatePrice();
  },

  //点击减号
  clickMinus(e) {
    let index = e.currentTarget.dataset.index;
    let goodIndex = e.currentTarget.dataset.goodindex;
    this.data.cartList[index].goodList[goodIndex].num--;

    if (this.data.cartList[index].goodList[goodIndex].num == 0) { //如果商品数量减为0，则数组中删除这个商品
      this.data.cartList[index].goodList.splice(goodIndex, 1);
      if (this.data.cartList[index].goodList.length == 0) { //如果该类型下商品数量为0，则数组中删除这个类型
        this.data.cartList.splice(index, 1);
        this.setData({
          [`cartList`]: this.data.cartList
        });
      } else {
        this.setData({
          [`cartList[${index}].goodList`]: this.data.cartList[index].goodList
        });
      }

    } else {
      this.setData({
        [`cartList[${index}].goodList[${goodIndex}]`]: this.data.cartList[index].goodList[goodIndex]
      });
    }
    this.calculatePrice();
  },

  //点击
  clickRadio(e) {
    let index = e.currentTarget.dataset.index;
    let goodIndex = e.currentTarget.dataset.goodindex;
    this.data.cartList[index].goodList[goodIndex].selected = !this.data.cartList[index].goodList[goodIndex].selected;


    this.setData({
      [`cartList[${index}].goodList[${goodIndex}]`]: this.data.cartList[index].goodList[goodIndex]
    });

    this.calculatePrice();
  },

  //按住加号不停地加
  startAdd(e) {
    startTime = new Date().getTime();
    let index = e.currentTarget.dataset.index;
    let goodIndex = e.currentTarget.dataset.goodindex;
    timer = setInterval(() => {
      this.data.cartList[index].goodList[goodIndex].num++;
      this.setData({
        [`cartList[${index}].goodList[${goodIndex}]`]: this.data.cartList[index].goodList[goodIndex]
      });

      this.calculatePrice();
    }, 100);
  },

  //结束加
  endAdd(e) {
    endTime = new Date().getTime();
    if ((endTime - startTime) < 350000) {
      this.clickAdd(e);
    }
    clearInterval(timer);
  },

  //按住减号不停地减
  startMinus(e) {
    startTime = new Date().getTime();
    let index = e.currentTarget.dataset.index;
    let goodIndex = e.currentTarget.dataset.goodindex;

    timer = setInterval(() => {
      if (this.data.cartList[index].goodList[goodIndex].num == 1) {
        clearInterval(timer);
        return;
      }

      this.data.cartList[index].goodList[goodIndex].num--;
      this.setData({
        [`cartList[${index}].goodList[${goodIndex}]`]: this.data.cartList[index].goodList[goodIndex]
      });

      this.calculatePrice();

    }, 100);

  },

  //结束减
  endMinus(e) {
    endTime = new Date().getTime();
    if ((endTime - startTime) < 100) {
      this.clickMinus(e);
    }
    clearInterval(timer);
  },

  //计算商品数量和价格
  calculatePrice() {
    let sumPrice = 0;
    let count = 0;
    this.data.cartList.map((type, index) => {
      type.goodList.map((good, index) => {
        count += good.num;
        if (good.selected) {
          sumPrice += good.price * good.num;
        }
      });
    });
    this.setData({
      goodSumPrice: sumPrice,
      cartNum: count > 99 ? '99+' : count
    });
  },


  //跳转结算页面
  toCartSettlement() {
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      let list = [];
      this.data.cartList.map((item) => {
        item.goodList.map((good, index) => {
          if (good.selected) {
            list.push(good);
          }
        });
      });
      if (list.length == 0) {
        wx.showToast({
          title: '请选择商品',
          icon: 'none'
        });
        return;
      }
      wx.navigateTo({
        url: '../cartSettlement/cartSettlement?list=' + encodeURIComponent(JSON.stringify(list)),
      });
    }

  }

})