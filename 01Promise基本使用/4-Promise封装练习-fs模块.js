
function mineReadFile(path) {
    return new Promise((resolve, reject) => {
        require('fs').readFile(path, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

mineReadFile('./resourece/content.txt').then((value) => {
    console.log(value.toString());
}, (reson) => {
    console.log(reson);
});