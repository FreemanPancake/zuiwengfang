// pages/order/orderList.js
var app = getApp();
Page({
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    orderList: [], //订单
    status: 0, //订单状态, 0,全部，1，待支付，2，待发货，3，待收货，4待评价
    page: 0, //页码
    rows: 5, //每页数据条数
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    queryOrder(this, e.detail.current);
    // this.setData({
    //   currentTab: e.detail.current
    // });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      queryOrder(this, cur);
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function() {
    var that = this;
    //全部，0表示全部
    queryOrder(that, 0);
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  // // 下拉刷新
  // onPullDownRefresh: function () {
  //   this.setData({
  //     page: 0,
  //     rows: 5,
  //   });
  //   queryOrder(this, this.data.currentTab);
  // },
  // 页面上拉触底事件（上拉加载更多）
  onReachBottom: function() {
    this.setData({
      page: this.data.page + 1,
      rows: this.data.rows + 5
    });
    queryOrder(this, this.data.currentTab);
  },
  footerTap: app.footerTap
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
      that.setData({
        orderList: res.data,
        currentTab: status
      });
    },
    error: function(err) {
      wx.hideLoading();
    }
  });
}