var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "flag": false,
    "kefu": false,
    "userInfo": {},
    "banner": {},
    "plate": {},
    "oid": "",
    "page": 1,
    "gdData": {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var shareId = options.shareId;
    var TIME = util.formathours(new Date());
    this.setData({
      nowtime: TIME,
    });
    let that = this;
    wx.request({
      url: 'https://www.51dugou.com/wm/tarOther.php',
      data: {
        musappid: 15
      },
      success: function(res) {
        let zhuanfa = res.data
        app.globalData.zhuanfaData = zhuanfa;
        var TemplateID = options.TemplateID;
        var FestivalID = options.FestivalID;
        var sendTime = options.sendTime;
        
        var oid = options.oid;
        var t = options.t;
        var path = "&avatarUrl=" + "" + "&nickName=" + "" + "&share=1";
        if (typeof sendTime != "undefined") {
          that.callbackTemplate(TemplateID, sendTime, oid, t);
        }
        if (typeof shareId != "undefined") {
          that.backShare(TemplateID, shareId);
        }
        if (typeof TemplateID != "undefined") {

          if (zhuanfa.ist > 0) {
            wx.navigateTo({
              url: "/pages/zhuanfa/index"
            })
          } else {
            wx.navigateTo({
              url: "/pages/zhufu/zhufu?TemplateID=" + TemplateID + "&FestivalID=" + FestivalID + path
            })
          }
        }
      },
      fail: function() {
        var TemplateID = options.TemplateID;
        var FestivalID = options.FestivalID;
        var sendTime = options.sendTime;
        var oid = options.oid;
        var t = options.t;
        var path = "&avatarUrl=" + "" + "&nickName=" + "" + "&share=1";
        if (typeof sendTime != "undefined") {
          that.callbackTemplate(TemplateID, sendTime, oid, t);
        }
        if (typeof shareId != "undefined") {
          that.backShare(TemplateID, shareId);
        }
        if (typeof TemplateID != "undefined") {
          wx.navigateTo({
            url: "/pages/zhufu/zhufu?TemplateID=" + TemplateID + "&FestivalID=" + FestivalID + path
          })
        }
      }
    })
  },
  onShow: function() {
    var that = this
    wx.request({
      //临时
      url: app.globalData.apiUrl + 'remmend.php',
      //url : "http://192.168.1.62/testReturn2.php",
      data: {
        TypeID: app.globalData.casenum
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        // success
        var data = res.data;
        that.chuliData(data);
        // console.log(data);
        setTimeout(() => {
          that.setData({
            plate: data.plate,
            flag: true,
            kefu: data.kefu,
            gdData: data.gdData,
            page: 2
          })
        }, 500)
      },
      fail: function() {},
    })
  },

  jump: function(event) {
    var uri = "/pages/zhufu/zhufu?";
    var str = event.currentTarget.dataset.url;
    // var prf = "&avatarUrl=" + "" + "&nickName=" + "";
    var prf = "&avatarUrl=&nickName=";
    wx.navigateTo({
      url: uri + str + prf
    })
  },
  onReady: function() {

  },
  onReachBottom: function() {
    var that = this
    wx.request({
      url: app.globalData.apiUrl + 'remmend.php',
      data: {
        TypeID: app.globalData.casenum,
        page: that.data.page
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        // success
        var data = res.data;
        console.log(that.data.page);
        if (typeof data.plate != "undefined") {
          that.chuliData(data);
          that.setData({
            plate: that.data.plate.concat(data.plate),
            page: ++that.data.page
          })
        }

      },
      fail: function() {},
    })
  },
  callbackTemplate: function(TemplateID, sendTime, oid, t) {
    try {
      let that = this;
      let dtime = that.getDayTime();
      let a = (new Date()).toLocaleDateString() //获取当前日期
      a = a.replace(/\//g, '-'); //替换2017/05/03 为    2017-05-03
      let sd = sendTime.replace(/\//g, '-');
      let sdtime = (new Date(sd)) / 1000;
      let nowdate = (new Date(a)) / 1000; //把当前日期变成时间戳
      let time = wx.getStorageSync("callbackTemplate");
      console.log(TemplateID + "+++" + nowdate + "+++++" + sendTime + "++++" + oid + "+++" + t);
      if (time < dtime && sdtime == dtime) {
        wx.request({
          url: app.globalData.apiUrl + "setTemplate.php",
          method: "GET",
          data: {
            id: TemplateID,
            time: nowdate,
            type: sendTime,
            oid: oid,
            t: t,
            cid: app.globalData.casenum
          },
          success: function(res) {
            if (res.data.error == 10000) {
              // console.log(res.data.error);
              wx.removeStorageSync("callbackTemplate");
              wx.setStorageSync("callbackTemplate", nowdate);
            }
          }
        });
      } else {
        // console.log(111111);
        //wx.removeStorageSync(type + that.data.textId);
      }
    } catch (e) {}
  },
  getDayTime: function() {
    let date = new Date()
    let times = date.getTime()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    let dayTime = times - hour * 3600 * 1000 - minute * 60 * 1000 - second * 1000
    return parseInt(dayTime / 1000);
  },
  chuliData: function (data) {
    let that = this;
    let dag = that.data.nowtime;
    let wenhouyu = "";
    if (dag >= 4 && dag < 9) {
      wenhouyu = "早上好";
    } else if (dag >= 9 && dag < 11) {
      wenhouyu = "上午好";
    } else if (dag >= 11 && dag < 14) {
      wenhouyu = "中午好";
    } else if (dag >= 14 && dag < 18) {
      wenhouyu = "下午好";
    } else if (dag >= 18 && dag < 24) {
      wenhouyu = "晚上好";
    } else {
      wenhouyu = "早安";
    }
    let plate = [];
    let xxx = "";
    for (let i = 0; i < data.plate.length; i++) {
      data.plate[i].Name = data.plate[i].Name.replace(/\[_time\]/g, wenhouyu);
      xxx = {
        Cover: data.plate[i].Cover,
        CreateTime: data.plate[i].CreateTime,
        FestivalID: data.plate[i].FestivalID,
        Name: data.plate[i].Name,
        PlateID: data.plate[i].PlateID,
        StartDate: data.plate[i].StartDate,
        StopDate: data.plate[i].StopDate,
        TemplateID: data.plate[i].TemplateID
      }
      plate.push(xxx);
    }
  }, backShare: function (TemplateID, shareId) {

    let dtime = this.getDayTime();
    let a = (new Date()).toLocaleDateString()//获取当前日期
    let nowdate = (new Date(a)) / 1000;//把当前日期变成时间戳
    let time = wx.getStorageSync("BACKSHARE_" + shareId);
    //  console.log(dtime + "+++++" + time);
    if (time < dtime) {
      wx.request({
        url: app.globalData.apiUrl_origin + "setShare2.php",
        method: "GET",
        data: {
          id: TemplateID,
          time: nowdate,
          shareId: shareId
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.error == 10000) {
            // console.log(res.data.error);
            wx.removeStorageSync("BACKSHARE_" + shareId);
            wx.setStorageSync("BACKSHARE_" + shareId, nowdate);
          }
        }
      });
    } else {
      // console.log(111111);
      //wx.removeStorageSync(type + that.data.textId);
    }
  },
})