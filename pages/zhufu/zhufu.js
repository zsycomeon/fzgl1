var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: false,
    token: "",
    kefu: false,
    musicOn: true,
    btn: true,
    btnstr: "将祝福送给朋友",
    btnshare: "我也要送祝福",
    btnrest: "觉得好就送个红包吧",
    music_url: "",
    background: "",
    avatarUrl: '',
    dd: "none",
    animationData: {},
    userInfo: {},
    gdData: {},
    textColor: "",
    oid: "",
    textId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var TemplateID = options.TemplateID;
    var nickName = options.nickName;
    var avatarUrl = options.avatarUrl;
    var FestivalID = options.FestivalID;
    var shareTo = options.share;
    this.TemplateID = TemplateID;
    this.FestivalID = FestivalID;
    this.shareTo = shareTo;
    if (nickName == "" && avatarUrl == "") {
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo
        })
        this.getConText(TemplateID, shareTo, FestivalID)
      } else {
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo;
            this.setData({
              userInfo: res.userInfo
            })
            this.getConText(TemplateID, shareTo, FestivalID)
          },
          fail: ret => {
            this.setData({
              userInfo: { "nickName": "", "avatarUrl": ""}
            })
            this.getConText(TemplateID, shareTo, "", "", FestivalID);
          }
        })
      }
    }
    wx.request({
      url: app.globalData.apiUrl2 +'t.php',
      method: 'GET',
      success: function (res) {
        if (res) {
          that.setData({ token: res.data.u })
        }
      },
      fail: function () {
        console.log('获取token失败')
      },
      complete: function () {
      }
    })
  },
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',

    })

    this.animation = animation

    // animation.scale(2, 2).rotate(45).step()

    this.setData({
      animationData: animation.export(),
      musicOn: true
    })
    var n = 0;
    //连续动画需要添加定时器,所传参数每次+1就行
    var Interval = "";
    this.Interval = setInterval(function () {
      n = n + 1;
      this.animation.rotate(60 * (n)).step()
      this.setData({
        animationData: this.animation.export()
      })
    }.bind(this), 500);

    if (typeof this.audioCtx != "undefined") {
      this.audioCtx.play();
    }
  },
  onHide: function () {
    clearInterval(this.Interval);
    this.setData({
      animationData: {},
      musicOn: false
    });
  },

  onUnload: function () {
    this.audioCtx.stop();
  },

  music_on: function () {
    if (this.data.musicOn) {
      this.setData({
        musicOn: false
      });
      this.audioCtx.pause()
    } else {
      this.setData({
        musicOn: true
      });
      this.audioCtx.play()
    }
  },

  jump: function () {
    wx.redirectTo({
      url: '/pages/index001/index001'
    })
  },
  submit: function (e) {
    console.log("form", e)
    let that = this;
    let name = "formId";
    let timestamp = Date.parse(new Date())/1000;
    let timeing = wx.getStorageSync(name);
    if (timeing < timestamp - that.data.showTime) {
      var formID = e.detail.formId;
      this.setData({ dd: 'none' });

      // wx.request({
      //   url: app.globalData.apiUrl2 +'save.php',
      //   method: 'POST',
      //   data: {
      //     o: app.globalData.oid,
      //     f: formID,
      //     t: this.data.token,
      //     c: app.globalData.casenum
      //   },
      //   header: {
      //     'content-type': 'application/x-www-form-urlencoded' // 默认值
      //   },
      //   success: function (res) {
      //     if (res) {
      //       console.log(res)
      //     }
      //   },
      //   fail: function () {
      //     console.log("上传失败")
      //   },
      //   complete: function () {

      //   }
      // })
      wx.removeStorageSync(name);
      wx.setStorageSync(name, timestamp);
    }
 
  },
  clickPay: function () {
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: 'pages/apps/largess/detail?accountId=2237838',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  getConText: function (TemplateID, shareTo, FestivalID) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl +'zhufu.php',
      data: {
        TemplateID: TemplateID,
        FestivalID: FestivalID,
        shareTo: shareTo,
        TypeID: app.globalData.casenum
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.isTurn) {
            wx.navigateToMiniProgram({
              appId: res.data.turnData.appId,
              path: res.data.turnData.path,
              extraData: {
                foo: 'bar'
              },
              envVersion: res.data.turnData.version,
              success(rest) {
                // 打开成功
                wx.reLaunch({
                  url: '/pages/index001/index001'
                })
              }
            })
          } else {
            // success
            var share = {};

            var Content = res.data[0].Content;
            var wid = res.data[0].wid;
            var rid = res.data[0].rid;
            var path = "&avatarUrl=&nickName=&share=1";
            res.data.share.path = res.data.share.path + path;
            that.share = res.data.share;
            if (typeof shareTo != "undefined" && res.data.pay == "on") {
              that.setData({
                btn: false
              });
            }
          
          var article = Content.replace(/[\\]/g, "");
          let touxiangpic = "";
          if (wid == 0){
            wid = 200
          }
          if (rid == 1) {
            touxiangpic = '<openll class="arround" style="width: ' + wid + 'rpx; height: ' + wid + 'rpx"></openll>';
          } else {
            touxiangpic = '<openll class="noarround" style="width: ' + wid + 'rpx; height: ' + wid + 'rpx"></openll>';
          }

          article = article.replace(/<img class="\[_avatar\]" title="" alt="demo.jpg" width="147" height="146" \/>/g, touxiangpic);

          article = article.replace(/<img width="161" height="150" title="" class="\[_avatar\]" alt="demo.jpg" \/>/g, touxiangpic);
          article = article.replace(/\[_name\]/g, '<openllname class="hang"></openllname>');
            WxParse.wxParse('article', 'html', article, that, 5);
            that.setData({
              background: res.data[0].Background,
              kefu: res.data.kefu,
              flag: true,
                btnstr: res.data.btnstr,
                btnshare: res.data.btnshare,
                btnrest: res.data.btnrest,
                gdData: res.data.gdData,
                textColor: res.data.textColor,
                textId: res.data.TemplateID,
                showTime: res.data.showTime
              })

            let name = "formId";
            let timestamp = Date.parse(new Date()) / 1000;
            let timeing = wx.getStorageSync(name);
            if (timeing > timestamp - res.data.showTime) {
            //if ( res.data.showTime  > timestamp - res.data.showTime) {
              that.setData({ dd: 'none' });
            } else {
              that.setData({ dd: 'block' });
            }

              that.setLog("readTime");

          if (typeof that.audioCtx == "undefined") {
            that.audioCtx = wx.createInnerAudioContext();
            that.audioCtx.autoplay = true;
            that.audioCtx.src = res.data[0].music_url;
            that.audioCtx.play();
          }

          }
      },
      fail: function () { },
    })
  },

  gdLink: function () {
    var that = this;
    wx.navigateToMiniProgram({
      appId: that.data.gdData.gdAppid,
      path: that.data.gdData.gdPath,
      extraData: {
        foo: 'bar'
      },
      envVersion: "release",
      success(rest) {
        // 打开成功
        wx.reLaunch({
          url: '/pages/index001/index001'
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    this.setLog("likeTime");
    return this.share;
  },
  setLog: function (type) {
    try {
      let that = this;
      let dtime = that.getDayTime();
      let a = (new Date()).toLocaleDateString()//获取当前日期
      a = a.replace(/\//g, '-');//替换2017/05/03 为    2017-05-03
      let nowdate = (new Date(a)) / 1000;//把当前日期变成时间戳
      let time = wx.getStorageSync(type + that.data.textId);
      if (time < dtime) {

        wx.request({
          url: app.globalData.apiUrl + "setLog.php",
          method: "GET",
          data: {
            id: that.data.textId,
            oid: that.data.oid,
            time: nowdate,
            type: type
          },
          success: function (res) {
            // console.log(res.data);
            if (res.data.error == 10000) {
              console.log(res.data.error);
              wx.removeStorageSync(type + that.data.textId);
              wx.setStorageSync(type + that.data.textId, nowdate);
            }
          }
        });
      } else {
        //wx.removeStorageSync(type + that.data.textId);
      }
    } catch (e) { }
  },
  getDayTime: function () {
    let date = new Date()
    let times = date.getTime()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    let dayTime = times - hour * 3600 * 1000 - minute * 60 * 1000 - second * 1000
    return parseInt(dayTime / 1000);

  }
})