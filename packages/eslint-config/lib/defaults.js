module.exports = {
  rules: {
    // ============import插件=============
    'import/named': 0, // 允许使用 import { XType } from X 导出类型
    'import/no-unresolved': 0, // 使用 alias，关闭
    'import/order': 1, // import 引入按照一定顺序

    // ============promise插件=============
    'promise/always-return': 0, // promise.then 必须 return
    'promise/catch-or-return': 0, // promise 必须使用 catch
    'promise/no-callback-in-promise': 0, // promise.then 中禁止使用回调函数
    'promise/no-return-wrap': 1, // 避免在不需要时将值包在 Promise.resolve 或 Promise.reject 中
  },
}
