// pages/main/shoppingCar.js
var app = getApp();
Page({
  /** 
   * 页面的初始数据
   */
  data: {

    simplechoice: true, //单选

    isAllChoice: true,//全选

    hasCache: true,//缓存中是否有数据

    shoppingCarList: [],//购物车数据

    editProduct: false,//全选编辑商品

    isAllEdit: false,//编辑商品

    sum: 0,//共计金额

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    initView(this); /*初始化 */

    this.getShoppingcarData(); /*获取购物车缓存数据 */
  },
  /**
   * 点击全选
   */
  allChoice: function() {
    var that = this;
    that.setData({
      isAllChoice: !that.data.isAllChoice
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 下单
   */
  order: function(e) {
    var carData = this.data.shoppingCarList;
    wx.navigateTo({
      url: '../order/order?carData=' + JSON.stringify(carData)
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    /*获取购物车数据 */
    this.getShoppingcarData();
  },
  /**
   * 获取购物车数据
   */
  getShoppingcarData: function() {
    var that = this;
    app.request({
      url: '/shoppingcar/queryListShoppingCar.do',
      method: 'POST',
      data: {
        userId: app.globalData.userInfo.userId
      },
      success: function(res) {
        wx.hideLoading();
        var carData = res.data;
        if (carData.length == 0) {
          that.setData({
            hasCache: false,
          })
        } else {
          var totalSum = 0;
          for (var acounter = 0; acounter < carData.length; acounter++) {
            totalSum += (carData[acounter].number) * (carData[acounter].price);
          }
          that.setData({
            hasCache: true,
            shoppingCarList: carData,
            sum: totalSum
          });
        }
      },
      error: function(err) {
        wx.hideLoading();
      }
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 跳转到商品详情
   */
  productInfo: function(e) {
    /*获取当前点击栏数据*/
    var itemData = e.currentTarget.dataset.item;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'productInfo?id=' + itemData.id,
    })
  },
  /**
   * 编辑商品
   */
  editProduct: function() {
    var that = this;
    //置换编辑和完成
    if (that.data.editProduct) {
      that.setData({
        editProduct: !that.data.editProduct,
        simplechoice: true
      });
    } else {
      that.setData({
        editProduct: !that.data.editProduct,
        simplechoice: false,
      });
    }
  },
  /**
   * 点击减号
   */
  subtraction: function(e) {
    var that = this;
    var itemData = e.currentTarget.dataset.item;
    if (itemData.number * 1 == 1) {
      wx.showModal({
        title: '提示',
        content: '确定将该商品移除购物车吗？',
        success: function(res) {
          if (res.confirm) {
            wx.showLoading({})
            //删除商品
            app.request({
              url: '/shoppingcar/deleteEntityByid.do',
              method: 'POST',
              data: {
                id: itemData.id
              },
              success: function(res) {
                wx.showToast({
                  title: '删除成功',
                })
                wx.hideLoading();
                that.getShoppingcarData();
              },
              error: function(err) {
                wx.hideLoading();
              }
            });
          }
        }
      })
    } else {
      //点击的购物车商品减一
      updateShoppincar(that, itemData.id, (itemData.number) * 1 - 1);
    }
  },
  /**
   * 获取输入内容
   */
  getInput: function(e) {
    var that = this;
    var itemData = e.currentTarget.dataset.item;
    var value = e.detail.value;
    if (value * 1 < 1) {
      wx.showToast({
        title: '输入数字必须大于1',
      })
    }
    updateShoppincar(that, itemData.id, (value) * 1);
  },

  /**
   * 点击加号
   */
  add: function(e) {
    var that = this;
    var itemData = e.currentTarget.dataset.item;
    updateShoppincar(that, itemData.id, (itemData.number) * 1 + 1);
  },
  /**
   * 编辑状态下，点击全选
   */
  allEdit: function() {
    var that = this;
    if (that.data.isAllEdit == true) {
      that.setData({
        simplechoice: false,
        isAllEdit: false
      });
    } else {
      that.setData({
        simplechoice: true,
        isAllEdit: true
      });
    }
  },
});
/**
 * 页面数据初始化
 */
function initView(that) {
  var recommendData = [{
      title: "搜藏",
      url: "../../resource/image/collect.png"
    },
    {
      title: "搜藏",
      url: "../../resource/image/collect.png"
    },
    {
      title: "搜藏",
      url: "../../resource/image/collect.png"
    },
    {
      title: "搜藏",
      url: "../../resource/image/collect.png"
    },
    {
      title: "搜藏",
      url: "../../resource/image/collect.png"
    }
  ]
  that.setData({
    recommendData: recommendData
  });
}

/**
 * 更新购物车数据
 */
function updateShoppincar(that, id, numbers) {
  app.request({
    url: '/shoppingcar/updateNumber.do',
    method: 'POST',
    data: {
      id: id,
      number: numbers
    },
    success: function(res) {
      that.getShoppingcarData();
    },
    error: function(err) {}
  });

}