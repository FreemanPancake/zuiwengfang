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
    productInfo: {},
    /**商品数据 */
    shoppingcarNumber: 0,
    hideNumberFlag: true, //是否隐藏购物车图标数字
    /**购物车数量**/
    //加入购物车对话框
    showDialog: false,
    proInfoWindow: false, //控制弹窗是否显示
    wineId: -1, //商品id
    categoryName: '类型名', //类型名
    categoryList: [], //类型数组
    mealList: [], //套餐数组
    wineNumber: 1, //商品数量
    bgColor: '#f6f6f6', //确定按钮的背景颜色
    tvColor: '#000000', //确定按钮的字体颜色
    subsImg: '../../resource/image/sub_grey.png', //剑豪图片
    confirmFlag: false, //添加购物车确定按钮是否可用
    //购物车对话框
    carDialogShow: false, //购物车对话框显示
    carData: [], //购物车数据
    carHeight: '', //购物车高度
    totalNumber: 0, //商品总数
    totalSum: 0, //购物车总金额
    totalChoose: true, //全选
    calaBgColor: '#FF4500', //结算背景颜色
    calaTvColor: '#FFFFFF'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //初始化
    init(that);
    //动态获取手机的宽度设置图片浏览的高宽
    wx.getSystemInfo({
      success: function(result) {
        var screenWidth = result.windowWidth;
        that.setData({
          imageWidth: screenWidth
        });
      }
    });
    that.setData({
      wineId: options.id
    });
    //获取商品信息
    getProduct(this);
    //获取购物车信息
    queryCarData(this);
  },
  showHide: function(e) {
    var flag = this.data.show;
    this.setData({
      show: !flag
    });
  },
  /**
   * 添加商品到购物车
   */
  addToCar: function(e) {
    this.setData({
      showDialog: !this.data.showDialog,
      proInfoWindow: true
    });
  },
  /**
   * 显示购物车对话框
   */
  showCar: function() {
    if (this.data.shoppingcarNumber == 0) {
      return;
    }
    this.setData({
      carDialogShow: !this.data.carDialogShow, //显示对话框
      proInfoWindow: true, //底层页面不能滚动
    })
  },
  /**
   * 关闭添加购物车对话框
   */
  onClickaddCarView: function() {
    this.setData({
      showDialog: !this.data.showDialog,
      proInfoWindow: false
    });
  },
  /**
   * 关闭购物车对话框
   */
  onClickCarView: function() {
    this.setData({
      carDialogShow: !this.data.carDialogShow,
      proInfoWindow: false
    });
  },
  /**
   * 选择类型
   */
  chooseCate: function(e) {
    var categoryList = this.data.categoryList;
    var mealList = this.data.mealList;
    var bgFlag = false;
    var confirmFlag = false;
    var index = e.currentTarget.dataset.index;
    //切换点击item的背景和字体颜色
    for (var account = 0; account < categoryList.length; account++) {
      categoryList[account].cateChoosed = false;
    }
    categoryList[index].cateChoosed = true;
    //判断套餐和类型是否都选择，切换确定按钮的背景以及字体颜色
    for (var account = 0; account < mealList.length; account++) {
      if (mealList[account].mealChoosed) {
        bgFlag = true;
        confirmFlag = true;
        break;
      }
    }
    if (bgFlag) {
      this.setData({
        bgColor: '#FF4500',
        tvColor: '#FFFFFF'
      });
    } else {
      this.setData({
        bgColor: '#F6F6F6',
        tvColor: '#000000'
      });
    }
    this.setData({
      categoryList: categoryList,
      confirmFlag: confirmFlag
    })
  },
  /**
   * 套餐选择
   */
  chooseMeal: function(e) {
    var mealList = this.data.mealList;
    var categoryList = this.data.categoryList;
    var index = e.currentTarget.dataset.index;
    var confirmFlag = false;
    //切换点击item的背景和字体颜色
    for (var account = 0; account < mealList.length; account++) {
      mealList[account].mealChoosed = false;
    }
    mealList[index].mealChoosed = true;
    //判断套餐和类型是否都选择，切换确定按钮的背景以及字体颜色
    var bgFlag = false;
    for (var account = 0; account < categoryList.length; account++) {
      if (categoryList[account].cateChoosed) {
        bgFlag = true;
        confirmFlag = true;
        break;
      }
    }
    if (bgFlag) {
      this.setData({
        bgColor: '#FF4500',
        tvColor: '#FFFFFF'
      });
    } else {
      this.setData({
        bgColor: '#F6F6F6',
        tvColor: '#000000'
      });
    }
    this.setData({
      mealList: mealList,
      confirmFlag: confirmFlag
    })
  },
  /**
   * 商品数量加法
   */
  add: function() {
    var wineNumber = this.data.wineNumber * 1 + 1;
    //如果当前数字是1，则加1以后把减号图片切换为黑色
    if (wineNumber > 1) {
      this.setData({
        subsImg: '../../resource/image/sub_black.png',
        wineNumber: wineNumber
      })
    }
  },
  /**
   * 购物车商品数量加
   */
  carAdd: function(e) {
    var thisData = e.currentTarget.dataset.item;
    var thisNumber = thisData.number * 1 + 1;
    var index = e.currentTarget.dataset.index;
    var carData = this.data.carData;
    var totalNumber = 0;
    var totalSum = 0;
    //如果当前数字是1，则加1以后把减号图片切换为黑色
    if (thisNumber == 2) {
      carData[index].img = '../../resource/image/sub_black.png';
    }
    carData[index].number = thisNumber
    //刷新全选数字和商品总额
    for (var numbers = 0; numbers < carData.length; numbers++) {
      if (carData[numbers].checked) {
        totalNumber++;
        totalSum += carData[numbers].number * carData[numbers].price
      }
    }
    this.setData({
      carData: carData,
      totalNumber: totalNumber,
      totalSum: totalSum
    });
    //将修改的数据更新到数据库
    updateCarNumber(this, thisData.id, thisNumber);
  },
  /**
   * 商品数量减
   */
  subs: function() {
    var wineNumber = this.data.wineNumber * 1 - 1;
    //如果数字为1，则图片替换为灰色，并且点击没反应
    if (wineNumber == 0) {
      return;
    } else if (wineNumber == 1) {
      this.setData({
        subsImg: '../../resource/image/sub_grey.png',
        wineNumber: wineNumber
      })
      return;
    } else {
      this.setData({
        wineNumber: wineNumber
      })
    }
  },
  /**
   * 购物车商品数量减
   */
  carSubs: function(e) {
    var thisData = e.currentTarget.dataset.item;
    var thisNumber = thisData.number * 1 - 1;
    var index = e.currentTarget.dataset.index;
    var carData = this.data.carData;
    var totalNumber = 0;
    var totalSum = 0;
    //如果数字为1，则图片替换为灰色，并且点击没反应
    if (thisNumber == 0) {
      return;
    } else if (thisNumber == 1) {
      carData[index].img = '../../resource/image/sub_grey.png';
      carData[index].number = thisNumber
    } else {
      carData[index].number = thisNumber
    }
    //刷新全选数字和商品总额
    for (var numbers = 0; numbers < carData.length; numbers++) {
      if (carData[numbers].checked) {
        totalNumber++;
        totalSum += carData[numbers].number * carData[numbers].price
      }
    }
    this.setData({
      carData: carData,
      totalNumber: totalNumber,
      totalSum: totalSum
    });
    //将修改的数据更新到数据库
    updateCarNumber(this, thisData.id, thisNumber);
  },
  /**
   * 编辑购物车商品数量
   */
  editCarNumber: function(e) {
    var carData = this.data.carData;
    var index = e.currentTarget.dataset.index;
    let wineNumber = e.detail.value;
    let id = e.currentTarget.dataset.id;
    //判断商品数量
    if (wineNumber * 1 < 1) {
      wx.showToast({
        title: '数量不能小于1',
      })
      carData[index].number = carData[index].number;
      this.setData({
        carData: carData
      });
      return;
    } else if (wineNumber == 1) {
      carData[index].img = '../../resource/image/sub_black.png';
    }
    carData[index].number = wineNumber;
    //刷新全选数字和商品总额
    for (var numbers = 0; numbers < carData.length; numbers++) {
      if (carData[numbers].checked) {
        totalNumber++;
        totalSum += carData[numbers].number * carData[numbers].price
      }
    }
    this.setData({
      carData: carData,
      totalNumber: totalNumber,
      totalSum: totalSum
    });
    //将修改的数据更新到数据库
    updateCarNumber(this, id, wineNumber);
  },
  /**
   * 编辑商品数量
   */
  editNumber: function(e) {
    var wineNumber = e.detail.value;
    if (wineNumber < 1) {
      wx.showToast({
        title: '数量必须大于0',
      })
      this.setData({
        wineNumber: 1
      })
      return;
    }
    this.setData({
      wineNumber: wineNumber
    })
  },
  /**
   * 删除购物车商品
   */
  deleteById: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定将该商品移除购物车吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
          })
          //删除商品
          app.request({
            url: '/shoppingcar/deleteEntityByid.do?id=' + id,
            success: function (res) {
              wx.showToast({
                title: '删除成功',
              })
              wx.hideLoading();
              queryCarData(that);
              that.setData({
                carDialogShow: !that.data.carDialogShow, //显示对话框
                proInfoWindow: false, //底层页面不能滚动
              });
            },
            error: function (err) {
              wx.hideLoading();
            }
          });
        }
      }
    })
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
    var totalNumber = 0;
    var totalSum = 0;
    var calaBgColor = '#FF4500';
    var calaTvColor = '#FFFFFF';
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
          calaBgColor = '#FF4500';
          calaTvColor = '#FFFFFF';
          break;
        } else {
          calaBgColor = '#DDDDDD';
          calaTvColor = '#222222';
        }
      }

    }
    //置换当前选中状态
    carData[index].checked = !carData[index].checked;

    //刷新全选数字和商品总额
    for (var numbers = 0; numbers < carData.length; numbers++) {
      if (carData[numbers].checked) {
        totalNumber++;
        totalSum += carData[numbers].number * carData[numbers].price
      }
    }
    this.setData({
      carData: carData,
      totalChoose: newTotalChoose,
      totalNumber: totalNumber,
      totalSum: totalSum,
      calaBgColor: calaBgColor,
      calaTvColor: calaTvColor
    });
  },
  /**
   * 全选
   */
  totalChoose: function() {
    var carData = this.data.carData;
    var totalChoose = this.data.totalChoose;
    var totalNumber = 0;
    var totalSum = 0;
    var calaBgColor = '#FF4500';
    var calaTvColor = '#FFFFFF';
    //切换全选按钮时，同时置换每个单选按钮为相应状态
    for (var account = 0; account < carData.length; account++) {
      carData[account].checked = !totalChoose;
      totalNumber++;
      totalSum += carData[account].number * carData[account].price;
    }
    if (totalChoose) {
      totalNumber = 0;
      totalSum = 0.00;
      calaBgColor = '#DDDDDD';
      calaTvColor = '#222222';
    }
    this.setData({
      totalChoose: !totalChoose,
      carData: carData,
      totalNumber: totalNumber,
      totalSum: totalSum,
      calaBgColor: calaBgColor,
      calaTvColor: calaTvColor
    });
  },
  /**
   * 关闭对话框
   */
  closeDialog: function() {
    this.setData({
      showDialog: !this.data.showDialog,
      proInfoWindow: false
    })
  },
  /**
   * 关闭购物车对话框
   */
  closeCarDialog: function() {
    this.setData({
      carDialogShow: !this.data.carDialogShow,
      proInfoWindow: false
    })
  },
  /**
   * 选择优惠券
   */
  chooseCoupons: function() {
    wx.navigateTo({
      url: '../coupons/couponsList',
    })
  },
  /**
   * 选择优惠券
   */
  confirmCala: function() {
    var carData = this.data.carData;
    var newCarData = [];
    for (var account = 0; account < carData.length; account++) {
      if (carData[account].checked) {
        newCarData.push(carData[account]);
      }
    }
    wx.navigateTo({
      url: '../order/order?carData=' + JSON.stringify(newCarData),
    })
  },
  /**
   * 添加商品到购物车
   */
  confirm: function() {
    var that = this;
    var wineNumber = that.data.wineNumber;
    var wineId = that.data.wineId;
    if (!that.data.confirmFlag) {
      return;
    }
    //显示加载框
    wx.showLoading({
      title: '加载中',
    })
    //根据wineId查询
    app.request({
      url: '/shoppingcar/queryList.do',
      method: 'POST',
      data: {
        wineId: wineId,
        createUser: app.globalData.userInfo.userId
      },
      success: function(res) {
        //判断购物车中该商品是否存在
        if (res.data.length > 0) {
          //更新购物车商品数量
          updateShoppincar(that, res.data[0].id, wineNumber);
        } else {
          //添加商品到购物车
          addCar(that, app.globalData.userInfo.userId, wineId, wineNumber)
        }
      },
      error: function(err) {
        //隐藏加载框
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常'
        })
      }
    });
  },
  /**
   * 立即购买
   */
  immediateBuy: function() {
    var productInfo = this.data.productInfo;
    var carData = [];
    var wineNumber = 1;
    var orderData = {
      id: productInfo.id,
      address: productInfo.address,
      name: productInfo.name,
      category_name: productInfo.categoryName,
      collection_year: productInfo.collectionYear,
      volume: productInfo.volume,
      alcoholPercision: productInfo.alcohol_percision,
      price: productInfo.price,
      unit: productInfo.unit,
      number: wineNumber,
      promotion_name: productInfo.promotionName,
      photo_url: productInfo.photoUrl
    };
    carData.push(orderData);
    wx.navigateTo({
      url: '../order/order?carData=' + JSON.stringify(carData),
    })
  }
});
/**
 * 获取商品详情
 */
function getProduct(that) {
  var id = that.data.wineId;
  app.request({
    url: '/wine/findEntityById.do',
    method: 'GET',
    data: {
      id: id
    },
    success: function(res) {
      var imgs = res.data.photoArr.split(",");
      var imgArr = [];
      for (var account = 0; account < imgs.length; account++) {
        imgArr[account] = 'http://66.112.218.52/wine/' + imgs[account]
      }
      that.setData({
        productInfo: res.data,
        imgUrls: imgArr,
        categoryName: res.data.categoryName
      })
    }
  });
}
/**
 * 初始化
 */
function init(that) {
  var categoryList = [{
      name: '酱香型',
      cateChoosed: false
    },
    {
      name: '浓香型',
      cateChoosed: false
    }
  ];
  var mealList = [{
      name: '一瓶装，送小酒杯',
      mealChoosed: false
    },
    {
      name: '两瓶装',
      mealChoosed: false
    },
    {
      name: '三瓶装，每瓶原价88折',
      mealChoosed: false
    }
  ];
  that.setData({
    categoryList: categoryList,
    mealList: mealList
  })
}
/**
 * 获取购物车数据
 */
function queryCarData(that) {
  app.request({
    url: '/shoppingcar/queryListShoppingCar.do',
    method: 'POST',
    data: {
      userId: app.globalData.userInfo.userId
    },
    success: function(res) {
      wx.hideLoading();
      var carData = res.data;
      var shoppingcarNumber = carData.length;
      var hideNumberFlag = false;
      var carHeight = shoppingcarNumber * 230;
      var totalSum = 0;
      var totalNumber = 0;
      if (shoppingcarNumber == 0) {
        hideNumberFlag = true;
      }
      if (carHeight > 700) {
        carHeight = 690 + 'rpx';
      } else {
        carHeight += 'rpx'
      }
      //为全选，商品总额赋值
      for (var acounter = 0; acounter < shoppingcarNumber; acounter++) {
        carData[acounter].checked = true;
        totalNumber++;
        totalSum += carData[acounter].number * carData[acounter].price
        if (carData[acounter].number == 1) {
          carData[acounter].img = '../../resource/image/sub_grey.png'
        } else {
          carData[acounter].img = '../../resource/image/sub_black.png'
        }
      }
      that.setData({
        carData: carData, //购物火车数据
        carHeight: carHeight,
        shoppingcarNumber: shoppingcarNumber,
        hideNumberFlag: hideNumberFlag,
        totalNumber: totalNumber,
        totalSum: totalSum
      });
    },
    error: function(err) {
      wx.hideLoading();
    }
  });
}
/**
 * 更新购物车商品数量
 */
function updateCarNumber(that, id, numbers) {
  app.request({
    url: '/shoppingcar/updateNumber.do?id=' + id + '&number=' + numbers,
    success: function(res) {},
    fail: function(res) {}
  })
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
      wx.hideLoading();
      queryCarData(that);
      that.setData({
        showDialog: !that.data.showDialog, //显示对话框
        proInfoWindow: false, //底层页面不能滚动
      });
      wx.showToast({
        title: '已加入购物车'
      })
    },
    error: function(err) {
      wx.hideLoading();
      wx.showToast({
        title: '服务器异常'
      })
    }
  });

}

/**
 * 添加商品到购物车
 */
function addCar(that, userId, wineId, numbers) {
  app.request({
    url: '/shoppingcar/saveEntity.do',
    method: 'POST',
    data: {
      createUser: userId,
      wineId: wineId,
      number: numbers
    },
    success: function(res) {
      wx.hideLoading();
      queryCarData(that);
      that.setData({
        carDialogShow: !that.data.carDialogShow, //显示对话框
        proInfoWindow: false, //底层页面不能滚动
      });
      wx.showToast({
        title: '已加入购物车'
      })
    },
    error: function(err) {
      wx.hideLoading();
      wx.showToast({
        title: '服务器异常'
      })
    }
  });
}