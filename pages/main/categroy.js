var app = getApp();
Page({
  data: {
    scrollTop: 0, //用作跳转后右侧视图回到顶部
    navLeftItems: [], //左侧导航栏内容
    navRightItems: [], //右侧数据
    curNav: 1,
    curIndex: 0,
    testData: [], //测试数据
  },

  onLoad: function(options) {
    this.getDataList();
    getProducts(this, this.data.curNav);
  },
  //事件处理函数
  switchRightTab: function(e) {
    // 获取item项的id，和数组的下标值
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index
    this.setData({
      curNav: id,
      curIndex: index,
      scrollTop: 0
    })
    getProducts(this, id);
  },
  /**
   * 查询类型列表
   */
  getDataList: function() {
    var that = this;
    app.request({
      url: '/category/queryList.do',
      method: 'POST',
      success: function(res) {
        that.setData({
          navLeftItems: res.data
        });
      }
    });
  },
  /**
   * 商品详情
   */
  productionInfo: function(e) {
    var wineId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'productInfo?id=' + wineId,
    })
  }
})

/**
 * 获取商品数据
 */
function getProducts(that, categoryId) {
  wx.showLoading({
    title: '加载中',
  })
  app.request({
    url: '/wine/queryPage.do',
    method: 'POST',
    data: {
      categroyId: categoryId,
      page: 0,
      rows: 20
    },
    success: function(res) {
      // console.log(res);
      that.setData({
        navRightItems: res.data.data
      });
      wx.hideLoading();
    //  init(that, res.data.data);
    },
    fail:function(err){
      wx.hideLoading();
    }
  });
}

function init(that, navRightItems) {
  var testData = [
    {
    name: '商城主打酒',
      wineDate: [
      navRightItems[0],
      navRightItems[1],
      navRightItems[0],
      navRightItems[1],
      navRightItems[0],
      navRightItems[1],
      navRightItems[0]
    ]
  },
  {
    name: '备受欢迎',
    wineDate: [
      navRightItems[0],
      navRightItems[1],
      navRightItems[0],
      navRightItems[1]
    ]
  },
  {
    name: '茅台旗下酒',
    wineDate: [
      navRightItems[0],
      navRightItems[1],
      navRightItems[0],
      navRightItems[1],
      navRightItems[0],
      navRightItems[1],
      navRightItems[0],
      navRightItems[1],
      navRightItems[0]
    ]
  }
  ];
  that.setData({
    testData: testData
  })
}