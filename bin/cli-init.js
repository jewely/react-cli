const path = require('path');
const fs = require('fs');
const glob = require('glob');
const program = require('commander');
const inquirer = require('inquirer');

const chalk = require('chalk');
const symbols = require('log-symbols');
console.log(symbols.success, chalk.green('项目创建成功'));
console.log(symbols.error, chalk.red('项目创建失败'));

const download = require('../lib/download');

program.usage('<project-name>');
// 根据输入，获取项目名称
let projectName = program.args[0];
if (!projectName) {
  // project-name 必填
  // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
  program.help();
  return;
}

const list = glob.sync('*'); // 遍历当前目录
let next = undefined;

if (list.length) {
  if (
    list.filter(name => {
      const fileName = path.resolve(process.cwd(), path.join('.', name));
      const isDir = fs.stat(fileName).isDirectory();
      return name.indexOf(projectName) !== -1 && isDir;
    }).length !== 0
  ) {
    console.log(`项目${projectName}已经存在`);
    return;
  }
  next = Promise.resolve(projectName);
} else if (rootName === projectName) {
  next = inquirer
    .prompt([
      {
        name: 'buildInCurrent',
        message:
          '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
        type: 'confirm',
        default: true
      }
    ])
    .then(answer => {
      returnPromise.resolve(answer.buildInCurrent ? '.' : projectName);
    });
} else {
  next = Promise.resolve(projectName);
}

function go() {
  next.then(projectRoot => {
    if (projectRoot !== '.') {
      fs.mkdirSync(projectRoot);
    }
    return download(projectRoot).then(target => {
      return {
        projectRoot,
        downloadTemp: target
      };
    });
  });
}

next && go();
