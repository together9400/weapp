import Util from '../../util/Util.js';
const util = new Util()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: [],//分类
    products: [],//所有商品
    citems: []//当前类目的商品
  },
  //初始化分类信息
  init: function () {
    //拿到所有的product,遍历分类信息
    let products = wx.getStorageSync("products"), category = [], product, temp = []
    products.forEach((product, i) => {
      let name = product.category.categoryname
      //判断category数组中是否有当前的分类,去重
      if (temp.indexOf(name) >= 0) {
        //重复
      } else {
        temp.push(name)
        category.push({ name: name, class: '' })
      }
    })
    this.setData({ products })
    category[0].class = "active"
    this.setData({
      category
    })
    //初始化产品信息,获取第一个分类的产品信息
    this.getProducts(products, 0)
  },
  //跳转到微信详情页
  gotodetail: function (event) {
    //商品id
    let id = event.currentTarget.dataset.index
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },
  //获取第i个分类的产品信息
  getProducts(products, i) {
    let name = this.data.category[i].name, citems = []
    for (let product of products) {
      if (product.category.categoryname === name) {
        product.title = util.tolength(product.title, 15)
        citems.push(product)
      }
    }
    this.setData({ citems })
  },
  //点击分类切换
  clickcategory: function (event) {
    let category = this.data.category
    let id = event.currentTarget.dataset.index, i = 0
    for (i; i < category.length; i++) {
      if (i === id) {
        category[i].class = 'active'
        //设置当前点击类目的citems(商品)
        this.getProducts(this.data.products, i)
      } else {
        category[i].class = ""
      }
    }
    this.setData({
      category
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
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