const path = require('path');
const download = require('download-git-repo')
const ora = require('ora')

module.exports = function (target) {
  target = path.join(target || '.', '.download-temp');
  return new Promise(resolve, reject) {
    const url = 'https://github.com/jewely/react-boilerplate.git#master';
    const spinner = ora(`正在下载项目模板，源地址：${url}`);
      spinner.start()
      download(url, target, { clone: true }, (err) => {
        if (err) {
          spinner.fail()
          reject(err)
        } else {
          spinner.succeed()
          resolve(target)
        }
      })
  }
}
