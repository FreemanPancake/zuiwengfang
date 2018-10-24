// pages/main/productInfo.js
var app = getApp();
var imageUtil = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
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
    /**购物车数量**/
    wineId: -1, //商品id
    categoryName: '类型名', //类型名
    categoryList: [], //类型数组
    mealList: [], //套餐数组
    wineNumber: 1, //商品数量
    bgColor: '#f6f6f6',//确定按钮的背景颜色
    tvColor: '#000000'//确定按钮的字体颜色
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //初始化
    init(that);
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
    this.setData({
      show: !flag
    });
  },
  /**
   * 添加商品到购物车
   */
  addToCar: function (e) {
    this.setData({
      showDialog: !this.data.showDialog,
    });
  },
  /**
   * 选择类型
   */
  chooseCate: function (e) {
    var categoryList = this.data.categoryList;
    var mealList = this.data.mealList;
    var bgFlag = false;
    var index = e.currentTarget.dataset.index;
    for (var account = 0; account < categoryList.length; account++) {
      categoryList[account].cateChoosed = false;
    }

    categoryList[index].cateChoosed = true;

    for (var account = 0; account < mealList.length; account++) {
      if (mealList[account].mealChoosed) {
        bgFlag = true;
        break;
      }
    }
    if (bgFlag) {
      this.setData({
        bgColor: '#f46467',
        tvColor: '#FFFFFF'
      });
    } else {
      this.setData({
        bgColor: '#f6f6f6',
        tvColor: '#000000'
      });
    }
    this.setData({
      categoryList: categoryList
    })
  },
  /**
   * 套餐选择
   */
  chooseMeal: function (e) {
    var mealList = this.data.mealList;
    var categoryList = this.data.categoryList;
    var index = e.currentTarget.dataset.index;
    for (var account = 0; account < mealList.length; account++) {
      mealList[account].mealChoosed = false;
    }
    mealList[index].mealChoosed = true;
    var bgFlag = false;
    for (var account = 0; account < categoryList.length; account++) {
      if (categoryList[account].cateChoosed) {
        bgFlag = true;
        break;
      }
    }
    if (bgFlag) {
      this.setData({
        bgColor: '#f46467',
        tvColor: '#FFFFFF'
      });
    } else {
      this.setData({
        bgColor: '#f6f6f6',
        tvColor: '#000000'
      });
    }
    this.setData({
      mealList: mealList
    })
  },
  /**
   * 书品数量加法
   */
  add: function () {
    var wineNumber = this.data.wineNumber * 1 + 1;
    this.setData({
      wineNumber: wineNumber
    })
  },
  /**
   * 书品数量减法
   */
  subs: function () {
    var wineNumber = this.data.wineNumber * 1 - 1;
    this.setData({
      wineNumber: wineNumber
    })
  },
  /**
   * 编辑商品数量
   */
  editNumber: function (e) {
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
  }
});
/**
 * 获取商品详情
 */
function getProduct(that, id) {
  app.request({
    url: '/wine/findEntityById.do',
    method: 'GET',
    data: {
      id: id
    },
    success: function (res) {
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
 * 获取购物车商品数量
 */
function getShoppingCarNumber(that) {
  app.request({
    url: '/shoppingcar/queryList.do',
    method: 'POST',
    data: {
      createUser: app.globalData.userInfo.userId
    },
    success: function (res) {
      that.setData({
        shoppingcarNumber: res.data.length
      });
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