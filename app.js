//app.js
App({
  globalData: {
    weixinUser: null,
    baseUrl: "http://66.112.218.52/wine",
   // baseUrl: "http://koyo527.me/wine/",
    sysLoginInfo: null,
    cacheData: {},
    navigateParam: {},
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  request: function(reqObj) {
    var that = this;
    if (reqObj.method == null) {
      reqObj.method = "POST";
    }
    if (reqObj.header == null) {
      reqObj.header = {};
    }
    if (reqObj.header['content-type'] == null) {
      reqObj.header['content-type'] = 'application/x-www-form-urlencoded';
    }
    if (!reqObj.noLoading) {
      if (reqObj.loadingMsg) {
        wx.showLoading({
          title: reqObj.loadingMsg.msg || "正在请求数据",
          mask: true,
        })
      } else {
        wx.showNavigationBarLoading({
          title: '处理中...',
        })
      }
    }
    wx.request({
      url: 'http://66.112.218.52/wine' + reqObj.url,
      header: {
        'content-type': reqObj.header['content-type']
      },
      method: reqObj.method,
      data: reqObj.data,
      success: function(res) {
        // debugger;
        if (!reqObj.noLoading) {
          if (reqObj.loadingMsg) {
            wx.hideLoading();
          } else {
            wx.hideNavigationBarLoading();
          }
        }
        if (res.data != null) {
          //显示列表
          reqObj.success.apply(that, [res.data]);
        } else {
          wx.showModal({
            title: '系统提示',
            content: res.data.message || "系统错误",
          })
        }
      },
      error: function(e) {
        if (reqObj.error) {
          reqObj.error.apply(this, [e]);
        } else {
          wx.hideNavigationBarLoading();
          wx.showToast({
            title: '系统操作失败' + e,
            duration: 2000
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  /**
   * 退出登录
   */
  logoutSysByWeixin: function (callback) {
    this.globalData.sysLoginInfo = null;
  },
  /**
   * 清除登录信息
   */
  clearLoginInfo: function () {
    wx.removeStorageSync("loginInfo")
  },
})