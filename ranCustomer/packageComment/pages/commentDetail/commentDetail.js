// packageComment/commentDetail/commentDetail.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAll: false,  //查看全部
    commentText: '', //评论文本
    originalText: '大灰色空间和对快接啊时抠脚大汉金卡和复健科阖家安大灰色空间和对快接啊时抠脚大汉金卡和复健科阖家安对快接啊时抠脚大汉金卡和复健科阖家安', //原文本
    textIsOver: false, //文本是否需要隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //判断简介是否需要收起
    var text = '';
    var textIsOver = false;
    if (this.data.originalText.length > 37) {
      text = this.data.originalText .substring(0, 37) + '...';
      textIsOver = true;
    } else {
      text = this.data.originalText;
    }

    this.setData({
      commentText: text,
      textIsOver: textIsOver
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
   * 查看所有文本
   */
  showAllText: function () {
    var text = '';
    if (this.data.showAll) {
      if (this.data.originalText.length > 37) {
        text = this.data.originalText.substring(0, 37) + '...';
      } else {
        text = this.data.originalText
      }
    } else {
      text = this.data.originalText;
    }

    this.setData({
      commentText: text,
      showAll: !this.data.showAll
    });
  },




})