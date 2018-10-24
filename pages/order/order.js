// pages/order/order.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    address: [],
    addressObj: '',
    /**订单商品 */
    space: '    ', //空格
    confirmAddressShowhow: false,
    /**确认地址框显示 */
    scrollViewHeight: '', //滚动页面的高度
    sum: 0, //商品金额
    freight: 0, //邮费
    totalSum: 0, //共计金额
    orderSize: 0, //商品种类
    comment: '', //备注

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    init(that, options);
    queryAddress(that);
    //高度自适应
    wx.getSystemInfo({
      success: function(res) {
        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        query.select('.bottom-view').boundingClientRect(function(rect) {
          //获取页面高度
          var clientHeight = res.windowHeight,
            clientWidth = res.windowWidth,
            rpxR = 750 / clientWidth;
          var calc = clientHeight * rpxR - 224;
          that.setData({
            scrollViewHeight: calc
          });
        }).exec();
      }
    });
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
    queryAddress(this);
  },

  /**
   * 确认地址信息
   */
  confirmAddress: function() {
    this.setData({
      confirmAddressShowhow: true
    });
  },
  /**
   * 选择地址
   */
  chooseAddress: function() {
    wx.navigateTo({
      url: '../mine/address',
    })
  },
  /**
   * 获取备注
   */
  getInput: function(e) {
    this.setData({
      comment: e.detail.value
    });
  },
  /**
   * 微信支付
   */
  wechatPay: function(e) {
    this.doAddOrder();
  },
  /**
   * 确认订单
   */
  doAddOrder: function() {
    var that = this;
    wx.showLoading({
      title: '',
    })
    app.request({
      url: '/order/saveEntity.do',
      data: {
        createUser: app.globalData.userInfo.userId,
        number: that.data.orderSize,
        sum: that.data.totalSum,
        comment: that.data.comment,
        status: 2,
        cancleFlag: 1
      },
      success: function(res) {
        var orderList = that.data.orderList;
        var isEnd = false;
        for (var account = 0; account < orderList.length; account++) {
          if (account == orderList.length - 1) {
            isEnd = true;
          }

          doAddOdderDetail(that, res.data.id, orderList[account].wine_id, orderList[account].number, orderList[account].price, that.data.totalSum, that.data.totalSum - that.data.freight, orderList[account].id, isEnd)
        }
      },
      error: function(err) {
        wx.hideLoading();
      }
    });
  }
})

/**
 * 初始化
 */
function init(that, options) {
  var wineData = JSON.parse(options.carData);
  var sum = 0;
  var totalSum = 0;
  //计算商品金额和商品总额
  for (var account = 0; account < wineData.length; account++) {
    sum += wineData[account].price * wineData[account].number
  }
  totalSum = sum + that.data.freight;
  that.setData({
    orderList: wineData,
    sum: sum,
    totalSum,
    orderSize: wineData.length
  });
}

/**
 * 添加订单明细
 */
function doAddOdderDetail(that, orderId, wineId, numbers, price, sum, realSum, id, isEnd) {
  app.request({
    url: '/orderDetail/saveEntity.do',
    data: {
      createUser: app.globalData.userInfo.userId,
      orderId: orderId,
      wineId: wineId,
      number: numbers,
      price: price,
      sum: sum,
      realSum: realSum,
      status: 2,
      cancleFlag: 1
    },
    success: function(res) {
      wx.hideLoading();
      wx.showToast({
        title: '下单成功',
        icon: 'success',
        duration: 2000
      });
      //在购物车中删除已经购买的商品
      deleteCarWine(id, isEnd);
    },
    error: function(err) {
      wx,
      wx.hideLoading();
    }
  });
}

/**
 * 删除购物车商品
 */
function deleteCarWine(id, isEnd) {
  app.request({
    url: '/shoppingcar/deleteEntityByid.do?id=' + id,
    success: function(res) {
      if (isEnd == true) {
        setTimeout(function() {
          wx.navigateTo({
            url: '../main/home',
          })
        }, 2000);
      }
    }
  });
}

function queryAddress(that) {
  wx.showLoading({
    title: '',
  });
  app.request({
    url: '/address/queryList.do?',
    data:{
      createUser: app.globalData.userInfo.userId
    },
    success: function(res) {
      wx.hideLoading();
      var data = res.data;
      if(data.length==0){
       wx.showModal({
         title: '提示',
         content: '先创建地址',
         confirmText:'确认',
         success:function(res){
           wx.navigateTo({
             url: '../mine/addAddress',
           })
         }
       })
      }
      for (var account = 0; account < data.length; account++) {
        if (data[account].defaultAddress == 1){
          var addressObj = data[account];
          that.setData({
            addressObj: addressObj
          });
          break;
        }
      }
    },
    error:function(err){
      wx.hideLoading();
    }
  });
}