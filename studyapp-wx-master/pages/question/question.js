var func = require("../functions.js");
// // question.js
let timerCounter = null,
  visitorAnswers = [],
  appData = getApp().globalData,
  common = getApp().common;

Page({
  data: {
    loadingComplete: false,
    Questions: [],
    currentIndex: 0,
    questionButtonText: "下一题",
    remainSeconds: 60,
    rightNum: 0,
    wrongNum: 0,
    examId:0
  },
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '读取中 ...',
      mask: true
    });
    func.getQuestions.call(this, options.id);
    that.setData({
      examId: options.id
    })
    this.countDown();

  },
  countDown() {
    clearInterval(timerCounter);
    this.setData({ remainSeconds: 60 });
    timerCounter = setInterval(() => {
      let remainSeconds = this.data.remainSeconds - 1;
      if (remainSeconds > 0) {
        this.setData({ remainSeconds: remainSeconds });
      } else {
        let index = this.data.currentIndex,
          answer = visitorAnswers[index];
        if (answer === undefined) {
          visitorAnswers[index] = '';
        }
        this.nextQuestion();
      }
    }, 1000);
  },
  nextQuestion() {
    let index = this.data.currentIndex,
      total = this.data.Questions.length - 1,
      rightNum = this.data.rightNum,
      examId=this.data.examId
    //     answer = visitorAnswers[index];
    // if (answer === undefined) {
    //     return wx.showToast({ title: '请选择答案', icon: 'loading' });
    // }
    index++;
    this.countDown();
    console.info('index:', index)
    console.info('total:', total)
    if (index < total) {
      this.setData({
        currentIndex: index
      });
    } else if (index == total) {
      this.setData({
        currentIndex: index,
        questionButtonText: '完 成'
      });
    } else {
      clearInterval(timerCounter);

      wx.navigateTo({
        url: '/pages/result/result?right=' + rightNum + '&examId=' + examId,
      })

    }
  },
  answerSelect(e) {
    console.info('answerSelect', e)
    let quess = this.data.Questions,
      index = this.data.currentIndex,
      wrongNum = this.data.wrongNum,
      rightNum = this.data.rightNum

    if (e.detail.value == quess[index].answer) {
      this.setData({
        wrongNum: wrongNum + 1
      });
    } else {
      this.setData({
        rightNum: rightNum + 1
      });
    }

  },
  navigateBack() {
    wx.navigateBack({ delta: 1 });
  },
  onShareAppMessage() {
    return appData.ShareMessage;
  }
});