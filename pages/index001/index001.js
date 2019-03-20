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
  onLoad: function (options) {
    let that = this;
    var shareId = options.shareId;
    var TIME = util.formathours(new Date());
    this.setData({
      nowtime: TIME,
    });
    var TemplateID = options.TemplateID;
    var FestivalID = options.FestivalID;
    var sendTime = options.sendTime;
    
    var oid = options.oid;
    var t = options.t;
    var path = "&avatarUrl=" + "" + "&nickName=" + "" + "&share=1";
    if (typeof sendTime != "undefined") {
      this.callbackTemplate(TemplateID, sendTime, oid, t);
      
    }
    if (typeof shareId != "undefined") {
      that.backShare(TemplateID, shareId);
    }
    if (typeof TemplateID != "undefined") {
      wx.navigateTo({
        url: "/pages/zhufu/zhufu?TemplateID=" + TemplateID + "&FestivalID=" + FestivalID + path
      })

    }
  },
  onShow: function () {
    var that = this
    
    wx.request({
      //临时
      url: app.globalData.apiUrl +'test.php',
      //url : "http://192.168.1.62/testReturn.php",
      data: {
        TypeID: app.globalData.casenum
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success
        var data = res.data;
        that.chuliData(data);
        setTimeout(() => {
          that.setData({
            banner: data.banner,
            plate: data.plate,
            flag: true,
            kefu: data.kefu,
            gdData: data.gdData,
            page: 2
          })
        }, 500)
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
  onReachBottom: function () {
    var that = this
    wx.request({
      url: app.globalData.apiUrl +'test.php',
      data: {
        TypeID: app.globalData.casenum,
        page: that.data.page
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success
        var data = res.data;
        if (typeof data.plate != "undefined") {
          that.chuliData(data);
          that.setData({
            plate: that.data.plate.concat(data.plate),
            page: ++that.data.page
          })
        }

      },
      fail: function () { },
    })
  },
  callbackTemplate: function (TemplateID, sendTime, oid, t) {
    try {
      let that = this;
      let dtime = that.getDayTime();
      let a = (new Date()).toLocaleDateString()//获取当前日期
      a = a.replace(/\//g, '-');//替换2017/05/03 为    2017-05-03
      let sd = sendTime.replace(/\//g, '-');
      let sdtime = (new Date(sd)) / 1000;
      let nowdate = (new Date(a)) / 1000;//把当前日期变成时间戳
      let time = wx.getStorageSync("callbackTemplate");
      console.log(TemplateID +"+++"+ nowdate +"+++++"+ sendTime +"++++"+ oid+"+++"+t);
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
          success: function (res) {
            // console.log(res.data);
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
  },
  chuliData: function (data) {
    let that = this;
    let plate = [];
    let fff = "";
    let festt = [];
    for (let i = 0; i < data.plate.length; i++) {
      festt = that.chuliData2(data.plate[i].festival);
      fff = {
        AddDate: data.plate[i].AddDate,
        Name: data.plate[i].Name,
        Orders: data.plate[i].Orders,
        PlateID: data.plate[i].PlateID,
        StartDate: data.plate[i].StartDate,
        StopDate: data.plate[i].StopDate,
        festival: festt
      }
    }
  },
  chuliData2: function (data) {
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
    for (let i = 0; i < data.length; i++) {
      data[i].Name = data[i].Name.replace(/\[_time\]/g, wenhouyu);
      xxx = {
        Cover: data[i].Cover,
        CreateTime: data[i].CreateTime,
        FestivalID: data[i].FestivalID,
        Name: data[i].Name,
        PlateID: data[i].PlateID,
        StartDate: data[i].StartDate,
        StopDate: data[i].StopDate,
        TemplateID: data[i].TemplateID
      }
      plate.push(xxx);
    }
    return plate;
  },
  backShare: function (TemplateID, shareId) {

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