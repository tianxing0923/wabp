# @wabp/prettier-config

prettier 统一规范配置

## 安装

```
npm i -D @wabp/prettier-config
```

## 使用

#### 在项目根目录新建 `.prettierrc.json` 文件，并写入下面 👇 代码

```json
"@wabp/prettier-config"
```

#### 如需覆盖部分配置，在项目根目录新建 `.prettierrc.js` 文件，并写入下面 👇 代码

```js
module.exports = {
  ...require('@wabp/prettier-config'),
  semi: true,
}
```
