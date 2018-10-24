// pages/welcom/authorization.js
var app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              //用户已经授权过
              wx.switchTab({
                url: '../main/home'
              })
            }
          });
        }
      }
    })
  },
  bindGetUserInfo: function(e) {
    //用户按了允许授权按钮
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo; //保存用户信息
      var that = this;
      register(that, e.detail.userInfo);
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  }
})

/**
 * 用户注册
 */
function register(that, userInfo) {
  var appId = 'wx145f20a0e62d4a95';
  var sceart = 'be7b48be1b20d497afd970dbd6681acf';
  wx.login({
    //获取code
    success: function(res) {
      var code = res.code //返回code
      wx.request({
        url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + sceart + '&js_code=' + res.code + '&grant_type=authorization_code',
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          var openid = res.data.openid //返回openid
          app.request({
            url: '/user/queryList.do',
            method: 'POST',
            data: {
              openId: openid
            },
            success: function(res) {
              if (res.data.length == 0) {
                app.request({
                  url: '/user/saveEntity.do',
                  method: 'POST',
                  data: {
                    userName: userInfo.nickName,
                    openId: openid
                  },
                  success: function(result) {
                    app.globalData.userInfo.userId = result.id;
                    wx.switchTab({
                      url: '../main/home'
                    })
                  },
                });
              } else {
                app.globalData.userInfo.userId = res.data[0].id;
                wx.switchTab({
                  url: '../main/home'
                })
              }
            }
          });
        }
      })
    }
  })
}