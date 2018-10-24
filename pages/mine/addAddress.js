// pages/mine/addAddress.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signList: [], //标签数组
    name: '', //搜获人姓名
    phone: '', //收货人电话
    chooseAddress: '-- 请选择 --', //地址
    addressDetail: '', //详细地址
    signAddShow: false, //添加地址标签
    sign: '', //标签
    onOff: true, //对话框
    inputSign:''//对话框输入内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init();
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
    var addressInfo = this.data.address;
    if (addressInfo) {
      this.setData({
        chooseAddress: addressInfo.province +"  " + addressInfo.city + "  "+addressInfo.district
      });
    }
  },
  /**
   * 选择省份
   */
  chooseProvince: function(e) {
    wx.navigateTo({
      url: '/libs/citySelector/switchcity/switchcity'
    });
  },
  /**
   * 获取用户名
   */
  getName: function(e) {
    this.setData({
      name: e.detail.value
    });
  },
  /**
   * 获取手机号
   */
  getPhone: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  /**
   * 获取详细地址
   */
  getAddressDetail: function(e) {
    this.setData({
      addressDetail: e.detail.value
    });
  },
  /**
   * 选择标签
   */
  chooseSign: function(e) {
    var signList = this.data.signList;
    var index = e.currentTarget.dataset.index;
    //将点击的条目边框和字体切换
    for (var account = 0; account < signList.length; account++) {
      if (account == index) {
        signList[account].choose = !signList[account].choose;
        continue;
      }
      signList[account].choose = false;
    }
    this.setData({
      signList: signList
    });
  },
  /**
   * 保存地址
   */
  confirm: function() {
    var name = this.data.name ;
    var phone = this.data.phone;
    var addressDetail = this.data.addressDetail;
    if (name == "") {
      wx.showToast({
        title: '收货人不能为空',
      })
      return;
    } else if (phone == "") {
      wx.showToast({
        title: '联系方式不能为空',
      })
      return;
    } else if (this.data.chooseAddress == "-- 请选择 --") {
      wx.showToast({
        title: '所在区域不能为空',
      })
      return;
    } else if (addressDetail == ""){
      wx.showToast({
        title: '详细地址不能为空',
      })
      return;
    }
    //保存地址
    saveAddress(this, name, phone, addressDetail, JSON.stringify(this.data.signList));
  },
  /**
   * 添加地址标签
   */
  addSign:function(){
    var onOff = this.data.onOff;
    this.setData({ onOff: !onOff });
  },
  /**
   * 删除标签
   */
  deleteSign:function(e){
    var index = e.currentTarget.dataset.index;
    var signList = this.data.signList;
     signList.splice(index, 1);
     this.setData({signList:signList});
  },
  /**
   * 对话框确认
   */
  modalConfirm:function(){
    if (this.data.inputSign == ""){
      wx.showToast({
        title: '地址标签不为空！'
      })
    } else if (this.data.inputSign.length>6){
      wx.showToast({
        title: '地址标签长度超出！'
      })
    }else{
      this.addSign();
      var signList = this.data.signList;
      for (var account = 0; account < signList.length;account++){
        signList[account].choose = false
      }
      var newSign = {
        name: this.data.inputSign,
        choose:true
      }
      signList[signList.length] = newSign;
      this.setData({signList:signList});
    }
    
  },
  /**
   * 对话框取消
   */
  modalCancel: function () {
    this.addSign();
  },
  /**
   * 对话框输入内容
   */
  getCustomSign:function(e){
    this.setData({ inputSign:e.detail.value});
  },
  /**
   * 初始化
   */
  init: function() {
    var signList = [{
        name: '家',
        choose: false
      },
      {
        name: '学校',
        choose: false
      },
      {
        name: '公司',
        choose: false
      }
    ];
    this.setData({
      signList: signList
    });
  }
})

/**
 * 保存地址
 */
function saveAddress(that, name, phone, addressInfo, signArr){
  wx.showLoading({});
  app.request({
    url:'/address/saveEntity.do',
    data:{
      createUser: app.globalData.userInfo.userId,
      username:name,
      phone:phone,
      province: that.data.address.province,
      city: that.data.address.city,
      eare: that.data.address.district,
      addressInfo: addressInfo,
      sign: signArr
    },
    success:function(res){
      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
      })
      wx.navigateBack({})
    },
    error:function(err){
      wx.hideLoading();
    }
  });
}