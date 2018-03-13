//商品结算,购物车相关类
class Pay {
  //根据id返回一条商品
  getProduct(id) {
    let product, products = wx.getStorageSync("products")
    for (product of products) {
      if (product.id == id) {
        product.selected = true
        product.cartcount = 0
        break
      }
    }
    return product
  }
  //某个商品加入购物车,购物车存在该商品数量+1,不存在push
  addcart(id) {
    let index = this.isexist(id), cart = wx.getStorageSync("cart") || []
    //判断是否存在该商品
    if (index >= 0) {
      //存在,根据索引位置更新cartcount
      cart[index].selected = true
      cart[index].cartcount += 1
    } else {
      //不存在
      let product = this.getProduct(id)
      product.cartcount = 1
      product.selected = true
      cart.push(product)
    }
    wx.setStorageSync("cart", cart)
  }
  //判断购物车里是否存在某个商品,不存在(-1),存在返回在cart中的索引
  isexist(id) {
    let cart = wx.getStorageSync("cart")
    if (cart == "") {
      return -1
    }
    let index = 0
    for (index; index < cart.length; index++) {
      if (cart[index].id == id) {
        return index
      }
    }
    return -1
  }
  //购物车增加当前商品数量,返回cart
  add(id) {
    let cart = wx.getStorageSync("cart"), index = 0
    for (index; index < cart.length; index++) {
      if (cart[index].id == id) {
        //当前商品,判断数量
        if (cart[index].cartcount >= cart[index].stock) {
          wx.showToast({
            title: '超过库存了',
            duration: 1500,
            mask: true,
            success: (res) => { return cart }
          })
          break
        }
        //增加数量
        cart[index].cartcount += 1
      }
    }
    wx.setStorageSync("cart", cart)
    return cart
  }
  //减少数量
  sub(id) {
    let cart = wx.getStorageSync("cart"), index = 0
    for (index; index < cart.length; index++) {
      if (cart[index].id == id) {
        if (cart[index].cartcount == 1) {
          wx.showToast({
            title: '最少一件',
            duration: 1500,
            mask: true,
            success: (res) => { return cart }
          })
          break
        }
        //减少
        cart[index].cartcount -= 1
      }
    }
    wx.setStorageSync("cart", cart)
    return cart
  }
}
export default Pay;