//获取应用实例
var app = getApp()
Page({
  data: {
    cates: app.globalData.cates,
    catesArr: [],
    index: 0,
    userInfo: {},
    title: '',
    content: '',
    logo: '../../images/picture_add.png'
  },
  //栏目
  bindCateChange: function (e) {
    var that = this;
    var index = e.detail.value;
    var datas = e.currentTarget.dataset;
    that.setData({
      index: index,
      cate: that.data.cates[index].id
    });
  },
  //标题
  bindTitleBlur: function (e) {
    var that = this;
    that.setData({
      title: e.detail.value
    })
  },
  //内容
  bindContentBlur: function (e) {
    var that = this;
    that.setData({
      content: e.detail.value
    })
  },
  //发布
  bindPushTap: function () {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var content = that.data.content + "\n发自学霸联盟微信小程序V0.6";
    //console.info("发布发布发布", that.data)
    //"\n发自学霸联盟微信小程序V0.6"
    wx.request({
      url: app.globalData.domain + '/topic/add',
      data:
      {
        title: that.data.title,
        content: content,
        cate: that.data.cate,
        openid: userInfo.openid,
        nick_name: userInfo.nickName,
        avatar: userInfo.avatarUrl
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
                wx.reLaunch({
                  url: "../index/index"
                });
              }, 1000);
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
  onLoad: function () {
    // wx.showLoading({
    //   title: '读取中 ...',
    //   mask: true
    // });
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    //catesArr
    function setCatesArr() {
      var catesArr = [];
      for (var i = 0; i < that.data.cates.length; i++) {
        if (i == 0) {
          catesArr.push("请选择类别");
        } else {
          catesArr.push(that.data.cates[i].name);
        }

      }
      that.setData({
        catesArr: catesArr
      });
    }

    setCatesArr();

  },
  onShow: function () {
    //是否登陆
    if(!wx.getStorageSync('isLogin')){
      wx.showModal({
        title: "请登陆",
        content: "您还没有登陆，请登陆后发布话题",
        showCancel: false,
        success: function(res){
          if(res.confirm){
            wx.navigateTo({
              url: '../reg/reg'
            })
          }
        }
      })
    }
  },
  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseImg(['album'])
          } else if (res.tapIndex == 1) {
            _this.chooseImg(['camera'])
          }
        }
      }
    })

  },
  chooseImg:function(sourceType){
    var that=this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: sourceType,
      success: function (res) {
        console.info(res)
        var tempFilePaths = res.tempFilePaths[0]
        that.setData({
          logo: tempFilePaths
        })
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })  
        wx.uploadFile({
          url: app.globalData.domain + '/topic/upload',
          filePath: tempFilePaths,
          name: 'topic_img',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) { 
            console.info('uploadddd',res) 
          }
        })
      }
    })
  }
})
