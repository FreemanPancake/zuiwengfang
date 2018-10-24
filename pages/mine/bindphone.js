// pages/mine/bindphone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeText:'获取验证码',
    codeFlag:false,/*是否点击了验证码*/
    codeClass:'',/* 获取验证码验证码class*/
    phone:'',/**输入的手机号 */
    currentTime: 61,//倒计时
    disabled: false,//按钮禁用
    bgColor:'#0ba252',//按钮颜色
    tvColor:'#FFF',//按钮字体颜色
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 获取输入的手机号
   */
  phoneInput:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  /**
   * 获取验证码
   */
  getCode:function(option){
    var that = this;
    that.setData({
      disabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
      color: '#ccc',
    })
    var phone = that.data.phone;
    var currentTime = that.data.currentTime //把手机号跟倒计时值变例成js值

    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空

    if (phone == '') {
      warn = "号码不能为空";
    } else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
      warn = "手机号格式不正确";
    } else {
      //当手机号正确的时候提示用户短信验证码已经发送
      wx.showToast({
        title: '短信验证码已发送',
        icon: 'none',
        duration: 2000
      });

      //设置一分钟的倒计时
      var interval = setInterval(function () {
        currentTime--; //每执行一次让倒计时秒数减一
        that.setData({
          codeText: currentTime + 's', //按钮文字变成倒计时对应秒数

        })
        //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
        if (currentTime <= 0) {
         clearInterval(interval)
          that.setData({
            codeText: '重新发送',
            currentTime: 61,
            disabled: false,
            bgColor: '#0ba252',
            tvColor:'#FFF'

          })
        }
      }, 1000);

    };

    //判断 当提示错误信息文字不为空 即手机号输入有问题时提示用户错误信息 并且提示完之后一定要让按钮为可用状态 因为点击按钮时设置了只要点击了按钮就让按钮禁用的情况
    if (warn != null) {
      wx.showModal({
        title: '提示',
        content: warn
      })

      that.setData({
        disabled: false,
        bgColor: '#0ba252',
        tvColor:'#FFFFFF'
      })
      return;

    };
  } ,
  /**
   * 绑定
   */
  bindPhone:function(){
    wx.navigateBack({
      
    })
  }
})