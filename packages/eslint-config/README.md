# @wabp/eslint-config

eslint 统一规范配置，集成了 [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import)、[eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)、[eslint-plugin-promise](https://github.com/eslint-community/eslint-plugin-promise)、[eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)、[eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)

## 安装

```
npm i -D @wabp/eslint-config
```

## 使用

- React 项目在根目录新建 `.eslintrc.json` 文件，并加入下面 👇 代码

```js
{
  "extends": "@wabp/eslint-config",
}
```

- 单纯 TypeScript 项目在根目录新建 `.eslintrc.json` 文件，并加入下面 👇 代码

```js
{
  "extends": ["@wabp/eslint-config:typescript"],
}
```

## 自动修复

1、打开编辑器设置文件（以 vscode 为例）：

```js
command + P  -->  输入setting  --> 选择 settings.json文件
```

2、在文件中添加如下代码并保存：

```js
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true,
  },
```

3、修改文件后保存，便会自动修复问题
