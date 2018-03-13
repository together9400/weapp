import Util from '../../util/Util.js';
const util = new Util()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products: [],//选中状态要购买的商品
    address: "",
    totalprice: 0
  },
  //初始化数据
  init: function (options) {
    let id = options.id || ""
    if (id != "") {
      //立即购买的用户
      let ps = wx.getStorageSync("products"), p, totalprice
      for (p of ps) {
        if (p.id == id) {
          p.cartcount = 1
          break
        }
      }
      this.setData({
        products: [p], totalprice: p.price
      })
      return
    }
    //获取购物车所有选中状态的商品
    let cart = wx.getStorageSync("cart"), products = [], product, totalprice = 0
    cart.forEach((product) => {
      if (product.selected) {
        product.title = util.tolength(product.title, 15)
        products.push(product)
      }
    })
    for (product of products) {
      totalprice += product.price * 100 * product.cartcount
    }
    totalprice = totalprice / 100
    this.setData({
      products, totalprice
    })
  },
  //添加地址
  addaddress: function () {
    wx.authorize({
      scope: 'scope.address'
    })
    //获取地址
    wx.chooseAddress({
      complete: (res) => {
        //console.log(res)
        this.storeaddress(res)
      }
    })
  },
  //保存地址
  storeaddress: function (res) {
    if (res.errMsg == "chooseAddress:ok") {
      //获取成功
      let address = {}
      address = res
      this.setData({
        address
      })
      //远程数据库更新地址信息
      let key = wx.getStorageSync("token")
      util.request({ url: "/updateaddress?key=" + key, data: { username: res.userName, province: res.provinceName, city: res.cityName, county: res.countyName, detailinfo: res.detailInfo, phone: res.telNumber }, method: 'POST' }).then(res => {
        //无需处理
      })
      return
    } else {
      //重新获取
      wx.showModal({
        title: '请允许获取地址',
        content: '需要您的地址信息',
        showCancel: false,
        confirmText: '确定',
        complete: (res) => {
          wx.openSetting({
            complete: (res) => {
              this.addaddress()
              return
            }
          })
          return
        }
      })
    }
  },
  //支付
  gotopay: function () {
    //提交products参数,预支付
    if (this.data.address == "") {
      wx.showToast({
        title: '请选择地址',
        mask: true
      })
      return
    }
    let products = this.data.products, key = wx.getStorageSync("token"), cart = [], product
    for (product of products) {
      let temp = {}
      temp.id = product.id
      temp.count = product.cartcount
      cart.push(temp)
    }
    util.request({ url: '/prepay?key=' + key, data: { cart: JSON.stringify(cart) }, method: 'POST' }).then(res => {
      if (res.data.code != 0) {
        wx.showToast({
          title: 'error 稍后再试',
          mask: true
        })
        return
      }
      //成功返回预付单信息, 发起支付
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
              //删除购物车数据,页面跳转
              wx.removeStorageSync("cart")
              wx.navigateTo({
                url: '../order/order?orderid=' + data.orderid
              })
            }
          })
        },
        fail: (res) => {
          //支付失败
          wx.showToast({
            title: '未支付',
            complete: (res) => {
              //删除购物车数据 页面跳转
              wx.removeStorageSync("cart")
              wx.navigateTo({
                url: '../order/order?orderid=' + data.orderid
              })
            }
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options)
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