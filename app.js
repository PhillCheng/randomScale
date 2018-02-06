//app.js
App({
  onLaunch: function () {
    // 友情提示
    wx.showToast({
      title: '打开手机音量，体验更佳',
      icon: 'none',
      duration: 2000
    });
  },
  globalData: {
    userInfo: null
  }
})