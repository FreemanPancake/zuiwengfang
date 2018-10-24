//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    dataSale: [],
    dataTool: [],
    otherData: [],
    text: "升级VIP后可获得神秘大礼包，购买商品一律9.8折，活动时间：2018-09-01~2018-10-01。赶快去办理吧",
    marqueePace: 0.5, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 20 // 时间间隔
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    initView(this);
    console.log(this.setData);
  },
  onShow: function() {
    var that = this;
    var length = that.data.text.length * that.data.size; //文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt(); // 第一个字消失后立即从右边出现
  },
  /**
   * 个人信息
   */
  userInfo: function() {
    wx.navigateTo({
      url: '../mine/userInfo',
    })
  },
  /**
   * 滚动字体
   */
  scrolltxt: function() {
    var that = this;
    var length = that.data.length; //滚动文字的宽度
    var windowWidth = that.data.windowWidth; //屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function() {
        var maxscrollwidth = length + that.data.marquee_margin; //滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) { //判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        } else {
          //console.log("替换");
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
    } else {
      that.setData({
        marquee_margin: "1000"
      }); //只显示一条不滚动右边间距加大，防止重复显示
    }
  },
  /**
   * 查看全部订单
   */
  allOrder: function() {
    wx.navigateTo({
      url: '../order/orderList',
    })
  },
  /**
   * 点击待付款，代发货。。。
   */
  saleItemClick: function(e) {
    var index = e.currentTarget.dataset.index;
    switch (index) {
      case 1:
        wx.navigateTo({
          url: '../order/waitPay',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '../order/waitSend',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '../order/waitCarry',
        })
        break;
      case 4:
        wx.navigateTo({
          url: '../order/waitEvaluate',
        })
        break;
    }
  },
})

/*****
 * 初始化
 */
function initView(event) {
  var saleDate = [{
      index: 1,
      title: "待付款",
      url: "../../resource/image/wait_pay.png"
    },
    {
      index: 2,
      title: "待发货",
      url: "../../resource/image/wait_send_goods.png"
    },
    {
      index: 3,
      title: "待收货",
      url: "../../resource/image/wait_receive.png"
    },
    {
      index: 4,
      title: "待评价",
      url: "../../resource/image/wait_comment.png"
    },
    {
      index: 5,
      title: "售后",
      url: "../../resource/image/after_sale.png"
    }
  ];
  var toolData = [{
      title: "优惠券",
      url: "../../resource/image/preferential.png"
    },
    {
      title: "红包",
      url: "../../resource/image/red_bag.png"
    },
    {
      title: "V活动",
      url: "../../resource/image/activity.png"
    },
    {
      title: "积分",
      url: "../../resource/image/integral.png"
    },
  ];
  var otherData = [{
      title: "搜藏",
      url: "../../resource/image/collect.png"
    },
    {
      title: "足迹",
      url: "../../resource/image/footmark.png"
    },
    {
      title: "客服",
      url: "../../resource/image/customer_service.png"
    },
    {
      title: "投诉",
      url: "../../resource/image/complaint.png"
    }

  ];
  event.setData({
    dataSale: saleDate,
    dataTool: toolData,
    otherData: otherData
  })
}
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
          wx.showLoading({
            title: '',
          })
          app.request({
            url: '/user/queryList.do',
            method: 'POST',
            data: {
              openId: openid
            },
            success: function(res) {
              wx.hideLoading();
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
                    // console.log(result);
                    wx.hideLoading();
                    wx.showToast({
                      title: '登录成功',
                      icon: 'none',
                      duration: 2000
                    });
                  },
                  error: function(err) {
                    wx.hideLoading();
                  }
                });
              } else {
                app.globalData.userInfo.userId = res.data[0].id;
                wx.showToast({
                  title: '登录成功',
                  icon: 'none',
                  duration: 2000
                });
              }
            },
            error: function(err) {
              wx.hideLoading();
            }
          });
        }
      })
    }
  })
}