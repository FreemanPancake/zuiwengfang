// pages/main/shoppingCar.js
var app = getApp();
let defaultAddress = 1;
let timer = null;
Page({
  /** 
   * 页面的初始数据
   */
  data: {

    addrPath: '../../resource/image/address.png', //地址路径

    addrStr: '云南省昆明市官渡区...', //默认地址

    openImgpath: '../../resource/image/open.png', //打开图片的路径

    logoPath: '../../resource/image/logo.png', //logo图片路径

    actImgpath: '../../resource/image/activity_middle.png', //活动图片路径

    addImgpath: '../../resource/image/add_black.png', //加号图片路径

    topText: '编辑商品', //编辑商品

    scrollHeight: 0, //滚动页面高度

    simplechoice: true, //单选

    totalChoose: true, //全选

    hasData: true, //购物车中是否有商品

    carData: [], //购物车数据

    editProduct: false, //全选编辑商品

    isAllEdit: false, //编辑商品

    sum: 0, //共计金额

    bgColor: '#FF4500', //结算背景色

    tvColor: '#FFFFFF', //结算字体颜色

    isTopTipShow: false, //顶部提示

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    initView(this); /*初始化 */

    this.getShoppingcarData(); /*获取购物车缓存数据 */
  },
  /**
   * 单选
   */
  simpleChoose: function(e) {
    let thisData = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    var carData = this.data.carData;
    var totalChoose = this.data.totalChoose;
    var newTotalChoose = true;
    var totalSum = 0;
    var bgColor = '#FF4500';
    var tvColor = '#FFFFFF';
    //如果当前是为选中状态，并且数组中全为选中，则将全选置为选中，否则为不选中,以及结算按钮背景色和字体色
    if (!carData[index].checked) {
      for (var account = 0; account < carData.length; account++) {
        if (!carData[account].checked && account != index * 1) {
          newTotalChoose = false;
          break;
        }
      }
    }
    //如果当前是取消选择，则让全选取消选中
    if (carData[index].checked) {
      newTotalChoose = false;
      for (var account = 0; account < carData.length; account++) {
        if (carData[account].checked && account != index * 1) {
          bgColor = '#FF4500';
          tvColor = '#FFFFFF';
          break;
        } else {
          bgColor = '#DDDDDD';
          tvColor = '#222222';
        }
      }

    }
    //置换当前选中状态
    carData[index].checked = !carData[index].checked;

    //刷新全选数字和商品总额
    for (var numbers = 0; numbers < carData.length; numbers++) {
      if (carData[numbers].checked) {
        totalSum += carData[numbers].number * carData[numbers].price
      }
    }
    this.setData({
      carData: carData,
      totalChoose: newTotalChoose,
      isAllEdit: newTotalChoose,
      totalSum: totalSum,
      bgColor: bgColor,
      tvColor: tvColor
    });
  },
  /**
   * 点击全选
   */
  totalChoose: function() {
    var that = this;
    var carData = this.data.carData;
    var totalChoose = this.data.totalChoose;
    var totalSum = 0;
    var bgColor = '#FF4500';
    var tvColor = '#FFFFFF';
    //切换全选按钮时，同时置换每个单选按钮为相应状态
    for (var account = 0; account < carData.length; account++) {
      carData[account].checked = !totalChoose;
      totalSum += carData[account].number * carData[account].price;
    }
    if (totalChoose) {
      totalSum = 0.00;
      bgColor = '#DDDDDD';
      tvColor = '#222222';
    }
    this.setData({
      totalChoose: !totalChoose,
      carData: carData,
      totalSum: totalSum,
      bgColor: bgColor,
      tvColor: tvColor
    });
  },
  /**
   * 选择优惠券
   */
  coupons: function() {
    wx.navigateTo({
      url: '../coupons/couponsList',
    })
  },
  /**
   * 下单
   */
  order: function(e) {
    var carData = this.data.carData;
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
    wx.showLoading({})
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
        var totalSum = 0;
        var hasData = carData.length == 0 ? false : true;
        for (var account = 0; account < carData.length; account++) {
          carData[account].checked = true;
          totalSum += carData[account].price * carData[account].number;
          carData[account].subsImgpath = carData[account].number * 1 > 1 ? '../../resource/image/sub_black.png' :
            '../../resource/image/sub_grey.png';
        }
        that.setData({
          hasData: hasData,
          carData: carData,
          sum: totalSum
        });

      },
      fail(err) {
        wx.hideLoading();
      }
    });
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
    var carData = that.data.carData;
    var editProduct = that.data.editProduct;
    var totalChoose = editProduct ?true:false;
    var topText = editProduct ? '编辑商品' : '完成';
    //切换全选按钮时，同时置换每个单选按钮为相应状态
    for (var account = 0; account < carData.length; account++) {
      carData[account].checked = !editProduct ? false : true;
    }
    //置换编辑和完成
    that.setData({
      editProduct: !editProduct,
      totalChoose: totalChoose,
      carData: carData,
      topText: topText
    });
  },
  /**
   * 点击减号
   */
  carSubs: function(e) {
    var that = this;
    var itemData = e.currentTarget.dataset.item;
    if (itemData.number * 1 == 1) {
      return;
    } else {
      //点击的购物车商品减一
      updateShoppincar(that, itemData.id, (itemData.number) * 1 - 1);
    }
  },
  /**
   * 删除选中的商品
   */
  deleteItem: function(e) {
    let that = this;
    let carData = this.data.carData;
    var index = 0;
    for (var account = 0; account < carData.length; account++) {
      if (carData[account].checked) {
        index = account;
      }
    }
    for (var account = 0; account < carData.length; account++) {
      if (carData[account].checked) {
        if (index == account) {
          doDelete(that, carData[account].id, true);
        } else {
          doDelete(that, carData[account].id, false);
        }
      }
    }
  },
  /**
   * 获取输入内容
   */
  getInput: function(e) {
    var that = this;
    var carData = that.data.carData;
    var index = e.currentTarget.dataset.index;
    var itemData = e.currentTarget.dataset.item;
    var value = e.detail.value;
    if (value * 1 < 1) {
      wx.showToast({
        title: '输入数字必须大于1',
      })
      carData[index].number = carData[index].number;
      that.setData({
        carData: carData
      });
      return;
    }
    updateShoppincar(that, itemData.id, (value) * 1);
  },

  /**
   * 点击加号
   */
  carAdd: function(e) {
    var that = this;
    var itemData = e.currentTarget.dataset.item;
    updateShoppincar(that, itemData.id, (itemData.number) * 1 + 1);
  },
  /**
   * 编辑状态下，点击全选
   */
  allEdit: function() {
    var that = this;
    var carData = this.data.carData;
    var isAllEdit = this.data.isAllEdit;;
    //切换全选按钮时，同时置换每个单选按钮为相应状态
    for (var account = 0; account < carData.length; account++) {
      carData[account].checked = !isAllEdit;
    }
    this.setData({
      isAllEdit: !isAllEdit,
      carData: carData
    });
  },
  /**
   * 选择地址
   */
  chooseAddr: function() {
    wx.navigateTo({
      url: '../mine/address',
    })
  }
});
/**
 * 页面数据初始化
 */
function initView(that) {
  wx.getSystemInfo({
    success: function(res) {
      var clientHeight = res.windowHeight,
        clientWidth = res.windowWidth,
        rpxR = 750 / clientWidth;
      var calc = clientHeight * rpxR - 96;
      that.setData({
        scrollHeight: calc
      })
    }
  });
  //查询默认地址
  queryAddress(that);
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
    error: function(err) {

    }
  });

}


/**
 * 查询地址
 */
function queryAddress(that) {
  wx.showLoading({});
  var addrStr = '选择地址';
  app.request({
    url: '/address/queryList.do?',
    data: {
      createUser: app.globalData.userInfo.userId,
      defaultAddress: defaultAddress
    },
    success: function(res) {
      wx.hideLoading();
      var data = res.data;
      if (data.length > 0) {
        addrStr = data[0].province + data[0].city + data[0].eare + '...';
      }
      that.setData({
        addrStr: addrStr
      });
    },
    fail: function(err) {
      wx.hideLoading();
    },
  });
}
/**
 * 根据id删除商品
 */
function doDelete(that, id, isEnd) {
  wx.showModal({
    title: '提示',
    content: '确定将该商品移除购物车吗？',
    success: function(res) {
      if (res.confirm) {
        wx.showLoading({})
        app.request({
          url: '/shoppingcar/deleteEntityByid.do',
          method: 'POST',
          data: {
            id: id
          },
          success: function(res) {
            wx.hideLoading();
            if (isEnd) {
              app.request({
                url: '/shoppingcar/queryListShoppingCar.do',
                method: 'POST',
                data: {
                  userId: app.globalData.userInfo.userId
                },
                success: function(res) {
                  that.setData({
                    isTopTipShow: true
                  });
                  timer = setTimeout(function() {
                    that.setData({
                      isTopTipShow: false
                    });
                  }, 1500);
                  var carData = res.data;
                  for (var account = 0; account < carData.length; account++) {
                    carData[account].checked = false;
                    carData[account].subsImgpath = carData[account].number * 1 > 1 ? '../../resource/image/sub_black.png' :
                      '../../resource/image/sub_grey.png';
                  }
                  that.setData({
                    carData: carData
                  });
                },
                fail(err) {
                  wx.hideLoading();
                }
              });
            }
          },
          error: function(err) {
            wx.hideLoading();
          }
        });
      }
    }
  });
}