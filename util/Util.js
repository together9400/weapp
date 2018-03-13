//工具类
class Util {
  //request请求封装
  request(args) {
    let app = getApp()
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.url + args.url,
        data: args.data,
        method: args.method || 'GET',
        success: (res) => { resolve(res) },
        fail: (res) => { reject(res) }
      })
    })
  }
  //处理一下字符串长度,8个长度
  tolength(text, size) {
    return text.substring(0, size) + "..."
  }
}
export default Util;