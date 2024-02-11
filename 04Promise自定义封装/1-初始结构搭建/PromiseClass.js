class Promise{
    constructor(excecutor) {
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
            self.callback.forEach(element => {
                element.onResolved(data);
            });
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
                    element.onRejected(data);
                });
            });
        }
        try {
            // console.log(self.callback)
            excecutor(resolve, reject);
        } catch (error) {
            reject(error);
        }
        
    }
    then(onResolved, onRejected) {
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
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }  
    static resolve(value) {
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
    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason);
        })
    }
    static all(promise) {
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
    static race(promise) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promise.length; i++){
                promise[i].then(v => {
                    resolve(v);
                }, r => {
                    reject(r);
                });
            }
        })
    }
}