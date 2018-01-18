// result.js

let appData = getApp().globalData,
  common = getApp().common;
Page({
  data: {
    loadingComplete: false,
    detail: "读取中 ...",
    extra: "读取中 ..."
  },
  onLoad: function (options) {
    let detail = {
      right_number: options.right,
      wrong_number: 10 - options.right,
      user_id: wx.getStorageSync('userInfo').id,
      exam_id: options.examId
    }
    this.setData({
      detail: detail
    })
  },
  onShow() {
    wx.showLoading({
      title: '读取中 ...',
      mask: true
    });
    console.info('resultdetail', this.data.detail)
    if (this.data.detail.right_number > 5) {
      this.setData({
        loadingComplete: true,
        waitingForExchange: true
      });
    } else {
      this.setData({
        loadingComplete: true,
        waitingForExchange: false
      });
    }

    wx.hideLoading();

  },
  goBack() {
    wx.reLaunch({ url: '/pages/index/index' });
  },
  onShareAppMessage: function () {
    return {
      title: '共10题，我答对了' + this.data.detail.right_number + '道!',
      desc: '共10题，我答对了' + this.data.detail.right_number + '道!',
      path:'pages/begin/begin'
    }
  }
});