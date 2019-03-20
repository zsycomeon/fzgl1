const app = getApp();
Component({
  behaviors: [],
  options: {
    multipleSlots: !0
  },
  properties: {},
  data: {
    formIdList: []
  },
  lifetimes: {
    attached: function () { },
    moved: function () { },
    detached: function () { }
  },
  attached: function () { },
  ready: function () { },
  pageLifetimes: {
    show: function () { },
    hide: function () { },
    resize: function () { }
  },
  methods: {
    getFormId: function (t) {
      var o = this;
      console.log(app.globalData.oid);
      wx.request({
        url: app.globalData.apiUrl2 +'save.php',
        method: 'POST',
        data: {
          o: app.globalData.oid,
          f: t.detail.formId,
          t: "1111111",
          c: app.globalData.casenum
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res) {
           console.log("return:" , res)
          }
        },
        fail: function () {
        console.log("上传失败")
        },
        complete: function () {

        }
      })
    }
  }
});