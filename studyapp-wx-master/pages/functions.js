var app = getApp();
var hostName = app.globalData.domain;
var util = require("../utils/util.js");
var html2json = require("../utils/html2json.js");
var convert = require("../utils/convert.js");

var funcs = {
  //按分类拉取话题列表
  getTopics: function (cate, page) {
    var that = this;
    var page = page || 1;
    // var para={
    //   pageNo: page,
    //   pageSize:10,
    //   cate:cate
    // }; 
    wx.request({
      url: hostName + '/topic/getAll/' + cate + '/' + page + '/' + 10,
      method: 'GET',
      success: function (res) {
        that.setData({
          topics: res.data.result == 200 ? res.data.detail : that.data.topics.concat(res.data.topics),
          page: page,
          loadflag: false
        })
      },
      fail: function (err) {
        console.error("获取话题列表失败");
      }
    });
  },

  //根据id拉取话题内容
  getTopic: function (id) {
    var that = this;
    wx.request({
      url: hostName + '/topic/get/' + id,
      success: function (res) {
        var data = res.data.detail;
        console.info('topic', data)
        data.create_time = util.formatTime(new Date(data.create_time));
        if (typeof data.content == "string") {
          data.content = html2json(convert(data.content));
        }
        var author = {
          name: data.nick_name
        };
        that.setData({
          topic: data,
          author: author,
          comment: data.comment
        })
      },
      fail: function (err) {
        console.error("获取话题失败");
      }
    });
  },

  reLogin: function (msg) {
    wx.showModal({
      title: "提示",
      content: msg,
      success: function (res) {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.navigateTo({
            url: '../user/user'
          })
        }
      }
    })
  },

  //发布、参与的话题
  getTopicsByUserId: function (id, page, etype) {
    var that = this;
    var page = page || 1;
    var url = hostName + '/topic/getCommented/' + id + "/" + page;
    if (etype == "getExamRecord") {
      url = hostName + '/record/get/' + id + "/" + page + "/10";
    } else if (etype == "getWxUserTopics") {
      url = hostName + '/topic/getMine/' + id + "/" + page;
    }

    wx.request({
      url: url,
      method: 'get',
      success: function (res) {
        if (!res.data.result == 200) {
          return funcs.reLogin(res.data.msg);
        }
        if (res.data.detail.length <= 0) {
          return;
        }
        console.info('resresr', res);
        that.setData({
          topics: res.data.detail,
          page: page
        })
      },
      fail: function (err) {
        console.error("获取用户话题列表失败");
      }
    });

  },

  //信息
  getMsgsByUserId: function (openId, page) {
    var that = this;
    var page = page || 1;
    wx.request({
      url: hostName + '/api/v1/getWxUserMsgs/' + openId + "?page=" + page,
      success: function (res) {
        if (res.data.msgs.length <= 0) {
          return;
        }
        that.setData({
          msgs: that.data.msgs.concat(res.data.msgs),
          page: res.data.page
        })
      },
      fail: function (err) {
        console.error("获取用户话题列表失败");
      }
    });
  },

  //格式化内容
  html2text: function (html) {
    return html.replace(/<[a-z]>/gi, "").split(/<\/[a-z]>/gi);
  },
  //根据examid拉取试题内容
  getQuestions: function (id) {
    var that = this;
    wx.request({
      url: hostName + '/question/get/' + id,
      success: function (res) {
        var data = res.data.detail;
        //console.info('ques', data)
        //data.create_time = util.formatTime(new Date(data.create_time));
        // if (typeof data.content == "string") {
        //   data.content = html2json(convert(data.content));
        // }
        that.setData({
          Questions: data
        });
        wx.hideLoading();
      },
      fail: function (err) {
        console.error("获取试题失败");
      }
    });
  }

}


module.exports = funcs;