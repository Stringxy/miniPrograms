var func = require("../functions.js");

//获取应用实例
var app = getApp()
Page({
  data: {
    topic: {},
    author: {},
    userInfo: {},
    hidden: true,
    nocancel: false,
    newComment: '',
    comment: {}
  },
  //点击添加评论
  bindAddButton: function () {
    var that = this
    //更新数据
    that.setData({
      hidden: false
    })
  },
  cancel: function () {
    var that = this
    //更新数据
    that.setData({
      hidden: true
    })
  },
  bindInput: function (e) {
    var that = this
    that.setData({
      newComment: e.detail.value
    })
  },
  preImg: function (e) {
    console.info(e);
    var src = e.target.dataset.src;//获取data-src
    //图片数组暂时只有一张
    var list= [ ]
    list[0]=src
    console.info('llll',list)
    wx.previewImage({
      current: src,
      urls: list
    })
  },
  confirm: function () {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      console.info('tijiaopinglun', userInfo)
      userInfo=wx.getStorageSync('weixinUser');
    }
    console.info('tijiaopinglun',userInfo)
    var content = that.data.newComment;
    if(content.length<5){
      wx.showModal({
        title: "提示",
        content: "评论至少大于5个字，拒绝灌水～",
        showCancel: false
      })
      return;
    }
    var topicid = that.data.topic.topicid
    wx.request({
      url: app.globalData.domain + '/comment/add',
      data:
      {
        title: that.data.title,
        content: content,
        topicid: topicid,
        openid: wx.getStorageSync('openid'),
        nick_name: userInfo.nickName,
        avatar: userInfo.avatarUrl,
        userid: userInfo.id
      },
      method: 'POST',
      success: function (data) {
        var data = data.data;
        console.info('datadatadata', data)
        if (data.result == 200) {
          wx.showToast({
            title: data.resultNote,
            icon: 'success',
            success: function (res) {
              setTimeout(function () {
                func.getTopic.call(that, topicid);
              }, 1000);
              that.setData({
                hidden: true
              })
            }
          });

        } else {
          wx.showModal({
            title: "提示",
            content: data.resultNote,
            showCancel: false
          })
        }
      }
    });
  },
  onLoad: function (options) {
    var that = this;
    wx.showToast({
      title: "loading",
      icon: 'loading',
      duration: 1200
    });
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    //ajax根据id拉取话题内容
    func.getTopic.call(this, options.id);
  },
  onShareAppMessage: function () {
    return {
      title: '我在软考助手当学霸',
      desc: '好好学习，天天向上!'
    }
  }
})
