# @wabp/tinypng-cli

TinyPNG CLI 工具，可使用 Tinify API 和模拟浏览器请求压缩

## 安装

```
  npm install -g @wabp/tinypng-cli
```

## 配置

根据使用方式进行配置

- 在项目根目录新建 `.tinypngrc.json` 文件，配置 Tinify API Key

```json
{
  "key": "Tinify API Key"
}
```

- 直接使用模拟浏览器方式，无需新建配置 `.tinypngrc.json` 文件

## 使用

压缩当前目录下所有图片

```
tinypng .
```

压缩指定目录下所有图片

```
tinypng src
```

压缩指定图片

```
tinypng src/assets/images/test.png
```

**该压缩工具会自动生成 `.tinypng.cache.json` 文件对压缩后的图片记录缓存，如需重新压缩，删除该文件即可**
