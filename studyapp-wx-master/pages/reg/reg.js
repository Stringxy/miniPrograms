//获取应用实例
var app = getApp()
Page({
  data: {
    showUser: false,
    showLogin: false,
    showReg: false,
    domain: app.globalData.domain,
    username: "",
    pwd: "",
    email: "",
    userInfo: {},
    storageSize: 0,
    storageLimitSize: 0
  },
  //注册新账号按钮
  bindRegTap: function () {
    var that = this;
    that.setData({
      showReg: true,
      showLogin: false
    })
  },
  //已经有账号？
  bindLoginTap: function () {
    var that = this;
    that.setData({
      showReg: false,
      showLogin: true
    })
  },
  //立即绑定
  //1、获取openId,与登陆账号关联，成功后显示用户中心
  bindUserTap: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/user/bindWeixin',
      data:  that.data.userInfo ,
      method: 'POST',
      success: function (data) {
        var data = data.data;
        if (data.result==200) {
          wx.setStorageSync('isLogin', 'true');
          wx.setStorageSync('userInfo', data.userInfo);
          that.setData({
            showLogin: false,
            showUser: true
          });
          wx.redirectTo({
            url: 'pages/index/index',
          })
        } else {
          wx.showModal({
            title: "提示",
            content: '用户名或密码错误',
            showCancel: false
          })
        }
      }
    });
  },
  //注册账号
  bindRegNewTap: function () {
    var that = this;
    //console.info('userrrr',that.data.userInfo)
    wx.request({
      url: app.globalData.domain + '/user/register',
      data: that.data.userInfo,
      method: 'POST',
      success: function (res) {
        if (res.data.result==200) {
          that.setData({
            showReg: false,
            showLogin: true
          });
          wx.showToast({
            title: '注册成功',
            icon: 'success'
          });
          wx.setStorageSync('isLogin', true)
          wx.redirectTo({
            url: 'pages/index/index',
          })
          //自动绑定微信
          //that.bindUserTap()
        } else {
          wx.showModal({
            title: "提示",
            content: data.msg,
            showCancel: false
          })
        }
      }
    });
  },
  //用户名
  bindUserNameBlur: function (e) {
    var that = this;
    that.data.userInfo.username = e.detail.value
  },
  //密码
  bindPwdBlur: function (e) {
    var that = this;
    that.data.userInfo.password = e.detail.value
  },
  //邮箱
  bindEmailBlur: function (e) {
    var that = this;
    that.data.userInfo.email = e.detail.value
  },
  onLoad: function (options) {
    var that = this;

    console.log(wx.getStorageSync('isLogin'))
    that.data.userInfo = wx.getStorageSync('weixinUser');
    console.log(that.data.userInfo)
    //是否登陆过？
    if (wx.getStorageSync('isLogin') == "true") {
      that.setData({
        showUser: true
      })
    } else {
      that.setData({
        showLogin: true
      })
    }

    //userInfo
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })

    //storageSize
    var wxStorage = wx.getStorageInfoSync();
    that.setData({
      storageSize: (wxStorage.currentSize / 1000).toFixed(1),
      storageLimitSize: (wxStorage.limitSize / 1000).toFixed(1)
    })

  }
})