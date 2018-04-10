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
    var userInfo=that.data.userInfo;
    userInfo.openid=wx.getStorageSync('openid')
    //console.info('bindopenid',wx.getStorageSync('openid'))
    //console.info('userr', userInfo)
    var regLowerCase = new RegExp('[a-z]', 'g');
    //console.info('regg', regLowerCase.exec(userInfo.username))
    if (!regLowerCase.exec(userInfo.username)) {
      wx.showModal({
        title: '提示',
        content: '用户名只能为小写英文字母',
      });
      return;
    }
    if (userInfo.username.length < 4 || userInfo.password.length < 6) {
      wx.showModal({
        title: '提示',
        content: '用户名不能小于4位/密码不能小于6位',
      });
      return;
    }
    wx.showToast({
      title: "loading",
      icon: 'loading',
      duration: 2000
    });
    wx.request({
      url: app.globalData.domain + '/user/bindWeixin',
      data:  userInfo ,
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
          wx.reLaunch({ url: '/pages/index/index' });
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
    var userInfo = that.data.userInfo;
    if (userInfo.username.length<4||userInfo.password.length<6){
      wx.showModal({
        title: '提示',
        content: '用户名不能小于4位/密码不能小于6位',
      });
      return;
    }
    var regLowerCase = new RegExp('[a-z]', 'g');
    if (!regLowerCase.exec(userInfo.username)) {
      wx.showModal({
        title: '提示',
        content: '用户名只能为小写英文字母',
      });
      return;
    }
    wx.showToast({
      title: "loading",
      icon: 'loading',
      duration: 2000
    });
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
            content: "注册失败，可能用户名被占用或者网络原因",
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

   // console.log('isLoginisLogin',wx.getStorageSync('isLogin'))
    //console.log('that.data.userInfo',that.data.userInfo)
    //是否登陆过？

      //userInfo
      var userInfo = wx.getStorageSync('weixinUser');
        that.setData({
          userInfo: userInfo
        })

      console.log('that.data.userInfo', that.data.userInfo)
      that.setData({
        showLogin: true
      })
    

    

    //storageSize
    var wxStorage = wx.getStorageInfoSync();
    that.setData({
      storageSize: (wxStorage.currentSize / 1000).toFixed(1),
      storageLimitSize: (wxStorage.limitSize / 1000).toFixed(1)
    })

  }
})