//app.js
App({
  onLaunch: function () {
    wx.getNetworkType({
      success: function (res) {
        var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
        console.log(networkType)
        if (networkType != "4g" && networkType != "wifi") {
          wx.showToast({
            title: "您的" + networkType + "网络较慢",
            icon: 'loading',
            duration: 10000
          });
        }
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    //console.info('this.globalData.userInfo', this.globalData.userInfo)
    if (this.globalData.userInfo) {
      //console.info('this.globalData.userInfo', this.globalData.userInfo)
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          console.info(res, 'resresres');
          if (res.code) {
            //发起网络请求
            wx.request({
              url: that.globalData.domain + '/user/validate/' + res.code,
              method: 'GET',
              success: function (res) {
                if (res.data.result == 200) {
                  if (res.data.detail.id > 0) {
                    that.globalData.userInfo = res.data.detail;
                    wx.setStorageSync('isLogin', true);
                    wx.setStorageSync('userInfo', res.data.detail)
                    console.info('setuserInfouserInfouserInfo', wx.getStorageSync('userInfo'));
                    typeof cb == "function" && cb(that.globalData.userInfo)
                  } else {
                    var openid = res.data.detail.openid;
                    console.info('setopenid', openid)
                    wx.setStorageSync('isLogin', false);
                    wx.setStorageSync('openid', openid)
                  }
                }

              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
          wx.getUserInfo({
            success: function (info) {
              console.info(info, 'infoinfoinfo');
              wx.setStorageSync('weixinUser', info.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    appid: 'wx1ba013fd2439f3fd',//appid需自己提供，此处的appid我随机编写  
    secret: '15aaff15d06af23af13cad49385d095a',//secret需自己提供，此处的secret我随机编写  
    domain: "https://xyiscoding.top/weixin",//输入你的https地址：如 https://xxx.com
    //TODO：cates这里最好是用接口获取数据，这样能和网站同步
    cates: [
      {
        id: "0",
        name: "全部",
        selected: true
      },
      {
        id: "10",
        name: "软考",
        selected: false
      },
      {
        id: "11",
        name: "Web开发",
        selected: false
      },
      {
        id: "12",
        name: "微信开发",
        selected: false
      },
      {
        id: "13",
        name: "游戏开发",
        selected: false
      },
      {
        id: "14",
        name: "招聘",
        selected: false
      },
      {
        id: "15",
        name: "AI",
        selected: false
      },
      {
        id: "16",
        name: "bug专区",
        selected: false
      }
    ]
  }
})