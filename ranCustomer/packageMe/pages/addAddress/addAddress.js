// packageMe/pages/addAddress/addAddress.js
const app = getApp();
const network = require('../../../utils/network.js');



var array = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    citiesIndex: [0, 0, 0, 0], // 选择器索引
    cityArray: [[],[],[],[]], //城市数组
    provinceCode: '',  //省编码
    cityCode: '',  //市编码
    areaCode: '', //区编码
    streetCode: '',  //街道编码
    address: '' , //地址
    region: '', //选择的地址
    setDefault: false,
    name: '', //收件人
    phone: '', //联系电话
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //判断缓存中有木有城市数据，没有则请求服务器上的数据
    if(wx.getStorageSync("cityData")){
      array = wx.getStorageSync("cityData");
      that.initData();
    } else {
      wx.showLoading({
        title: '初始化...',
      });
      wx.request({
        url: 'https://wxapi.xinglinjiuye.cn/js/cityData.js',
        success: res => {
          wx.hideLoading();
          array = res.data;
          wx.setStorageSync("cityData", res.data);
          that.initData();
        }
      });
    }

    //如果是编辑，接收地址参数
    if(options.name){
      this.setData({
        name: options.name,
        phone: options.phone,
        region: options.region,
        address: options.address,
        setDefault: options.isDefault
      });
    }
   
  },

  //初始化省市区选择器数据
  initData: function(){
    let cityArray = [[], [], [], []];

    for (let i = 0, len = array.length; i < len; i++) {  //存入省
      cityArray[0].push({
        name: array[i].name,
        code: array[i].code
      });
    }
    for (let j = 0, len = array[0].children.length; j < len; j++) {  //存入市，默认关联第一个省
      cityArray[1].push({
        name: array[0].children[j].name,
        code: array[0].children[j].code
      });
    }
    for (let k = 0, len = array[0].children[0].children.length; k < len; k++) {  //存入区，默认关联第一个省的第一个市
      cityArray[2].push({
        name: array[0].children[0].children[k].name,
        code: array[0].children[0].children[k].code
      });
    }

    for (let s = 0, len = array[0].children[0].children[0].children.length; s < len; s++) {  //存入街道，默认关联第一个省的第一个市的第一个区
      cityArray[3].push({
        name: array[0].children[0].children[0].children[s].name,
        code: array[0].children[0].children[0].children[s].code
      });
    }
    this.setData({
      cityArray: cityArray
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

  //选择器选择事件
  bindMultiPickerChange(e){
    let cityIndex = e.detail.value;
    console.log(cityIndex);

    let province = array[cityIndex[0]].name;
    let city = array[cityIndex[0]].children[cityIndex[1]].name;
    let district = '', street = '';
    //选择的地址编码
    let areaCode = "";
     //选择的地址文本
    let selectedAddress = "";
    if (array[cityIndex[0]].children[cityIndex[1]].children.length > 0) {
      district = array[cityIndex[0]].children[cityIndex[1]].children[cityIndex[2]].name;
    } else {
      areaCode = array[cityIndex[0]].children[cityIndex[1]].code;
      selectedAddress = province + city;
      this.setData({
        region: selectedAddress,
        areaCode: areaCode
      });
      return;
    }
    if (array[cityIndex[0]].children[cityIndex[1]].children[cityIndex[2]].children.length > 0) {
      street = array[cityIndex[0]].children[cityIndex[1]].children[cityIndex[2]].children[cityIndex[3]].name;
    } else {
      areaCode = array[cityIndex[0]].children[cityIndex[1]].children[cityIndex[2]].code;
      selectedAddress = province + city + district;
      this.setData({
        region: selectedAddress,
        areaCode: areaCode
      });
      return;
    }
   
    selectedAddress = province + city + district + street;
    
    areaCode = array[cityIndex[0]].children[cityIndex[1]].children[cityIndex[2]].children[cityIndex[3]].code;
    this.setData({
      region: selectedAddress,
      areaCode: areaCode
    });
    console.log(selectedAddress);
    console.log(areaCode);
  },

  //列滚动事件
  bindMultiPickerColumnChange(e){
    let selectedIndex = e.detail.value;

    let cityArray = this.data.cityArray;
    let list1 = []; //存放第二列数据，即市的列
    let list2 = []; //存放第三列数据，即区的列
    let list3 = []; //存放第四例数据，即街道的列

    let citiesIndex = [];

   
    
    let provinceIndex = this.data.citiesIndex[0];  //选中的省索引
    let cityIndex = this.data.citiesIndex[1];  //选中的市索引 
    let areaIndex = this.data.citiesIndex[2];  //选中的区索引

    switch (e.detail.column) {
      case 0: //滚动第一列
        for(let i = 0,len = array[selectedIndex].children.length;i<len;i++){
          list1.push({
            name: array[selectedIndex].children[i].name,
            code: array[selectedIndex].children[i].code
          });
        }
        if (array[selectedIndex].children.length > 0) {
          for (let j = 0, len = array[selectedIndex].children[0].children.length; j < len; j++) {
            list2.push({
              name: array[selectedIndex].children[0].children[j].name,
              code: array[selectedIndex].children[0].children[j].code
            });
          }

          if (array[selectedIndex].children[0].children.length > 0){
            for (let k = 0, len = array[selectedIndex].children[0].children[0].children.length; k < len; k++) {
              list3.push({
                name: array[selectedIndex].children[0].children[0].children[k].name,
                code: array[selectedIndex].children[0].children[0].children[k].code
              });
            }
          }
        }

        citiesIndex = [selectedIndex, 0, 0, 0];
        break;
      case 1:  //滚动第二列
        list1 = cityArray[1];

        for(let i = 0,len = array[provinceIndex].children[selectedIndex].children.length;i<len;i++){
          list2.push({
            name: array[provinceIndex].children[selectedIndex].children[i].name,
            code: array[provinceIndex].children[selectedIndex].children[i].code
          });
        }

        if (array[provinceIndex].children[selectedIndex].children.length > 0) {
          for (let j = 0, len = array[provinceIndex].children[selectedIndex].children[0].children.length; j < len; j++) {
            list3.push({
              name: array[provinceIndex].children[selectedIndex].children[0].children[j].name,
              code: array[provinceIndex].children[selectedIndex].children[0].children[j].code
            });
          }
        }
        
        citiesIndex = [provinceIndex, selectedIndex, 0, 0];
        break;
      case 2: //滚动第三列
        list1 = cityArray[1];
        list2 = cityArray[2];

        for (let i = 0, len = array[provinceIndex].children[cityIndex].children[selectedIndex].children.length; i < len; i++) {
          list3.push({
            name: array[provinceIndex].children[cityIndex].children[selectedIndex].children[i].name,
            code: array[provinceIndex].children[cityIndex].children[selectedIndex].children[i].code
          });
        }
        citiesIndex = [provinceIndex, cityIndex, selectedIndex, 0];
        break;
      case 3: //滚动第四列
        list1 = cityArray[1];
        list2 = cityArray[2];
        list3 = cityArray[3];

        citiesIndex = [provinceIndex, cityIndex, areaIndex, selectedIndex];
        break;
    }
    this.setData({
      [`cityArray[1]`]: list1,//重新赋值第二列数组，即联动了市
      [`cityArray[2]`]: list2,//重新赋值第三列数组，即联动了区
      [`cityArray[3]`]: list3,//重新赋值第四列数组，即联动了街道
      citiesIndex: citiesIndex,//更新索引
    });
  },

  //点击默认地址
  clickRadio: function(){
    this.setData({
      setDefault: !this.data.setDefault
    });
  },

  //输入收件人
  inputName: function(e){
    this.setData({
      name: e.detail.value
    });
  },

  //输入联系电话
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },

  //输入地址
  inputAddress: function (e) {
    this.setData({
      address: e.detail.value
    });
  },

  //提交
  commit: function(){
    let name = this.data.name, phone = this.data.phone, address = this.data.address, region = this.data.region;
    if(name == ""){
      wx.showToast({
        title: "请输入收件人姓名",
        icon: 'none'
      });
      return;
    }
    if (phone == "") {
      wx.showToast({
        title: "请输入联系电话",
        icon: 'none'
      });
      return;
    }
    if (region == "") {
      wx.showToast({
        title: "请选择省市区",
        icon: 'none'
      });
      return;
    }
    if (address == "") {
      wx.showToast({
        title: "请输入详细地址",
        icon: 'none'
      });
      return;
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];   //上一页
    let addressList = prevPage.data.addressList;
    addressList.push({
      name: name,
      phone: phone,
      region: region,
      address: address,
      setDefault: this.data.setDefault
    });
    prevPage.setData({
      addressList: addressList
    });
    wx.navigateBack({
      delta: 1
    })
  }

})