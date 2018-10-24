// pages/order/waitPay.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    page: 0,
    rows: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    queryOrder(this, 1)
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
})

function queryOrder(that, status) {
  wx.showLoading({
    title: '加载中',
  })
  app.request({
    url: '/order/queryPageOfOrderInfo.do',
    method: 'POST',
    data: {
      userId: app.globalData.userInfo.userId,
      status: status,
      page: that.data.page,
      rows: that.data.rows
    },
    success: function(res) {
      wx.hideLoading();
      console.log(res.data);
      that.setData({
        orderList: res.data
      });
    },
    error: function(err) {
      wx.hideLoading();
    }
  });
}