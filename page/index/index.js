import Util from '../../util/Util.js';
const util = new Util()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    products: []//卖家推荐的商品
  },
  //初始化数据,banner ,所有的商品数据
  init: function () {
    util.request({ url: '/initbanner' }).then(res => {
      //返回,banners
      let banners = res.data.data
      this.setData({ banners })
    })
    util.request({ url: '/initproduct' }).then(res => {
      //返回,products(按分类划分),存储进缓存里
      let products = res.data.data, product, tops = []
      wx.setStorageSync("products", products)
      //首页遍历出卖家推荐的商品,istop=0
      for (product of products) {
        //判断istop
        if (product.istop === 0) {
          //处理一下title长度
          product.title = util.tolength(product.title, 8)
          tops.push(product)
        }
      }
      this.setData({
        products: tops
      })
    })
  },
  //跳转到微信详情页
  gotodetail: function (event) {
    //商品id
    let id = event.currentTarget.dataset.index
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()//初始化数据
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