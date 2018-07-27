// pages/settings/settings.js
const app = getApp();
Page({
  data: {
    isChecked: true
  },
  onReady: function(){
    console.log(app);
    this.setData({
      isChecked: app.globalData.openAudio
    })
  },
  //声音切换
  switchChange: function(e){
    app.globalData.openAudio = e.detail.value;
  }
})