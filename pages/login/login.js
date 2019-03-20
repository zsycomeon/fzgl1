var app = getApp();
Page({
  onLoad: function (options) {
      var that = this;
      var TemplateID = options.TemplateID;
      var nickName = options.nickName;
      var avatarUrl = options.avatarUrl;
      var FestivalID = options.FestivalID;
      var shareTo = options.share;
    if (typeof TemplateID != "undefined") {
      that.parm = {
        "TemplateID": TemplateID,
        "nickName": nickName,
        "avatarUrl": avatarUrl,
        "FestivalID": FestivalID,
        "shareTo": shareTo,
      }
    }
      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
            
                wx.redirectTo({
                  url: "/pages/index001/index001"
                })
              }
            })
          }
        }
      })
    },
    loginUser: function(e) {
     if (typeof this.parm != "undefined") {
       var parm = this.parm;
       var path = "&avatarUrl=" + "" + "&nickName=" + "" + "&share=1";
       wx.redirectTo({
         url: "/pages/index001/index001?TemplateID=" + parm.TemplateID + "&FestivalID=" + parm.FestivalID + path
       })
     }else{
       wx.redirectTo({
         url: "/pages/index001/index001"
       })
     }
     
    }
  
});