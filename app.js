import Util from '/util/Util.js';
const util = new Util();
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  //全局url
  url: "http://bootvue.iok.la/weapp",
  onLaunch: function () {
    wx.authorize({
      scope: 'scope.userInfo'
    })
    this.init()
  },
  init: function () {
    //获取用户信息,更新,openid,存储,-->
    wx.login({
      success: (res) => {
        let code = res.code, token
        //请求服务器(code),返回token:key
        util.request({ url: '/token', data: { code: code }, method: 'POST' }).then(res => {
          //请求成功//token要存储
          let key = res.data.data
          wx.setStorageSync("token", key)
          this.getUserInfo(key)
        })
      }
    })
  },
  getUserInfo: function (token) {
    //判断login状态是否过期, 登录态过期的话获取用户信息即使有权限也会失败
    wx.checkSession({
      success: (res) => {
        wx.getUserInfo({
          success: (res) => {
            //获取成功
            this.storeUserInfo(res, token)
          },
          fail: (res) => {
            this.storeUserInfo(res, token)
          }

        })
      },
      fail: (res) => {
        //过期了,重新调用wx.login
        this.init()
      }
    })

  },
  storeUserInfo: function (res, token) {
    res.userInfo = res.userInfo || ""
    if (res.userInfo != "") {
      //存储userInfo
      let userInfo = res.userInfo
      wx.setStorageSync('userInfo', userInfo)
      //,并更新到服务器(要使用到token验证用户身份)
      util.request({ url: "/updateuser", data: { key: token, nickname: userInfo.nickName, avatar: userInfo.avatarUrl }, method: "POST" }).then(res => {
        //一般无需处理
      })
      return
    } else {
      //获取失败,没有用户信息, 弹窗提示, 
      if (res.userInfo == "") {
        wx.showModal({
          title: '请允许获取用户信息',
          content: '小程序运行需要您的头像 昵称信息',
          showCancel: false,
          confirmText: 'OK',
          success: (res) => {
            //打开设置
            wx.openSetting({
              complete: (res) => {
                this.getUserInfo(token)
                return
              }
            })
            return
          }
        })
      }
    }
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
})
