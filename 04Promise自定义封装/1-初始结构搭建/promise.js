function Promise(excecutor) { 
    // 添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;  
    // 申明属性
    this.callback = [];
    // 保存实例对象的this 属性
    const self = this; // self _this that
    // resolve 函数
    function resolve(data) {
        if (self.PromiseState !== 'pending') return;
        // 1、修改对象的状态
        self.PromiseState = 'fulfilled';
        // 2、设置对象结果值
        self.PromiseResult = data;
        // setTimeout(() => {
        //     self.callback.forEach(element => {
        //         element.onResolved(data);
        //     });
        // });
        self.callback.forEach(element => {
            console.log("----");
            element.onResolved(data);
        });
        // if (self.callback.onResolved) {
        //     // 错误想法
        //     // self.PromiseResult = data;
        //     self.callback.onResolved(data);
        // }
    }
    // reject 函数
    function reject(data) {
        // console.log("reject " + data);
        if (self.PromiseState !== 'pending') return;
        // 1、修改对象的状态
        self.PromiseState = 'rejected';
        // 2、设置对象结果值
        self.PromiseResult = data;
        // let i = 0;
        setTimeout(() => {
            self.callback.forEach(element => {
                // console.log('------------------' + i + '--------------------');
                // console.log(element)
                // console.log("callback " + data);
                element.onRejected(data);
            });
        });
        
        // if (self.callback.onRejected) {
        //     // 错误想法
        //     // self.PromiseResult = data;
        //     self.callback.onRejected(data);
        // }
    }
    try {
        // console.log(self.callback)
        excecutor(resolve, reject);
    } catch (error) {
        reject(error);
    }
    
}

// 添加then方法
Promise.prototype.then = function (onResolved, onRejected) {
    const self = this
    //返回Promise对象 
    return new Promise((resolve, reject) => {
        if (typeof onResolved !== 'function') {
            onResolved = value => {
                value;
            }
        }
        if (typeof onRejected !== 'function') {
            onRejected = reason => {
                throw reason;
            }
        }
        // 封装函数
        function callback(type) {
            try {
                let objectPromise = type(self.PromiseResult);
                if (objectPromise instanceof Promise) {
                    objectPromise.then(v => {
                        resolve(v);
                    }, r => {
                        reject(r);
                    });
                } else {
                    // resolve(this.PromiseResult);
                    resolve(objectPromise);
                }
            } catch (error) {
                reject(error);
            }
        }
        // 调用回调函数
        if (self.PromiseState === 'fulfilled') {
            setTimeout(() => {
                callback(onResolved);
            });
        }
        if (self.PromiseState === 'rejected') {
            setTimeout(() => {
                callback(onRejected);
            });
        }
        // 判断 Pending 状态
        if (self.PromiseState === 'pending') {
            // 保存回调函数
            self.callback.push({
                onResolved: function () {
                    callback(onResolved);
                },
                onRejected: function () {
                    callback(onRejected);
                }
            });
        }
    });
}

Promise.prototype.catch = function (onRejected) {
    // const self = this;
    // return new Promise((resolve, reject) => {
    //      // 封装函数
    //     function callback(type) {
    //         try {
    //             let objectPromise = type(self.PromiseResult);
    //             if (objectPromise instanceof Promise) {
    //                 objectPromise.then(v => {
    //                     resolve(v);
    //                 }, r => {
    //                     reject(r);
    //                 });
    //             } else {
    //                 resolve(objectPromise);
    //             }
    //         } catch (error) {
    //             reject(error);
    //         }
    //     }
    //     if (self.PromiseState === 'rejected') {
    //         callback(onRejected)
    //     }
    //     // 判断 Pending 状态
    //     if (self.PromiseState === 'pending') {
    //         // 保存回调函数
    //         self.callback.push({
    //             onRejected: function () {
    //                 callback(onRejected);
    //             }
    //         });
    //     }
    // })
    return this.then(undefined, onRejected);
}

Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
        if (value instanceof Promise) {
            value.then(v => {
                resolve(v);
            }, r => {
                reject(r);
            });
        } else {
            resolve(value)
        }
    });
}

Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
        // if (reason instanceof Promise) {
        //     reason.then(v => {
        //         reject(v);
        //     }, r => {
        //         reject(r);
        //     });
        // } else {
        //     reject(reason);
        // }
        reject(reason);
    })
}

Promise.all = function (promise) {
    return new Promise((resolve, reject) => {
        let count = 0;
        let arr = [];
        // 遍历
        for (let i = 0; i < promise.length; i++){
            promise[i].then(v => {
                count++;
                arr[i] = v;
                // arr.push(v);
                if (count === promise.length) {
                    resolve(arr);
                }
            }, r => {
                reject(r);
            });
        }
    });
}

Promise.race = function (promise) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promise.length; i++){
            promise[i].then(v => {
                // console.log("--------------------------");
                // console.log(this);
                resolve(v);
            }, r => {
                reject(r);
            });
        }
    })
}