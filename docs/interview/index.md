---
title: JS面试手写
order: 1
toc: menu
nav:
  title: 面试之道
  order: 3
---

## 一、数组专题

### 1、forEach 循环调用异步方法，如何实现同步

前置代码：利用 Promise 的特性，结合 async await 实现异步转同步

```js
const res = [];
const arr = [1, 2, 3, 4, 5];

function t(num) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('定时器', num);
      resolve();
    }, 1000);
  });
}

function t2(item) {
  console.log('进入res');
  res.push(item);
}
```

**情景 1：forEach 内部等待异步执行完成**

```js
arr.forEach(async (item, index) => {
  await t(item);
  t2(item);
});
```

**情景 2: forEach 外部等待 forEach 执行完成**

```js
let asyncFun = [];
arr.forEach((item, index) => {
  asyncFun.push(t(item));
  t2(item);
});
Promise.all(asyncFun).then(() => {
  console.log('res', res);
});
```

**情景 3：既需要 forEach 内部同步执行，又需要 forEach 外部同步执行**

Promise.all 获得的成功结果的数组里面的数据顺序和 Promise.all 接收到的数组顺序是一致的，即 p1 的结果在前，即便 p1 的结果获取的比 p2 要晚。

```js
Promise.all(
  arr.map((item) => {
    return new Promise(async (resolve, reject) => {
      await t(item);
      t2(item);
      resolve();
    });
  }),
).then(() => {
  console.log('object', res);
});
```

**情景 4：把外部代码移进来**

```js
arr.forEach(async (item, index) => {
  await t(item);
  t2(item);
  if (index === arr.length - 1) {
    console.log('res', res);
  }
});
```

### 2、第二题

## 二、经典面试题

### 1、大数相加

```js
function largeNumberAdd(a: string, b: string): string {
  // 如 a = "9007199254740991"; b = "1234567899999999999";
  // 1、取两个数字的最大长度，用0去补齐长度
  let maxLength = Math.max(a.length, b.length);
  a = a.padStart(maxLength, '0');
  b = b.padStart(maxLength, '0');
  let t = 0;
  let f = 0;
  let sum = '';
  for (let i = maxLength - 1; i >= 0; i--) {
    // 2、从低位开始计算，t一定不会超过20，f只会是0或1
    t = parseInt(a[i]) + parseInt(b[i]) + f;
    f = Math.floor(t / 10);
    sum = (t % 10) + sum;
  }
  if (f == 1) {
    // 3、最大一位有值就进一位
    sum = '1' + sum;
  }
  return sum;
}
```
