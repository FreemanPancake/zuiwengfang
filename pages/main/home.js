var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    interval: 3000,/*间隔时间*/
    duration: 1000,/*动画时间*/
    imgUrls: [],/*轮播图数组*/
    menuData: [], /*图标数组*/
    indicatorDots: true,/*圆点*/
    vertical: false,/*垂直*/
    autoplay: true,/*自动播放*/
    interval: 8000,/*间隔时间*/
    duration: 1600,/*动画时间*/
    searchBarBackground:'#EEE',/*搜索框背景色*/
    searchInputBackground:'#FFF',/*搜索框中input的背景色*/
    categoryData:[],/*分类标题*/
    wineData:[],/*分类商品数据*/
    page :0,/*当前第几页 */
    row:5,/*每页多少行*/
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function () {
    getUserInfos();
    /*初始化*/
    initView(this);
    /*轮播图数据*/
    AdverseData(this);
    /*分类*/
    getCategoryData(this);     
     },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.setData({

      });
  }, 
  onPageScroll: function (e) { // 获取滚动条当前位置
    var topDistance = e.scrollTop;
    if (topDistance > 60){
      this.setData({
        searchBarBackground:'#FFF',
        searchInputBackground:'#EEE'
      });
    }else{
      this.setData({
        searchBarBackground: '#EEE',
        searchInputBackground: '#FFF'
      });
    }
  },
  /**
   * 点击轮播图跳转
   */
  turnout:function(e){
    var categoryId = e.currentTarget.dataset.category;
    console.log('当前点击元素的类别' + categoryId);
  },
  productInfo:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'productInfo?id=' + id,
    })
  }
})
/**
 * 初始化
 */
function initView(that) {
  var menuData = [
    { title: "V活动", url: "../../resource/image/vip.png" },
    { title: "优惠券", url: "../../resource/image/preferential_black.png" },
    { title: "好评", url: "../../resource/image/good_comment_black.png" },
    { title: "团购", url: "../../resource/image/team_black.png" },
    { title: "个人中心", url: "../../resource/image/user_center_black.png" },
  ];
  that.setData({
    menuData: menuData
  });
}
/**
 * 获取轮播图数据
 */
function AdverseData(that){
  app.request({
    url: '/advertise/queryList.do',
    method: 'POST',
    success: function (res) {
      that.setData({
        imgUrls: res.data
      });
    }
  });
}
/**
 * 获取分类
 */
function getCategoryData(that){
  app.request({
    url: '/wine/queryPage.do',
    method: 'POST',
    data:{
      page:that.data.page,
      rows: that.data.row
    },
    success: function (res) {
      that.setData({
        categoryData: res.data.data
      });
    }
  });
}


/**
 * 获取用户信息
 */
function getUserInfos(){
  wx.showLoading({})
  wx.getUserInfo({
    success: function (res) {
      app.request({
        url:'/user/queryList.do',
        data:{
          userName:res.userInfo.nickName
        },
        success:function(res){
          wx.hideLoading();
          app.globalData.userInfo.userId = res.data[0].id;
        },
        error:function(err){
          wx.hideLoading();
        }
      });
    
    },
  })
}


