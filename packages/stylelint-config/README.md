# @wabp/stylelint-config

stylelint 统一规范配置，集成了 [stylelint-config-standard-scss](https://github.com/stylelint-scss/stylelint-config-standard-scss)、[stylelint-config-recess-order](https://github.com/stormwarning/stylelint-config-recess-order)、[stylelint-scss](https://github.com/stylelint-scss/stylelint-scss)

> **Note**
> Stylelint v15 已经去掉了所有格式化相关的规则，所以无需安装 stylelint-config-prettier 插件

## 安装

```
npm i -D @wabp/stylelint-config
```

## 使用

- 在项目根目录新建 `.stylelintrc.json` 文件，并写入下面 👇 代码

```json
{
  "extends": ["@wabp/stylelint-config"]
}
```

- 或者新建 `.stylelintrc.js` 文件，并写入下面 👇 代码

```js
module.exports = {
  extends: ['@wabp/stylelint-config'],
}
```

## 自动修复

1、打开编辑器设置文件（以 vscode 为例）：

```js
command + P  -->  输入 setting  --> 选择 settings.json 文件
```

2、在文件中添加如下代码并保存：

```js
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  },
  "stylelint.validate": ["css", "less", "scss"]
```

3、修改文件后保存，便会自动修复问题

## 不生效可能原因及解决方法

vscode 扩展 vscode-stylelint >= 14 版本，需要在 首选项->设置->扩展->Stylelint 找到 Validate 选项，添加 scss
