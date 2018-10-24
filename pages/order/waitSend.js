// pages/order/waitSend.js
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
    queryOrder(this, 2)
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
  // // 下拉刷新
  // onPullDownRefresh: function () {
  //   this.setData({
  //     page: 0,
  //     rows: 5,
  //   });
  //   this.queryOrder(this, 2);
  // },
    // 页面上拉触底事件（上拉加载更多）
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1,
      rows: this.data.rows + 5
    });
    queryOrder(this, 2);
  }
  
})
/**
   * 查询订单
   */
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
      that.setData({
        orderList: res.data
      });
    },
    error: function(err) {
      wx.hideLoading();
    }
  });
}