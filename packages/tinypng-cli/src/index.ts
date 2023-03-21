import minimist from 'minimist'
import chalk from 'chalk'
import ora from 'ora'
import tinify from 'tinify'
import {
  changeSpinnerText,
  createHash,
  cyan,
  fileUpload,
  findImages,
  getCache,
  getConfig,
  getImageHashMap,
  saveCache,
  tinifyCompress,
} from './utils'
import type { CompressResponse } from './utils'
import { version } from '../package.json'

const argv = minimist(process.argv.slice(2))
const dir = argv._.length ? argv._[0] : '.'

if (argv.v || argv.version) {
  console.log(version)
} else if (argv.h || argv.help) {
  console.log(`Usage
  tinypng [<path>]

Example
  tinypng .
  tinypng assets/img
  tinypng assets/img/test.png
  tinypng assets/img/test.jpg

Options
  -v, --version    Show installed version
  -h, --help       Show help`)
} else {
  console.log(chalk.green.bold('欢迎使用 @wabp/tinypng-cli'))
  console.log('v' + version)

  const config = getConfig()
  if (!config.key) {
    console.log(chalk.yellow.bold(`没有找到 Tinify API Key 配置, 采用模拟 TinyPNG 官网上传方式进行降级处理`))
    console.log(`如需使用 Tinify API Key 可前往 ${cyan.underline('https://tinypng.com/developers')} 获取\n`)
  } else {
    tinify.key = config.key
    try {
      await tinify.validate()
    } catch (err) {
      console.log(chalk.red(`错误: Tinify API Key 验证失败，请检查配置是否正确 - ${(err as Error).message}`))
      process.exit(1)
    }
  }
  const spinner = ora('正在查找图片...').start()
  const images = await findImages(dir)
  const hashMap = getImageHashMap(images)
  const cache = getCache()

  const uncompresseds = images.filter((el) => !cache[el] || cache[el] !== hashMap.get(el))
  const compressedCount = images.length - uncompresseds.length
  spinner.succeed(
    `共找到 ${cyan(images.length)} 张图片, 其中 ${cyan(compressedCount)} 张图片已压缩, 本次实际压缩图片 ${cyan(
      uncompresseds.length
    )} 张\n`
  )

  if (uncompresseds.length === 0) {
    process.exit()
  }
  const total = uncompresseds.length
  let succeeded = 0
  let failed = 0

  let original = 0
  let compressed = 0

  while (uncompresseds.length > 0) {
    const image = uncompresseds.pop()
    if (!image) {
      process.exit()
    }
    try {
      spinner.start(`${image} 正在压缩中...`)
      let data: CompressResponse
      if (config.key) {
        data = await tinifyCompress(image)
      } else {
        data = await fileUpload(image)
      }
      succeeded++
      original += data.original
      compressed += data.compressed

      const originalText = cyan((data.original / 1000).toFixed(1), 'KB')
      const compressedText = cyan((data.compressed / 1000).toFixed(1), 'KB')
      const ratioText = cyan(Math.floor(100 - data.ratio * 100) + '%')
      spinner.succeed(
        chalk.green(`${image} 压缩成功, 原始大小: ${originalText}, 压缩大小: ${compressedText}, 优化比例: ${ratioText}`)
      )

      const hash = createHash(data.content)
      cache[image] = hash
    } catch (err) {
      failed++
      spinner.fail(chalk.red(`${image} 压缩失败: ${chalk.red(err)}`))
    }
    if (succeeded + failed >= total) {
      console.log('')
      changeSpinnerText(spinner, '任务完成', total, succeeded, failed, original, compressed)
      if (failed !== 0) {
        spinner.warn()
      } else {
        spinner.succeed()
      }
      saveCache(cache)
      process.exit()
    }
  }
}
