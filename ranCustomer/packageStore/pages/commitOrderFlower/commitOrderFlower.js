// packageStore/pages/commitOrderFlower/commitOrderFlower.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], //花束
    shop_id: '', //门店id
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    pay_points_type: 2, //2为不使用 1为使用(1000积分为一个使用点)
    pay_points: 0, //可用
    shipping_type: 1, //配送方式，1-自取，2-快递，3-同城上门，4-账户
    bless_name: '', //祝福人
    bless_info: '', //祝福内容
    coupon_sn: '', //优惠券编号
    use_type: 1, //用途类别，1-礼品，2-自用
    order_type: 3, //订单类别
    postscript: '', //留言
    hasPhone: false, //是否绑定过手机号码
    phoneNumber: "", //显示的手机号码
    deduction: 0, //积分抵扣金额
    disableCheckbox: false,
    buttonClicked: false, //防止重复点击
    visit_time: '', //预约时间 
    timeArr: [[], []],
    timeIndex: [0, 0],
    sumCount: 0,
    sumPrice: 0,
    realPrice: 0,
    showBox: false, //显示弹出层
    shippingArr: [{ value: '自取', type: 1, selected: true }, { value: '送货上门', type: 3, selected: false  }], //配送方式数组
    useArr: [{ value: '礼品', type: 1, selected: true  }, { value: '自用', type: 2, selected: false }], //用途
    operationType: 1, //操作类型，1-选择配送方式，2-选择花束用途，3-选择祝福卡片， 4-选择备注
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.list){
      this.setData({
        list: JSON.parse(decodeURIComponent(options.list)),
        shop_id: options.shop_id,
        sumCount: options.sumCount,
        sumPrice: Number(options.sumPrice),
        realPrice: Number(options.sumPrice),
        pay_points: this.data.userInfo.pay_points
      });
    }
    this.initTimeData();
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

  //初始化时间选择器
  initTimeData(){
    let dayArr = [];
    for(let i = 1;i<6;i++){
      let curDate = new Date(new Date().getTime() + 8*60*60*1000 + 24*60*60*1000*i);
      
      dayArr.push({
        value: curDate.toISOString().split('T')[0]+this.getWeekDay(curDate.getDay())
      });
    }
    this.data.timeArr[0] = dayArr;

    let arr = [{value: '上午'}, {value: '下午'}];
    this.data.timeArr[0] = dayArr, this.data.timeArr[1]=arr;
    this.setData({
      timeArr: this.data.timeArr
    });
  },

  getWeekDay(index){
    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][index];
  },

  columnChange(e){
    let columnIndex = e.detail.column, index = e.detail.value;
    this.data.timeIndex[columnIndex] = index;
    this.setData({
      timeIndex: this.data.timeIndex
    });
  },

  pickerChange(e){
    let index1 = e.detail.value[0], index2= e.detail.value[1];
    this.setData({
      visit_time: this.data.timeArr[0][index1].value + this.data.timeArr[1][index2].value
    });
  },

  //跳转地址管理
  toAddress(){
    if(!this.data.buttonClicked){
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../../packageMe/pages/addressList/addressList',
      })
    }
  },

  //点击选择
  clickBox(e){
    let type = e.currentTarget.dataset.type;
    this.setData({
      operationType: type,
      showBox: true
    });
  },


  hideMask(){
    this.setData({
      showBox: false
    });
  },

  //选择配送方式
  selectShipping(e){
    let index = e.currentTarget.dataset.index;
    this.data.shippingArr.map((item, i)=>{
      item.selected = i==index;
    });
    this.setData({
      shippingArr: this.data.shippingArr
    });
  },


  //选择用途
  selectUse(e){
    let index = e.currentTarget.dataset.index;
    this.data.useArr.map((item, i) => {
      item.selected = i == index;
    });
    this.setData({
      useArr: this.data.useArr
    });
  },

  //输入卡片收件人
  inputBlessName(e){
    this.setData({
      bless_name: e.detail.value
    });
  },

  //输入卡片内容
  inputBlessName(e) {
    this.setData({
      bless_info: e.detail.value
    });
  },

  //输入备注
  inputPostscript(e){
    this.setData({
      postscript: e.detail.value
    });
  },

  //点击取消
  clickCancel(){
    switch(Number(this.data.operationType)){
      case 1: 
        this.data.shippingArr.map((item, index)=>{
          item.selected = false;
        });
        this.setData({
          shippingArr: this.data.shippingArr
        });
        break;
      case 2:
        this.data.useArr.map((item, index) => {
          item.selected = false;
        });
        this.setData({
          useArr: this.data.useArr
        });
        break;
      case 3:
        this.data.bless_name = "";
        this.data.bless_info = "";
        this.setData({
          bless_name: this.data.bless_name,
          bless_info: this.data.bless_info
        });
        break;
      case 4:
        this.data.postscript = "";
        this.setData({
          postscript: this.data.postscript
        });
        break;
    }

    this.hideMask();
  },

  //点击确定
  clickConfirm(){
    switch (Number(this.data.operationType)) {
      case 1:
        this.data.shippingArr.map((item, index) => {
          if(item.selected){
            this.data.shipping_type = item.type;
          }
        });
        break;
      case 2:
        this.data.useArr.map((item, index) => {
          if(item.selected){
            this.data.use_type = item.type;
          }
        });
        break;
      case 3:
        if ((this.data.bless_name == "" && this.data.bless_info != "") || (this.data.bless_name != "" && this.data.bless_info == "")){
          wx.showToast({
            title: '请填写内容',
            icon: 'none'
          });
          return;
        }
        break;
      default: break;
    }

    this.hideMask();
  },


  //勾选使用积分
  checkboxChange(e) {
    if (e.detail.value.length > 0) {
      let sumPrice = this.data.sumPrice;
      let pay_points = this.data.pay_points;

      let priceCount = parseInt(sumPrice / 10);  //金额对10取余
      let pointCount = parseInt(pay_points / 1000); //积分对1000取余
      let count = Math.min(priceCount, pointCount);

      let realPrice = sumPrice - count * 10;
      this.setData({
        pay_points_type: 1,
        realPrice: realPrice
      })
    } else {
      this.setData({
        pay_points_type: 2,
        realPrice: this.data.sumPrice
      });
    }

  },

  //判断金额是否满足积分抵扣 条件
  judgeCheckbox() {
    if (this.data.sumPrice <= 10 && this.data.pay_points >= 1000) {
      this.setData({
        disableCheckbox: true
      });
    }
  },

  //提交订单
  commitOrder() {
    if(!this.checkParam()){
      return;
    }
    let that = this;
    let param = {};
    param.token = that.data.userInfo.token;
    param.order_type = that.data.order_type;
    param.shop_id = that.data.shop_id;
    param.pay_points_type = that.data.pay_points_type;
    param.address_id = 8;
    param.number = that.data.sumCount;
    param.visit_time = that.data.visit_time;
    if (that.data.postscript != ""){
      param.postscript = that.data.postscript;
    }
    param.shipping_type = that.data.shipping_type;
    if(that.data.bless_name != ""){
      param.bless_name = that.data.bless_name;
      param.bless_info = that.data.bless_info;
    }
    if (that.data.coupon_sn != ""){
      param.coupon_sn = that.data.coupon_sn;
    }
    param.use_type = that.data.use_type;

    network.ajax(network.PLACE_ORDER, "post", param, res => {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];   //上一页
      prevPage.setData({
        basketList: []
      });
      wx.navigateTo({
        url: '../payOrder/payOrder?price=' + that.data.realPrice + '&order_sn=' + res.data.order_sn,
      });
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
  checkParam(){
    if(this.data.visit_time == ""){
      wx.showToast({
        title: '请选择送花时间',
        icon: 'none'
      });
      return false;
    }
    return true;
  }

})