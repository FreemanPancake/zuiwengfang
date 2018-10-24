// pages/main/productInfo.js
var app = getApp();
var imageUtil = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: false,
    interval: 5000, 
    duration: 1000,
    imageWidth: 0,
    show: false,
    productInfo:{},/**商品数据 */
    shoppingcarNumber:0,/**购物车数量**/
    wineId:-1,//商品id
    categoryName:'类型名'//类型名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //动态获取手机的宽度设置图片浏览的高宽
    wx.getSystemInfo({
      success: function (result) {
        var screenWidth = result.windowWidth;
        that.setData({
          imageWidth: screenWidth
        });
      }
    });
    that.setData({
      wineId: options.id
    });
    getProduct(this, options.id);
    getShoppingCarNumber(this);
  },
  showHide: function (e) {
    var flag = this.data.show;
    this.setData({ show: !flag });
  },
  /**
   * 添加商品到购物车
   */
  addToCar:function(e){
    var that = this;
    var wineNumber = 1;
    //显示加载框
    wx.showLoading({
      title: '加载中',
    })
    //根据wineId查询
    app.request({
      url: '/shoppingcar/queryList.do',
      method: 'POST',
      data: {
        wineId: that.data.wineId
      },
      success: function (res) {
        var wineNumber = 1;
        if (res.data.length > 0) {
          wineNumber = (res.data[0].number) * 1 + 1;
          updateShoppincar(res.data[0].id, wineNumber);
        } else {
          doAddToCar(app.globalData.userInfo.userId, that.data.wineId, wineNumber)
        }
      },
      error: function (err) {
        //隐藏加载框
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常'
        })
      }
    });
  }
});
/**
 * 获取商品详情
 */
function getProduct(that,id){
 app.request({
   url:'/wine/findEntityById.do',
   method:'GET', 
   data:{
     id:id
   },
   success:function(res){
    var imgs = res.data.photoArr.split(",");
    var imgArr = [];
     for (var account = 0; account < imgs.length;account++){
       imgArr[account] = 'http://66.112.218.52/wine/' + imgs[account]
    }
     that.setData({
       productInfo:res.data,
       imgUrls: imgArr,
       categoryName: res.data.categoryName
     })
   }
 });
}

/**
 * 获取购物车商品数量
 */
function getShoppingCarNumber(that){
  app.request({
    url: '/shoppingcar/queryList.do',
    method: 'POST',
    data: {
      createUser: app.globalData.userInfo.userId
    },
    success: function (res) {
      that.setData({
        shoppingcarNumber:res.data.length
      });
    }
  });
}

/**
 * 添加商品到购物车
 */
function addCar(userId, wineId, numbers) {
  app.request({
    url: '/shoppingcar/saveEntity.do',
    method: 'POST',
    data: {
      createUser: userId,
      wineId: wineId,
      number: numbers
    },
    success: function (res) {
      wx.hideLoading();
      wx.showToast({
        title: '已加入购物车'
      })
    },
    error: function (err) {
      wx.hideLoading();
      wx.showToast({
        title: '服务器异常'
      })
    }
  });
}

/**
 * 更新购物车数据
 */
function updateShoppincar(id, numbers) {
  app.request({
    url: '/shoppingcar/updateNumber.do',
    method: 'POST',
    data: {
      id: id,
      number: numbers
    },
    success: function (res) {
      wx.hideLoading();
      wx.showToast({
        title: '已加入购物车'
      })
    },
    error: function (err) {
      wx.hideLoading();
      wx.showToast({
        title: '服务器异常'
      })
    }
  });

}