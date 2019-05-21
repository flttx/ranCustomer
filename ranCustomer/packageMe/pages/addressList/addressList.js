// packageMe/pages/addressList/addressList.js
const app = getApp();
const network = require('../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [{name: "郭迪", phone: "18318318333", region: "江苏省南京市江宁区秣陵街道", address: "天元东路388号城市之光大厦A座1932室", isDefault: true}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  //添加地址
  toAddAddress(){
    wx.navigateTo({
      url: '../addAddress/addAddress',
    })
  },

  //删除地址
  deleteAddress(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定删除该地址？',
      success(res) {
        if (res.confirm) {
          that.data.addressList.splice(index, 1);
          that.setData({
            addressList: that.data.addressList
          });
        }
      }
    })
  },

  //编辑地址
  editAddress(e){
    let index = e.currentTarget.dataset.index;
    let addressList = this.data.addressList;
    wx.navigateTo({
      url: '../addAddress/addAddress?name=' + addressList[index].name + '&phone=' + addressList[index].phone + '&region=' + addressList[index].region + '&address=' + addressList[index].address + '&isDefault=' + addressList[index].isDefault,
    })
  }
})