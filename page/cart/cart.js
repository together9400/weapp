import Util from "../../util/Util.js";
import Pay from "../../util/Pay.js";
const util = new Util()
const pay = new Pay()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    allselected: true,//全选状态
    totalprice: 0//总价格
  },
  //初始化页面数据
  init: function () {
    let carts = wx.getStorageSync("cart"), cart = [], product, totalprice = 0, allselected = true
    if (carts != "") {
      for (product of carts) {
        //处理一下标题长度,计算总价,全选状态
        product.title = util.tolength(product.title, 16)
        if (!product.selected) {
          allselected = false
        }
        cart.push(product)
      }
      //计算价格
      totalprice = this.countprice()
    }

    this.setData({
      cart, totalprice, allselected
    })
  },
  //计算价格
  countprice: function () {
    let cart = wx.getStorageSync("cart"), totalprice = 0, product
    for (product of cart) {
      if (product.selected) {
        totalprice += product.price * 100 * product.cartcount
      }
    }
    return totalprice / 100
  },
  //全选状态切换,重新计算价格
  allstatus: function () {
    let allselected = this.data.allselected, cart = wx.getStorageSync("cart"), index = 0

    for (index; index < cart.length; index++) {
      cart[index].selected = !allselected
    }
    wx.setStorageSync("cart", cart)
    this.setData({
      allselected: !allselected,
      cart, totalprice: this.countprice()
    })
  },
  //单个条目选择状态的切换
  itemstatus: function (e) {
    let id = e.currentTarget.dataset.id, cart = this.data.cart, index = 0, allselected = true
    //重设cart,重算价格 全选状态
    for (index; index < cart.length; index++) {
      if (cart[index].id == id) {
        cart[index].selected = !cart[index].selected
      }
      //判断全选状态
      if (!cart[index].selected) {
        allselected = false
      }
    }
    wx.setStorageSync("cart", cart)
    this.setData({
      cart, allselected, totalprice: this.countprice()
    })
    //计算价格
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //跳转分类
  gotocategory: function () {
    wx.switchTab({
      url: '../category/category'
    })
  },
  //删除一条,价格和全选状态
  delitem: function (e) {
    let id = e.currentTarget.dataset.id
    let cart = wx.getStorageSync("cart"), index, allselected = true
    for (index = 0; index < cart.length; index++) {
      if (cart[index].id == id) {
        cart.splice(index, 1)
        break
      }
    }
    for (index = 0; index < cart.length; index++) {
      if (!cart[index].selected) {
        allselected = false
        break
      }
    }
    wx.setStorageSync("cart", cart)
    //计算价格和全选状态
    let totalprice = this.countprice()
    this.setData({
      cart, totalprice, allselected
    })
  },
  //添加与减少数量
  add: function (e) {
    let id = e.currentTarget.dataset.id
    //增加数量,  更新当前页面cart与缓存里的cart
    let cart = pay.add(id)
    this.setData({ cart, totalprice: this.countprice() })
  },
  sub: function (e) {
    let id = e.currentTarget.dataset.id
    let cart = pay.sub(id)
    this.setData({ cart, totalprice: this.countprice() })
  },
  //结算
  gotopay: function () {
    let totalprice = this.data.totalprice
    if (totalprice == 0) {
      wx.showToast({
        title: '没有选择商品',
        mask: true
      })
      return
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '../pay/pay'
    })
  },
  //点击主图或者标题跳转详情页
  gotodetail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + id
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
    this.init()
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