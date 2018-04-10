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
          topics: page == 1 ? res.data.detail : that.data.topics.concat(res.data.detail),
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
  getTopicsByUserId: function (id, page, etype,examid) {
    var that = this;
    var page = page || 1;
    var url = hostName + '/topic/getCommented/' + id + "/" + page;
    if (etype == "getExamRecord") {
      console.info('examidexamidexamid', examid)
      url = hostName + '/record/get/' + id + "/" + page + "/10/" + examid;
    } else if (etype == "getWxUserTopics") {
      url = hostName + '/topic/getMine/' + id + "/" + page;
    }else if(etype=="getWrongRecord"){
      url = hostName + '/userquestion/get/' + id + '/0/' + page + "/10"
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
        console.error("获取数据列表失败");
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
    wx.showToast({
      title: "loading",
      icon: 'loading',
      duration: 1000
    });
    var that = this;
    wx.request({
      url: hostName + '/question/get/' + id+'/'+wx.getStorageSync('userInfo').id,
      success: function (res) {
        var data = res.data.detail;
        for(var i=0;i<data.length;i++){
          var img=data[i].img
          if(img){
            data[i].img=img.split(";")
          }
        }
        that.setData({
          Questions: data
        });
        wx.hideLoading();
      },
      fail: function (err) {
        console.error("获取试题失败");
      }
    });
  },
  addQuestionRecord(quesId, type, userId,examId) {
    wx.request({
      url: app.globalData.domain + '/userquestion/add',
      data:
      {
        userId: userId,
        type: type,
        questionId: quesId,
        examId: examId
      },
      method: 'POST'
    });
  },
  //根据id拉取试题内容
  getQuestion: function (id) {
    var that = this;
    wx.request({
      url: hostName + '/question/getById/' + id,
      success: function (res) {
        var data = res.data.detail;
        var img = data.img
        if (img) {
          data.img = img.split(";")
        }
        console.info('question', data)
        data.create_time = util.formatTime(new Date(data.create_time));
        // if (typeof data.content == "string") {
        //   data.content = html2json(convert(data.title));
        // }

        that.setData({
          question: data,
          //author: author,
          title: data.title
        })
      },
      fail: function (err) {
        console.error("获取试题失败");
      },
      complete: function (res) {
        wx.stopPullDownRefresh();
      }
    });
  },
  //获取试卷
  getExams: function () {
    var that = this;
    wx.request({
      url: hostName + '/exam/get/' + wx.getStorageSync('userInfo').id,
      success: function (res) {
        var data = res.data.detail;
        that.setData({
          exams: data,
        })
      },
      fail: function (err) {
        console.error("获取试卷失败，网络错误");
      }
    });
  }
}


module.exports = funcs;