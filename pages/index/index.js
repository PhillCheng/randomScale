//index.js
//获取应用实例
const app = getApp()

let showTime = 4;
let timer = null;
let randomTime = null;

//播放器上下文
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = false;
innerAudioContext.obeyMuteSwitch = true;
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
});

// 保持屏幕常亮
wx.setKeepScreenOn({
  keepScreenOn: true
})

Page({
  data: {
    speed: null,
    currentScale: 'C',
    buttonState: '开始',
    buttonDisabled: false,
    scaleHidden: true,
    buttonStyle: 'primary',
    isStart: false,
    sevenScale: ['C','D','E','F','G','A','B']
  },
  //速度输入框
  bindSpeedInput: function(e) {
    this.setData({
      speed: e.detail.value
    })
  },
  buttonTap: function(){
    if (this.data.buttonState == '开始'){
      this.startButton();
    }else{
      this.stopButtopn();
    }
  },
  //开始倒计时
  startButton: function() {
    //如果用户没有输入数字，系统默认4秒一次
    let speed = this.data.speed;
    if (speed == null || speed == 0 || speed == undefined){//非空
      this.setData({
        speed: 2
      });
    }else{//格式验证
      //正数
      var reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (! reg.test(speed)) {
        wx.showModal({
          title: '错误',
          content: '速度只能为正数',
          showCancel: false
        });
        return false;
      }
      //大于0.3语音就跟不上了，需要重新制作音频
      if (speed < 0.3){
        wx.showModal({
          title: '错误',
          content: '不好意思，音阶练习不求快，但求准，0.3就是极限了',
          showCancel: false
        });
        return false;
      }
    }
    //按钮置灰
    this.setData({
      buttonState: '准备倒计时',
      buttonDisabled: true,
    });
    //进入倒计时
    timer = setInterval(() => {
      if (showTime == 0){
        clearInterval(timer);
        showTime = 4;
        this.timeEnd();
      }else{
        this.setData({
          buttonState: showTime  + '秒'
        });
        showTime --
      }
    },1000)
  },
  timeEnd:function(){
    this.setData({
      scaleHidden: false,
      buttonState: '停止',
      buttonDisabled: false,
      buttonStyle: 'warn'
    }),
    //时间到了，先随机一次，然后再循环执行随机
    this.startRandom();
    //随机变换
    randomTime = setInterval(() => {
      this.startRandom();
    }, this.data.speed*1000)
  },
  startRandom: function(){
    //随机取值
    let contextText = this.data.sevenScale[this.randomCount()];
    //播放声音
    this.playAudio(contextText);
    //设置文字和呼吸灯样式
    this.setData({
      currentScale: contextText,
      isStart: true
    });
    //把呼吸灯颜色设置回来
    this.setColorBack();
  },
  //设置延时的目的在于，如果实时触发手机端闪烁看不出来，
  //同时按钮闪烁太快,人眼捕获不到
  setColorBack: function(){
    setTimeout(()=>{
      this.setData({
        isStart: false
      });
    },100);
  },
  stopButtopn: function(){
    //删除重复
    clearInterval(randomTime);
    this.setData({
      buttonState: '开始',
      buttonStyle: 'primary'
    })
  },
  //获取0-6的随机数
  randomCount: function(){
    return parseInt(Math.random() * (6 + 1), 10);
  },
  // 去打赏页
  goTip: function(){
    wx.navigateTo({
      url:'../tip/tip'
      });
  },
  // 自动播放
  playAudio: function(fileName){
    innerAudioContext.src = '/audio/' + fileName +'.mp3';
    innerAudioContext.play();
  }

})
