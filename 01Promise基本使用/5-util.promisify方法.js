
const util = require('util');
const fs = require('fs');
// 返回新的函数
let mineReadFile = util.promisify(fs.readFile);
mineReadFile('./resourece/content.txt').then(value => {
    console.log(value.toString());
}).catch((error) => {
    console.log(error);
})