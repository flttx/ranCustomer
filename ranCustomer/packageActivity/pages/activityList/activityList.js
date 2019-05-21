// packageActivity/pages/activityList/activityList.js
const app = getApp();
const network = require('../../../utils/network.js');
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: "",
      topic_type_name: "全部",
      list: []
    }],
    currentTab: 0,
    state: [1, 2, 3, 4],
    page: 1, //页数
    limit: 5, //条数
    moreData: true, //是否有更多数据
    buttonClicked: false, //是否点击过

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getType();
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
    if (app.globalData.refreshTopic == 1) {
      this.getList(true);
    }
  },


  //获取分类
  getType: function(){
    var that = this;
    let tabs = that.data.tabs;
    network.ajax(network.TOPIC_TYPE, "post", {}, res=>{
      if(res.data.length>0){
        for(let i = 0,len = res.data.length;i<len;i++){
          res.data[i].list = [];
          tabs.push(res.data[i]);
        }
        that.getList(that.data.page, true);
      }
      that.setData({
        tabs: tabs
      });
    });
  },

  /**
   * 获取分类列表
   */
  getList(needClear){
    var that = this;
    let currentTab = that.data.currentTab;
    let tabs = that.data.tabs;
    let param = {};
    param.page = that.data.page;
    param.limit = that.data.limit;
    if (tabs[currentTab].id != ""){
      param.topic_type_id = tabs[currentTab].id;
    }
    network.ajax(network.TOPIC_LIST, "post", param, res=>{
      if(res.data.data.length>0){
        var list = tabs[currentTab].list;
        if(needClear){
          list = [];
        }

        var arr = [];
        if (list.length > 0) {
          arr = list[that.data.page - 1].arr;
        } else {
          list.push({
            index: that.data.page,   //第几页
            arr: []  //第几页的数据
          });
        }

        for (var i = 0, len = res.data.data.length; i < len; i++) {
          
          arr.push(res.data.data[i]);
        }
        list[that.data.page - 1].arr = arr;

        
        let sum = (that.data.page - 1) * that.data.limit + res.data.page_count;
        let moreData = sum < res.count;
        

        that.setData({  //局部刷新
          [`tabs[${currentTab}].list`]: list,
          moreData: moreData
        });
      }
    },err=>{
      wx.showToast({
        title: '暂无数据',
        icon: 'none'
      })
    },"加载中");
  },

  //加载更多数据
  loadMoreData: function(){
    if(this.data.moreData){
      this.setData({
        page: this.data.page+1
      });
      this.getList(false);
    }
  },


  /**
   * 切换tab
   */
  changeTab: function (e) {
    if(!this.data.buttonClicked){
      util.buttonClicked(this);
      this.setData({
        currentTab: e.currentTarget.dataset.current,
        page: 1,
        moreData: true
      });
      this.getList(true);
    }
  },

  /**
   * 切换轮播内容
   */
  changeSwiper: function (e) {
    if (e.detail.source == 'touch') {
      this.setData({
        currentTab: e.detail.current,
        page: 1,
        moreData: true
      });
      if (this.data.tabs[this.data.currentTab].list.length == 0) {
        this.getList(true);
      }
    }
  },

  //跳转活动详情
  toActivityDetail(e){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../activityDetail/activityDetail?id='+id,
      });
    }
  }
})