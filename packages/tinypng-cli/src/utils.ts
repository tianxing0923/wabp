import crypto from 'node:crypto'
import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'
import glob from 'glob'
import minimatch from 'minimatch'
import cosmiconfig from 'cosmiconfig'
import type { Ora } from 'ora'
import chalk from 'chalk'
import tinify from 'tinify'

const cwd = process.cwd()
const extensions = '*.+(png|jpg|jpeg|webp|PNG|JPG|JPEG|WEBP)'
const explorer = cosmiconfig.cosmiconfigSync('tinypng')
const cacheFile = path.resolve(cwd, '.tinypng.cache.json')

export const cyan = chalk.cyan.bold

type ConfigType = {
  key: string
}

type CacheType = {
  [k: string]: string
}

/**
 * 获取配置项
 *
 * @export
 * @returns
 */
export function getConfig(): ConfigType {
  const config = explorer.search()
  if (!config || config.isEmpty) {
    return { key: '' }
  }
  return config.config
}

/**
 * 获取缓存记录
 *
 * @export
 * @returns
 */
export function getCache(): CacheType {
  if (fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
  }
  return {}
}

/**
 * 保存缓存记录
 *
 * @export
 * @param {CacheType} data - 数据
 */
export function saveCache(data: CacheType) {
  const cache = Object.assign({}, getCache(), data)
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, '  '))
}

/**
 * 创建MD4哈希
 *
 * @export
 * @param {(Buffer)} buffer - 文件内容
 * @returns
 */
export function createHash(buffer: Buffer) {
  return crypto.createHash('md4').update(buffer).digest('hex')
}

/**
 * 递归查找图片
 *
 * @export
 * @param {string} dir - 目录or文件
 * @returns
 */
export async function findImages(dir: string) {
  return new Promise<string[]>((resolve, reject) => {
    let images: string[] = []
    try {
      if (fs.lstatSync(dir).isDirectory()) {
        images = images.concat(glob.sync(`${dir}/**/${extensions}`, { matchBase: true }))
      } else if (minimatch(dir, extensions, { matchBase: true })) {
        images.push(dir)
      }
      resolve(images)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 根据图片列表获取哈希Map
 *
 * @export
 * @param {string[]} images - 图片列表
 * @returns
 */
export function getImageHashMap(images: string[]) {
  const hashMap = new Map()
  images.forEach((el) => {
    const buffer = fs.readFileSync(el)
    hashMap.set(el, createHash(buffer))
  })
  return hashMap
}

const options: https.RequestOptions = {
  method: 'POST',
  hostname: 'tinypng.com',
  path: '/web/shrink',
  headers: {
    'Postman-Token': Date.now(),
    accept: '*/*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'cache-control': 'no-cache',
    'content-cype': 'image/png',
    origin: 'https://tinypng.com',
    pragma: 'no-cache',
    referer: 'https://tinypng.com/',
    'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': 'macOS',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  },
}

/**
 * 随机生成IP
 *
 * @export
 * @returns
 */
export function randomIp() {
  return Array.from(Array(4))
    .map(() => Math.floor(Math.random() * 255))
    .join('.')
}

type TinyPNGApiResponse = {
  input: {
    size: number
    type: string
  }
  output: {
    size: number
    type: string
    width: number
    height: number
    ratio: number
    url: string
  }
}

export type CompressResponse = {
  original: number
  compressed: number
  ratio: number
  content: Buffer
}

/**
 * 使用tinify压缩图片
 *
 * @export
 * @param {string} image - 图片
 * @returns
 */
export function tinifyCompress(image: string) {
  const original = fs.readFileSync(image).byteLength
  return new Promise<CompressResponse>((resolve, reject) => {
    tinify.fromFile(image).toFile(image, (err) => {
      if (err) reject(err.message)
      const buffer = fs.readFileSync(image)
      const compressed = buffer.byteLength
      const ratio = compressed / original
      resolve({
        original,
        compressed,
        ratio,
        content: buffer,
      })
    })
  })
}

/**
 * 通过模拟浏览器上传压缩图片
 *
 * @export
 * @param {string} image - 图片
 * @returns
 */
export function fileUpload(image: string) {
  options.headers && (options.headers['x-forwarded-for'] = randomIp())
  return new Promise<CompressResponse>((resolve, reject) => {
    const req = https.request(options, function (res) {
      res.on('data', (res) => {
        const obj = JSON.parse(res.toString())
        if (obj.error) {
          reject(obj.message)
        } else {
          fileDownload(image, obj)
            .then((body) =>
              resolve({
                original: obj.input.size,
                compressed: obj.output.size,
                ratio: obj.output.ratio,
                content: body,
              })
            )
            .catch(reject)
        }
      })
    })

    req.write(fs.readFileSync(image), 'binary')
    req.on('error', reject)
    req.end()
  })
}

/**
 * 下载浏览器上传压缩后的图片
 *
 * @export
 * @param {string} image - 图片
 * @param {TinyPNGApiResponse} obj - 上传压缩成功后返回的数据
 * @returns
 */
export function fileDownload(image: string, obj: TinyPNGApiResponse) {
  const url = new URL(obj.output.url)
  return new Promise<Buffer>((resolve, reject) => {
    const req = https.request(url, (res) => {
      let body = ''
      res.setEncoding('binary')
      res.on('data', function (data) {
        body += data
      })

      res.on('end', function () {
        fs.writeFile(image, body, 'binary', (err) => {
          if (err) return reject(err.message)
          resolve(Buffer.from(body, 'binary'))
        })
      })
    })
    req.on('error', reject)
    req.end()
  })
}

/**
 * 更新Ora文本内容
 *
 * @export
 * @param {Ora} spinner - Ora实例
 * @param {string} text - 文字
 * @param {number} total - 总数
 * @param {number} succeeded - 成功数
 * @param {number} failed - 失败数
 * @param {number} original - 原始图片大小
 * @param {number} compressed - 压缩后图片大小
 */
export function changeSpinnerText(
  spinner: Ora,
  text: string,
  total: number,
  succeeded: number,
  failed: number,
  original: number,
  compressed: number
) {
  const chalkTotal = cyan(total)
  const chalkSucceeded = cyan(succeeded)
  const chalkFailed = cyan(failed)
  const chalkOriginal = cyan((original / 1000).toFixed(1), 'KB')
  const chalkCompressed = cyan((compressed / 1000).toFixed(1), 'KB')
  const chalkRatio = cyan(Math.floor(((original - compressed) / original) * 100) + '%')
  spinner.text = `${text}, 总共: ${chalkTotal}, 成功: ${chalkSucceeded}, 失败: ${chalkFailed}, 共处理: ${chalkOriginal}, 压缩后: ${chalkCompressed}, 优化比例: ${chalkRatio}`
}
