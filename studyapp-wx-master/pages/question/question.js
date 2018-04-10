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
    examId: 0,
    selected: false,
    currentRight: ''
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
  preImg: function (e) {
    var src = e.target.dataset.src;//获取data-src
    //图片数组暂时只有一张
    var list = []
    list[0] = src
    //console.info('llll', list)
    wx.previewImage({
      current: src,
      urls: list
    })
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
    this.setData({
      selected: false
    });
    let index = this.data.currentIndex,
      total = this.data.Questions.length - 1,
      rightNum = this.data.rightNum,
      examId = this.data.examId
    //     answer = visitorAnswers[index];
    // if (answer === undefined) {
    //     return wx.showToast({ title: '请选择答案', icon: 'loading' });
    // }
    index++;
    this.countDown();
    // console.info('index:', index)
    // console.info('total:', total)
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
  answerSelect: function (e) {
    let quess = this.data.Questions,
      index = this.data.currentIndex,
      wrongNum = this.data.wrongNum,
      rightNum = this.data.rightNum,
      answer = quess[index].answer,
      quesId = quess[index].id,
      userId = wx.getStorageSync('userInfo').id,
      examId=this.data.examId

      console.info('examId', examId)
    var rightLetter = 'A'
    if (answer == 2) {
      rightLetter = 'B'
    } else if (answer == 3) {
      rightLetter = 'C'
    } else {
      rightLetter = 'D'
    }
    if (e.detail.value != answer) {
      this.setData({
        wrongNum: wrongNum + 1,
        currentRight: '本题的答案为' + rightLetter,
        selected: true
      });
      func.addQuestionRecord(quesId, 0, userId,examId);
    } else {
      this.setData({
        rightNum: rightNum + 1,
        currentRight: '选择正确',
        selected: true
      });
      func.addQuestionRecord(quesId, 1, userId,examId);
    }
  },
  navigateBack() {
    wx.navigateBack({ delta: 1 });
  },
  onShareAppMessage() {
    return appData.ShareMessage;
  }
});


