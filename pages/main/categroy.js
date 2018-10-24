var app = getApp();
Page({
  data: {
    scrollTop: 0, //用作跳转后右侧视图回到顶部
    navLeftItems: [], //左侧导航栏内容
    navRightItems: [], //右侧数据
    curNav: 1,
    curIndex: 0 
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
   * 添加商品到购物车
   */
  addToCar: function(e) {
    var currentData = e.currentTarget.dataset.item;
    //显示加载框
    wx.showLoading({
      title: '加载中',
    })
    //根据wineId查询
    app.request({
      url: '/shoppingcar/queryList.do',
      method: 'POST',
      data: {
        wineId: currentData.id,
        createUser: app.globalData.userInfo.userId
      },
      success: function(res) {
        var wineNumber = 1;
        if (res.data.length>0) {
          wineNumber = (res.data[0].number)*1+1;
          updateShoppincar(res.data[0].id, wineNumber);
        }else{
          addCar(app.globalData.userInfo.userId, currentData.id, wineNumber)
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
  productionInfo:function(e){
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
  app.request({
    url: '/wine/queryPage.do',
    method: 'POST',
    data: { 
      categroyId: categoryId,
      page:0,
      rows:20
    },
    success: function(res) {
      console.log(res);
      that.setData({
        navRightItems: res.data.data
      });
    }
  });
}

/**
 * 更新购物车数据
 */
function updateShoppincar(id,numbers){
  app.request({
    url: '/shoppingcar/updateNumber.do',
    method: 'POST',
    data: {
      id:id,
      number:numbers
    },
    success: function (res) {
      wx.hideLoading();
      wx.showToast({
        title: '已加入购物车'
      })
    },
    error:function(err){
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
function addCar(userId,wineId,numbers){
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

