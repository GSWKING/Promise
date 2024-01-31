// 导包
const { rejects } = require('assert');
const fs = require('fs');
const { resolve } = require('path');
fs.readFile('./resourece/content.txt', (err , data) => {
    if (err) throw err;
    console.log(data
    .toString());
});

// Promise形式

const p = new Promise((resolve, rejects) => {
    fs.readFile('./resourece/content.txt', (err, data) => {
        if (err) throw rejects(err);
        resolve(data);
    });
});
p.then((value)=> {
    console.log(value.toString());
}, (reson) => {
    console.log(reson);
})
