// packageStore/pages/orderService/orderService.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');

var startHour = 8, endHour = 20; //开始营业时间，结束营业时间

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: null,
    storeType: 1,  //门店类型，1-名车护理，2-奢侈品护理
    number: 1, //洗护数量
    visit_time: '',  //预约时间
    postscript: '', //备注
    price_list_id: '', //价目表id
    price_item: '', //护理项目
    priceList: [], //价目表
    address_id: '',  //地址id
    user_name: '许先生',  //联系人
    phone: '18318318333',  //联系电话
    order_type: 1, //订单类型，1-奢侈品护理，2-名车护理
    userInfo: wx.getStorageSync("userInfo"),  //用户信息
    login: false, //显示登录框
    buttonClicked: false, //防止重复点击
    timeArr: [[], []],
    timeIndex: [0, 0],
    numberArr: [['预计洗护数量'], [], ['件']],
    numberIndex: [0, 0, 0],
    priceArr: [[], []],
    priceIndex: [0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync("addressInfo")){
      this.setData({
        addressInfo: wx.getStorageSync("addressInfo")
      });
    }

    if(options.shop_id){
      let order_type = 1;
      if(options.storeType == 1){
        order_type = 2;
        this.getPriceList(options.shop_id);
      }
      this.setData({
        shop_id: options.shop_id,
        storeType: options.storeType,
        order_type: order_type
      });
    }

    this.initTimeData();

    let arr = [];
    for(let i = 1;i<11;i++){
      arr.push(i);
    }
    this.setData({
      [`numberArr[1]`]: arr
    });
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

  },

  //初始化时间选择器
  initTimeData() {
    let dayArr = [];
    let hour = new Date().getHours();

    let startCount = 0;
    if(hour >= endHour) {
      startCount = 1;
    }
    for (let i = startCount; i < 6; i++) {
      let curDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000 * i);

      dayArr.push({
        value: curDate.toISOString().split('T')[0] + this.getWeekDay(curDate.getDay())
      });
    }
    this.data.timeArr[0] = dayArr;

    let arr = this.getHour(startCount);;
    
    this.data.timeArr[0] = dayArr, this.data.timeArr[1] = arr;
    this.setData({
      timeArr: this.data.timeArr
    });
  },

  getWeekDay(index) {
    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][index];
  },

  //获取时间选择器第二列数据
  getHour(startCount){
    let curhour = new Date().getHours();
    let hour = startHour;
    let arr = [];
    if(this.data.storeType == 1) {
      if (startCount == 0) {
        if (curhour < 8) {
          hour = 8;
        } else if (curhour > 8 && curhour < 20) {
          hour = curhour + 1;
        }
      }

      for (let i = hour; i < endHour; i++) {
        arr.push({
          value: (i<10?('0'+i):i) + ':00'
        });
      }
    } else {
      if (startCount == 0) {
        if(hour < 11){
          arr = [{ value: '上午' }, { value: '下午' }, { value: '晚上' }];
        } else if (hour >= 11 && hour <= 13) {
          arr = [{ value: '下午' }, { value: '晚上' }];
        } else {
          arr = [{ value: '晚上' }];
        }
      } else {
        arr = [{ value: '上午' }, { value: '下午' }, { value: '晚上' }];
      }
    }
   
    return arr;
  },

  //时间选择器列滚动事件
  columnChange(e) {
    let hour = new Date().getHours();
    let startCount = 0;
    if (hour >= endHour) {
      startCount = 1;
    }
    let columnIndex = e.detail.column, index = e.detail.value;

    let arr = this.data.timeArr[1];
    if(columnIndex == 0){
      if(index == 0) {
        arr = this.getHour(startCount);
      } else {
        arr = this.getHour(1);
      }
      this.data.timeIndex[1] = 0;
    }

    this.setData({
      [`timeArr[1]`]: arr
    });
  },

  //时间选择器变更事件
  pickerChange(e) {
    let index1 = e.detail.value[0], index2 = e.detail.value[1];
    this.data.timeIndex = [index1, index2];
    this.setData({
      visit_time: this.data.timeArr[0][index1].value + ' ' + this.data.timeArr[1][index2].value,
      timeIndex: this.data.timeIndex
    });
  },

  //数量选择器变更事件
  numberPickerChange(e){
    let index1 = e.detail.value[0], index2 = e.detail.value[1];
    this.data.numberIndex = [index1, index2];
    this.setData({
      number: this.data.numberArr[1][index2],
      numberIndex: this.data.numberIndex
    });
  },

  //初始化价目表选择器数据
  initPriceData(){
    let list1 = [], list2 = [];
    for(let i = 0, len = this.data.priceList.length;i<len;i++){
      list1.push({
        id: this.data.priceList[i].id,
        name: this.data.priceList[i].price_list_type_name
      });
    }
    let arr = this.data.priceList[0].price_list;
    for (let j = 0, len = arr.length;j<len;j++){
      list2.push({
        id: arr[j].id,
        name: arr[j].price_list_name
      });
    }
    this.data.priceArr[0] = list1, this.data.priceArr[1] = list2;
    this.setData({
      priceArr: this.data.priceArr
    });
  },

  //价目表选择器列滚动事件
  priceColumnChange(e){
    let columnIndex = e.detail.column, index = e.detail.value;
    this.data.priceIndex[columnIndex] = index;
    if(columnIndex == 0){
      let list2 = [];
      let arr = this.data.priceList[index].price_list;
      for (let i = 0, len = arr.length;i<len;i++){
        list2.push({
          id: arr[i].id,
          name: arr[i].price_list_name
        });
      }
      this.setData({
        [`priceArr[1]`]: list2
      });
    }
   
  },

  //价目表选择器变更事件
  pricePickerChange(e){
    let index1 = e.detail.value[0], index2 = e.detail.value[1];
    this.data.priceIndex = [index1, index2];
    this.setData({
      price_item: this.data.priceArr[1][index2].name,
      price_list_id: this.data.priceArr[1][index2].id,
      priceIndex: this.data.priceIndex
    });
  },

  /**
   * 选择地址
   */
  chooseAddress: function () {
    if(!this.data.buttonClicked){
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../../packageMe/pages/addressList/addressList',
      });
    }
    
  },

  //输入备注
  inputPostscript(e){
    this.setData({
      postscript: e.detail.value
    });
  },

  //获取价目表
  getPriceList(shop_id){
    var that = this;
    let param = {};
    param.shop_id = shop_id;
    network.ajax(network.PRICE_LIST, "post", param, res=>{
      that.setData({
        priceList: res.data
      });
      that.initPriceData();
    });
  },


  //提交订单
  commitOrder() {
    if (!this.checkParam()) {
      return;
    }
    let that = this;
    let param = {};
    param.token = that.data.userInfo.token;
    param.order_type = that.data.order_type;
    if(that.data.storeType == 2){
      param.shop_id = that.data.shop_id;
      param.address_id = 8;
      param.number = that.data.number;
    } else {
      param.price_list_id = that.data.price_list_id;
      param.user_name = that.data.user_name;
      param.phone = that.data.phone;
    }

    param.visit_time = that.data.visit_time;
    if (that.data.postscript != "") {
      param.postscript = that.data.postscript;
    }
    

    network.ajax(network.PLACE_ORDER, "post", param, res => {
      // wx.navigateTo({
      //   url: '../payOrder/payOrder?price=' + that.data.realPrice + '&order_sn=' + res.data.order_sn,
      // });
    }, err => {
      if (err.code == 401) {
        that.setData({
          login: true
        });
      } else {
        if (err.msg) {
          wx.showToast({
            title: err.msg,
            icon: "none"
          });
        }
      }
    }, "提交中...");
  },

  //校验参数
  checkParam() {
    if (this.data.visit_time == "") {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none'
      });
      return false;
    }
    if (this.data.storeType == 1 && this.data.price_item == "") {
      wx.showToast({
        title: '请选择护理项目',
        icon: 'none'
      });
      return false;
    }
    return true;
  },


  //刷新用户信息
  refreshUserInfo(e) {
    this.setData({
      userInfo: e.detail
    });
  }
})