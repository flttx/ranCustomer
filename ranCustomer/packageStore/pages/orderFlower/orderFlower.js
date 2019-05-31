// packageStore/pages/orderFlower/orderFlower.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');


var timer = null;
var startTime = 0, endTime = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],  //缩略图
    imgs: [], //原图
    currentIndex: 0,
    buttonClicked: false, //防止重复点击
    shop_id: '', //门店id
    userInfo: wx.getStorageSync("userInfo"),
    login: false, //是否显示登录框
    basketList: [], //花篮花束列表
    showBasket: false, //显示花篮
    sumPrice: 0, //总价
    sumCount: 0, //总数量
    hasRequest: false, //是否请求过花篮接口
    buttonClicked: false, //防止重复点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.shop_id){
      this.setData({
        shop_id: options.shop_id
      });

      this.getFlowerList();
    }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.basketList.length > 0) {
      this.changeBasket();
    }
    this.setData({
      showBasket: false
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.basketList.length > 0) {
      this.changeBasket();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


  /**
   * 跳转花艺订单页面
   */
  toCommitOrderFlower: function(){
    if(this.data.basketList.length == 0){
      return;
    }
    if(!this.data.buttonClicked){
      util.buttonClicked(this);
      wx.navigateTo({
        url: '/packageStore/pages/commitOrderFlower/commitOrderFlower?list=' +encodeURIComponent(JSON.stringify(this.data.basketList)) + '&shop_id=' + this.data.shop_id + '&sumCount=' + this.data.sumCount + '&sumPrice=' + this.data.sumPrice,
      });
    }
    
  },

  changeSwiper(e){
    this.setData({
      currentIndex: e.detail.current
    });
  },

  //获取花束列表
  getFlowerList(){
    let that = this;
    let param = {};
    param.shop_id = that.data.shop_id;
    network.ajax(network.FLOWER_LIST, 'post', param, res=>{
      if(res.data.length>0){
        let imgs = [];
        for(let i = 0,len = res.data.length;i<len;i++){
          imgs.push(res.data[i].flower_img);
        }
        that.setData({
          banners: res.data,
          imgs: imgs
        });

        if (that.data.userInfo.token) { 
          that.getFlowerBasket(false);
        }

      }
    }, null, '加载中...');
  },

  //获取花篮
  getFlowerBasket(isShowBasket) {
    let that = this;
    let param = {};
    param.shop_id = that.data.shop_id;
    if(this.data.userInfo.token){
      param.token = this.data.userInfo.token;
    } else {
      this.setData({
        login: true
      });
      return;
    }
    that.setData({
      hasRequest: true
    });
    network.ajax(network.FLOWER_BASKET, 'post', param, res => {
      if (res.data.length > 0) {

        res.data.map((item, index)=>{
          that.data.banners.map((flower, index)=>{
            if(flower.id == item.flower_id){
              item.flower_number = flower.flower_number;
            }
          });
        });

        that.setData({
          basketList: res.data,
        });
        that.calculatePrice();
        that.setData({
          showBasket: isShowBasket
        });
      }
    }, err=>{
      if(err.code == 404){
        that.setData({
          showBasket: isShowBasket
        });
      } else {
        wx.showToast({
          title: err.data.msg,
          icon: 'none'
        })
      }
    });
  },

  //修改花篮
  changeBasket(){
    let that = this;
    let param = {};
    param.shop_id = that.data.shop_id;
    param.token = that.data.userInfo.token;
    param.data = JSON.stringify(that.data.basketList);
    network.ajax(network.UP_FLOWER_BASKET, 'post', param, res => {
      
    }, null);
  },


  //预览图片
  previewImg(e){
    let index = e.currentTarget.index;
    wx.previewImage({
      urls: this.data.imgs,
      current: this.data.imgs[index]
    })
  },

  //点击我的花篮
  clickMyBasket(){
    if(this.data.basketList.length == 0 && !this.data.hasRequest){
      this.getFlowerBasket(true);
    } else {
      this.setData({
        showBasket: true
      });
      this.calculatePrice();
    }
    
  },

  //点击加入花篮
  addBasket(){
    if(this.data.userInfo.token){
      this.checkFlower();
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      this.setData({
        login: true
      });
    }
  },

  //插入花束数据
  checkFlower(){
    let list = this.data.basketList, banners = this.data.banners, currentIndex = this.data.currentIndex;
    let count = 0;
    for(let i = 0, len = list.length;i<len;i++){
      if (list[i].flower_id == banners[currentIndex].id){
        if(list[i].number<banners[currentIndex].flower_number) {
          list[i].number++;
        }
        else{
          wx.showToast({
            title: '已达库存上限',
            icon: 'none'
          });
        }
        count++;
      }
    }
    if(count == 0){
      list.push({
        id: 0,
        flower_id: banners[currentIndex].id,
        number: 1,
        flower_name: banners[currentIndex].flower_name,
        flower_img: banners[currentIndex].flower_img_thumb,
        flower_brief: banners[currentIndex].flower_brief,
        price: banners[currentIndex].price,
        flower_number: banners[currentIndex].flower_number
      });
    }
    this.setData({
      basketList: list
    });
  },

  //点击减号
  clickMinus(e){
    let index = e.currentTarget.dataset.index;
    let list = this.data.basketList;
    if(list[index].number == 0){
      return;
    }
    list[index].number--;
    this.setData({
      [`basketList[${index}].number`]: list[index].number
    });
    this.calculatePrice();
  },

  //点击加号
  clickAdd(e){
    let index = e.currentTarget.dataset.index;
    let list = this.data.basketList;
    if(list[index].number<list[index].flower_number){
      list[index].number++;
    } else {
      wx.showToast({
        title: '已达库存上限',
        icon: 'none'
      });
      return;
    }
    this.setData({
      [`basketList[${index}].number`]: list[index].number
    });
    this.calculatePrice();
  },

  //开始加
  startAdd(e){
    startTime = new Date().getTime();
    let index = e.currentTarget.dataset.index;
    let list = this.data.basketList;
    timer = setInterval(()=>{
      if (list[index].number < list[index].flower_number) {
        list[index].number++;
      } else {
        clearInterval(timer);
      }
      this.setData({
        [`basketList[${index}].number`]: list[index].number
      });
      this.calculatePrice();
    }, 100);
  },

  //结束加
  endAdd(e){
    endTime = new Date().getTime();
    if((endTime - startTime)<350000){
      this.clickAdd(e);
    }
    clearInterval(timer);
  },

  //开始减
  startMinus(e){
    startTime = new Date().getTime();
    let index = e.currentTarget.dataset.index;
    let list = this.data.basketList;
    timer = setInterval(() => {
      if (list[index].number > 1) {
        list[index].number--;
      } else {
        clearInterval(timer);
        return;
      }
      this.setData({
        [`basketList[${index}].number`]: list[index].number
      });
      this.calculatePrice();
    }, 100);
  },

  //结束减
  endMinus(e){
    endTime = new Date().getTime();
    if ((endTime - startTime) < 200) {
      this.clickMinus(e);
    }
    clearInterval(timer);
  },

  //点击删除
  clickDelete(e){
    let index = e.currentTarget.dataset.index;
    let list = this.data.basketList;
    list[index].number = 0;
    this.setData({
      [`basketList[${index}].number`]: list[index].number
    });
    this.calculatePrice();
  },

  //计算总价和数量
  calculatePrice(){
    let count = 0, sumPrice = 0;
    this.data.basketList.map((item, index)=>{
      count+=item.number;
      sumPrice += Number(item.price)*item.number;
    });
    this.setData({
      sumCount: count,
      sumPrice: sumPrice
    });
  },

  //隐藏蒙版
  hideMask(){
    this.setData({
      showBasket: false
    });
  },



  //刷新用户信息
  refreshUserInfo(e) {
    this.setData({
      userInfo: e.detail
    });
  }
})