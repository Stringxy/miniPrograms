var func = require("../functions.js");
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
    storageLimitSize: 0,
    exams:[]
  },
  //用户名
  bindUserNameBlur: function (e) {
    var that = this;
    that.setData({
      username: e.detail.value
    })
  },
  //密码
  bindPwdBlur: function (e) {
    var that = this;
    that.setData({
      pwd: e.detail.value
    })
  },
  //邮箱
  bindEmailBlur: function (e) {
    var that = this;
    that.setData({
      email: e.detail.value
    })
  },
  //开始软件设计师答题
  bindSoftwareDesignEngineer: function (e) {
    var data = e.currentTarget.dataset;
    console.info('dadaa',data)
    wx.showActionSheet({
      itemList: ['开始测试', '答题记录'],
      success: function (res) {
        var index = res.tapIndex;
        if (index == 0) {
          wx.navigateTo({
            url: '../question/question?id='+data.id
          })
        } else if (index == 1) {
          wx.navigateTo({
            url: '../userTopics/userTopics?userId=' + wx.getStorageSync('userInfo')._id + "&etype=getExamRecord&examid=" + data.id
          })
        }
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //参与的话题
  bindMyReplies: function () {
    wx.navigateTo({
      url: '../userTopics/userTopics?userId=' + wx.getStorageSync('userInfo')._id + "&etype=getWxUserReplies"
    })
  },
  //站内信
  bindMyMsg: function () {
    wx.navigateTo({
      url: '../userMsg/userMsg?userId=' + wx.getStorageSync('userInfo')._id
    })
  },
  //清理缓存
  bindMyStorage: function () {
    var that = this;

    wx.showModal({
      title: "清理缓存",
      content: "确定后应用缓存将被全部清除，清理缓存后需要重新登陆。",
      success: function (res) {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({
            title: '清理成功',
            icon: 'success'
          });
          that.setData({
            showUser: false,
            showLogin: true
          });
        }
      }
    })
  },
  onShow: function () {
    //是否登陆
    if (!wx.getStorageSync('isLogin')||!wx.getStorageSync('userInfo')) {
      wx.showModal({
        title: "请登陆",
        content: "您还没有登陆，请登陆后继续操作",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../reg/reg'
            })
          }
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this;

    //console.log(wx.getStorageSync('isLogin'))
    func.getExams.call(this);

    that.setData({
      showUser: true
    })


    //userInfo

    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })


    //storageSize
    var wxStorage = wx.getStorageInfoSync();
    that.setData({
      storageSize: (wxStorage.currentSize / 1000).toFixed(1),
      storageLimitSize: (wxStorage.limitSize / 1000).toFixed(1)
    })

  }
})
