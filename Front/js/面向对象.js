// 1.构造函数
// 构造函数首字母通常为大写，并具有如下两个特点:1 函数体内部使用this关键字,代表了所要生成的对象实例；2 生成对象的时候，必须使用关键字new命令

var Vehicle = function () {
    this.price = 1000;
};

var v = new Vehicle();
console.log(v.price);

// 如果构造函数内部是return 后面跟着一个对象，则返回该对象，如果不是对象(例如跟着数值)则返回该this对象
var Ve = function (p) {
    this.p = p;
    return 1000;
};

console.log((new Ve(500)) === 1000); //false