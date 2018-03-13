import Util from '../../util/Util.js';
const util = new Util()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},  //当前订单号的订单详情
    time: 60//剩余时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderid = options.orderid //订单id
    let key = wx.getStorageSync("token")
    util.request({ url: '/getorder?key=' + key, data: { orderid: orderid }, method: 'POST' }).then(res => {
      ///获取订单详情
      let order = res.data.data, index = 0
      for (index; index < order.orderdetails.length; index++) {
        order.orderdetails[index].title = util.tolength(order.orderdetails[index].title, 15)
      }
      let address = order.province + " " + order.city + " " + order.county + " " + order.detailinfo
      address = util.tolength(address, 28)
      if (order.status == 0) {
        let utime = new Date(order.utime), time = (new Date().getTime() - utime.getTime()) / 60000
        time = parseInt(time)
        this.setData({
          time: 60 - time
        })//定时器
        let timer = setInterval(() => {
          time = (new Date().getTime() - utime.getTime()) / 60000
          time = parseInt(time)
          this.setData({
            time: 60 - time
          })
        }, 6000)
        if (this.data.time == 0) {
          clearInterval(timer)
        }
      }
      this.setData({
        order, address
      })
    })
  },
  //取消订单
  cancelorder: function (e) {
    let orderid = e.currentTarget.dataset.orderid
    let key = wx.getStorageSync("token")
    util.request({ url: "/cancelorder?key=" + key, data: { orderid: orderid }, method: "POST" }).then(res => {
      //刷新页面
      if (res.data.code == 0) {
        wx.redirectTo({
          url: './order?orderid=' + orderid
        })
      }
    })
  },
  //继续支付
  continuepay: function () {
    let cart = this.data.order.orderdetails, key = wx.getStorageSync("token")
    util.request({ url: '/continuepay?key=' + key, data: { cart: JSON.stringify(cart) }, method: "POST" }).then(res => {
      if (res.data.code != 0) {
        wx.showToast({
          title: 'error稍后再试',
          mask: true
        })
        return
      }
      let data = res.data.data
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success: (res) => {
          //支付成功
          wx.showToast({
            title: '支付成功',
            complete: (res) => {
              wx.redirectTo({
                url: './order?orderid=' + data.orderid
              })
            }
          })
        },
        fail: (res) => {
          //支付失败
          wx.showToast({
            title: '未支付',
            complete: (res) => {
              wx.redirectTo({
                url: './order?orderid=' + data.orderid
              })
            }
          })
        }

      })
    })
  },
  //跳转到个人中心
  gotoself: function () {
    wx.switchTab({
      url: '../self/self'
    })
  },
  //确认收货
  confirmrec: function (e) {
    let orderid = e.currentTarget.dataset.orderid, key = wx.getStorageSync("token")
    util.request({ url: "/comfirmrec?key=" + key, data: { orderid: orderid }, method: "POST" }).then(res => {
      //成功,跳转到self界面
      wx.showToast({
        title: '确认收货中',
        icon: 'loading',
        duration: 1800,
        mask: true,
        complete: (res) => {
          setTimeout(() => {
            wx.switchTab({
              url: '../self/self'
            })
          }, 1800)
        }
      })
      return
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})