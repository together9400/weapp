import Util from '../../util/Util.js';
import Pay from '../../util/Pay.js';
const util = new Util()
const pay = new Pay()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartcount: 0
  },
  //初始化商品详情数据
  init: function (id) {
    //id-->商品id
    let products = wx.getStorageSync("products"), product
    for (product of products) {
      if (id == product.id) {
        product.title = util.tolength(product.title, 20)
        this.setData({
          ...product
        })
        break
      }
    }
  },
  //获取购物车中当前商品的数量,设置给cartcount
  getCartCount(cart, id) {
    let product, cartcount = 0
    if (cart === "") {
      return 0
    }
    for (product of cart) {
      if (product.id == id) {
        //当前商品
        cartcount = product.cartcount
        break
      }
    }
    this.setData({
      cartcount
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options.id)
    //获取购物车数据,购物车里当前商品数量
    let cart = wx.getStorageSync("cart")
    this.getCartCount(cart, options.id)
  },
  //当前商品添加购物车
  addcart: function (e) {
    if (this.data.stock <= 0) {
      wx.showToast({
        title: '库存不足',
        mask: true,
        success: (res) => {
          return
        }
      })
    }
    //判断购物车是否有当前商品, 没有的话push,有的话数量+1
    let id = e.currentTarget.dataset.index
    pay.addcart(id)
    //刷新页面
    wx.showToast({
      title: '加入购物车',
      mask: true,
      complete: res => {
        setTimeout(() => {
          wx.redirectTo({
            url: './detail?id=' + id,
          })
        }, 1500)
      }
    })
  },
  //跳转到购物车
  gotocart: function () {
    wx.switchTab({
      url: '../cart/cart'
    })
  },
  //立即购买
  gotopay: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../pay/pay?id=' + id
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