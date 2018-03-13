import Util from '../../util/Util.js';
const util = new Util()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    id: 0, page: 1
  },
  //初始化数据
  init: function (status) {
    let key = wx.getStorageSync("token")
    util.request({ url: "/getorderlist?key=" + key + "&page=" + this.data.page, data: { status: status }, method: "POST" }).then(res => {
      let data = res.data.data
      if (typeof (data) == "undefined") {
        //没有数据
        this.setData({
          id: status
        })
        return
      }
      //有数据
      let index = 0
      for (index; index < data.length; index++) {
        data[index].orderdetails[0].title = util.tolength(data[index].orderdetails[0].title, 15) + "等共" + data[index].orderdetails.length + "件"
      }
      this.setData({
        order: data,
        id: status
      })
    })
  },
  //刷新
  lower: function () {
    let page = this.data.page + 1
    this.setData({ page })
    let key = wx.getStorageSync("token")
    util.request({ url: "/getorderlist?key=" + key + "&page=" + page, data: { status: this.data.id }, method: "POST" }).then(res => {
      if (typeof (res.data.data) == "undefined") {
        //没有数据了
        return
      }
      let data = res.data.data, index = 0
      for (index; index < data.length; index++) {
        data[index].orderdetails[0].title = util.tolength(data[index].orderdetails[0].title, 15) + "等共" + data[index].orderdetails.length + "件"
      }
      this.data.order.push(...data)
      let order = this.data.order
      this.setData({
        order
      })
    })
  },
  //切换
  gotoorderlist: function (e) {
    let status = e.currentTarget.dataset.status
    this.setData({
      order: []
    })
    this.init(status)
  },
  //跳转首页
  gotoindex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  //去往订单详情
  gotoorderdetail: function (e) {
    let orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../order/order?orderid=' + orderid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let status = options.status
    this.init(status)
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