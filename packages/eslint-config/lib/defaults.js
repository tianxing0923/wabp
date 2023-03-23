module.exports = {
  rules: {
    // ============import插件=============
    'import/named': 0, // 允许使用import { XType } from X 导出类型
    'import/no-unresolved': 0, // 使用alias，关闭
    'import/order': 1, // import引入按照一定顺序

    // ============promise插件=============
    'promise/always-return': 0, // promise.then必须return
    'promise/catch-or-return': 0, // promise必须使用catch
    'promise/no-callback-in-promise': 0, // promise.then中禁止使用回调函数
    'promise/no-return-wrap': 1, // 避免在不需要时将值包在Promise.resolve或Promise.reject中
  },
}
