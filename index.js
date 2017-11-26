/**
 * 获取一个目录下所有文件，并层级展示
 * 获取根目录
 * 获取子目录
 */
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class Dir extends EventEmitter {
  constructor() {
    super();
    this.dir = {};
    this.root = './';
    this.blackSpace = 0;
  }

  setAllDir () {

  }

  setDir (dir) {
    fs.readdir(dir, (err, files) => {
      if (err) throw err;
      files.forEach(v => {
        console.log(v);      
        if (this.isDir(v)) {
          let childDir = path.join(dir, v);
          fs.stat(childDir, (err, stats) => {
            if (err) throw err;
            if (stats.isDirectory()) {
              this.setDir(path.join(dir, v));
            }
          })
        }
      })
      // this.emit('rootFinished');
    });
  }

  getDir () {
    return this.dir;
  }

  isDir (str) {
    let reg = /\.(\w+)$/;
    return !reg.test(str);
  }
}

let dir = new Dir();
dir.setDir('../my-webpack-vue/src');

// function isDirectory(name) {
//   let pathName = path.resolve(__dirname + name);
//   fs.stat(pathName, (err, stats) => {
//     if (err) throw err;
//     if (stats.isDirectory()) {
//       // todo: 目录
//       fs.readdir()
//     } else if (stats.isFile()) {
//       // todo: file
//     }
//   })
// }

// let chineseReg = /[\u4e00-\u9fa5]+/g;
// fs.readdir('./', (err, files) => {
//   if (err) throw err;
//   console.log(files);
//   files.forEach(v => {
//     fs.readFile(v, (err, data) => {
//       if (err) throw err;
//       // 测试匹配中文
//       let chinese = data.toString().match(chineseReg);
//       console.log(v, chinese);
//     });
//   });
// });