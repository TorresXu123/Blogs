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

### 2、实现全局的 Toast 组件

```js
// 要求Toast支持string/object两种类型的调用，其基本的样式为垂直/水平居中于屏幕中央，图片文字上下混排。
import Toast from './xx/toast';
Toast('弹出');
Toast({
  img: 'https://p9-dy-ipv6.byteimg.com/avatar3.jpeg',
  text: '弹出',
});
```

解法如下：

```js
//思路：1.在全局body下挂载一个div，将写好的toast组件转换成html并插入该div 2.挂载完之后给toast组件实例设置属性 3.一定时间后销毁这个div节点

import React from 'react';
import ReactDom from 'react-dom';

class ToastDom extends React.Component {
  constructor() {
    super();
    this.state = {
      img: '',
      text: '',
    };
  }
  setOpts(opts) {
    this.setState({ text: opts.text, img: opts.img });
  }
  render() {
    return (
      <div>
        {this.state.img !== '' ? (
          <img src={this.state.img} alt={this.state.text}></img>
        ) : null}
        <div>{this.state.text}</div>
      </div>
    );
  }
}
const Toast = (opts) => {
  let duringTime = 1000; // 悬停秒数
  let div = document.createElement('div');
  document.body.appendChild(div);
  // 将Toast和div挂载到render上
  let toastInit = ReactDom.render(<ToastDom />, div);
  const options = {};
  if (typeof opts === 'string') {
    options.text = opts;
    options.img = '';
  } else {
    options = { ...opts };
  }
  toastInit.setOpts(options);
  setTimeout(() => {
    document.body.removeChild(div);
  }, duringTime);
};

export default Toast;
```

## 三、LeeCode 算法专题

### 1、有效的括号

给定一个只包括 '('，')'，'{'，'}'，'['，']'  的字符串 s ，判断字符串是否有效。

有效字符串需满足：左括号必须用相同类型的右括号闭合。左括号必须以正确的顺序闭合。

**测试用例**

    输入：s = "()"
    输出：true

    输入：s = "()[]{}"
    输出：true

    输入：s = "(]"
    输出：false

    输入：s = "([)]"
    输出：false

    输入：s = "{[]}"
    输出：true

**题解思路**

1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 字符串 s 的长度一定是偶数，不可能是奇数(一对对匹配)。
4. 右括号前面一定跟着左括号，才符合匹配条件，具备对称性。
5. 右括号前面如果不是左括号，一定不是有效的括号。
6. 可以利用出入栈(后入先出)来形成对称性，将所有左括号以此遍历入栈，当匹配到不是左括号，就 pop 最近的一次入栈和当前的右括号对比（一定要成对，否则不满足对称性）
7. 最后栈里一定要是空的，所有的左括号要找到对应的右括号，否则也不满足
8. 综上，需要 for 循环+两个判断条件

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  const lightType = {
    '(': ')',
    '[': ']',
    '{': '}',
  };
  const stack = [];
  for (let index = 0; index < s.length; index++) {
    const element = s[index];
    if (lightType[element]) {
      stack.push(element);
    } else {
      if (element !== lightType[stack.pop()]) {
        return false;
      }
    }
  }
  return !stack.length;
};
```
