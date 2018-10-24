// pages/mine/address.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [] ,//地址列表
    index:0,//默认地址的下表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initAddress();
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
    this.initAddress();
  },
  /**
   * 页面数据初始化
   */
  initAddress: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    app.request({
      url: '/address/queryList.do',
      data:{
        createUser: app.globalData.userInfo.userId
      },
      success: function(res) {
        wx.hideLoading();
        var addressList = res.data;
        for (var account = 0; account < addressList.length; account++) {
          if(addressList[account].defaultAddress == 1){
            var id = addressList[account].id
            that.setData({ index: id});
          }
          addressList[account].firstName = addressList[account].username.charAt(0);
        }
        that.setData({
          addressList: addressList
        });
      },
      error: function(err) {
        wx.hideLoading();
      }
    });
  },
  /**
   * 添加地址
   */
  addAddress: function() {
    wx.navigateTo({
      url: 'addAddress',
    })
  },
  /**
   * 选择地址
   */
  chooseAddress:function(e){
    var currentData = e.currentTarget.dataset.item;
    if (currentData.id == this.data.index) {
      wx.navigateBack({})
      return ;
    }else{
      wx.showLoading({
        title: '',
      })
      chooseDefaultAddress(this.data.index, 0, false);
      chooseDefaultAddress(currentData.id, 1, true);
    }
  }
})

function chooseDefaultAddress(id,value,isEnd){
  app.request({
    url: '/address/updateDefaultAddress.do',
    method: "POST",
    data: {
      id: id,
      defaultAddress: value
    },
    success: function (res) {
      wx.hideLoading();
      if (isEnd == true){
        wx.navigateBack({})
      }
    },
    error: function (err) {
      wx.hideLoading();
    }
  });
}
