---
title: JS面试理论
order: 2
toc: menu
nav:
  title: 面试之道
  order: 3
---

## 一、性能优化专题

### 1、CSS 性能优化技巧

1） 内联首屏关键 CSS

```js
1）通过link标签引用外部CSS文件,要等HTML下载完成后才知道所要引用的CSS文件，速度太慢；
2）因为初始拥塞窗口存在限制（通常是 14.6kB，压缩后大小），如果内联CSS后的文件超出了这一限制，系统就需要在服务器和浏览器之间进行更多次的往返，所以不能把所有的css都内联到html里
3）只将渲染首屏内容所需的关键CSS内联到HTML中
```

2）异步加载 CSS

```js
CSS会阻塞渲染，在CSS文件请求、下载、解析完成之前，浏览器将不会渲染任何已处理的内容。有时，这种阻塞是必须的，因为我们并不希望在所需的CSS加载之前，浏览器就开始渲染页面。那么将首屏关键CSS内联后，剩余的CSS内容的阻塞渲染就不是必需的了，可以使用外部CSS，并且异步加载。
实现浏览器异步加载CSS有四种方式：
1）使用JavaScript动态创建样式表link元素，并插入到DOM中
// 创建link标签
const myCSS = document.createElement( "link" );
myCSS.rel = "stylesheet";
myCSS.href = "mystyles.css";
// 插入到header的最后位置
document.head.insertBefore( myCSS, document.head.childNodes[ document.head.childNodes.length - 1 ].nextSibling );
2）将link元素的media属性设置为用户浏览器不匹配的媒体类型（或媒体查询），降低优先级，在不阻塞页面渲染的情况下再进行下载
在加载前可以设置为根本不存在的类型如：media="noexist"，再在CSS文件加载完成之后，将media的值设为screen或all，从而让浏览器开始解析CSS
3）类比于2里的，将rel标记为alternate可选样式表再在加载完改回去<link rel="alternate stylesheet" href="mystyles.css" onload="this.rel='stylesheet'">
4）使用rel = "preload"，比使用不匹配的media方法能够更早地开始加载CSS
<link rel="preload" href="mystyles.css" as="style" onload="this.rel='stylesheet'">//注意as是必填项，忽略as属性，或者错误的as属性会使preload等同于XHR请求，浏览器不知道加载的是什么内容，因此此类资源加载优先级会非常低
```

3）文件压缩

```js
利用现在的构建工具，如webpack、gulp/grunt、rollup等实现CSS压缩功能，主要是缩减空格，删除了不必要的分号
```

4）去除无用 CSS

```js
借助Uncss库来进行。Uncss可以用来移除样式表中的无用CSS，并且支持多文件和JavaScript注入的CSS
```

5）CSS 选择器的合理使用

```js
CSS选择器的匹配是从右向左进行的
1)保持简单，不要使用嵌套过多过于复杂的选择器。(相比于#markdown-content-h3，显然使用#markdown .content h3时，浏览器生成渲染树（render-tree）所要花费的时间更多。)
2)通配符和属性选择器效率最低，需要匹配的元素最多，尽量避免使用。
3)不要使用类选择器和ID选择器修饰元素标签，如h3#markdown-content，这样多此一举，还会降低效率。
4)不要为了追求速度而放弃可读性与可维护性。
```

6）减少使用昂贵的属性

```js
在浏览器绘制屏幕时，所有需要浏览器进行操作或计算的属性相对而言都需要花费更大的代价。当页面发生重绘时，它们会降低浏览器的渲染性能。所以在编写CSS时，我们应该尽量减少使用昂贵属性，如box-shadow/border-radius/filter/透明度/:nth-child等。
```

7）优化重排与重绘

```js
当FPS为60时，用户使用网站时才会感到流畅。这也就是说，我们需要在16.67ms内完成每次渲染相关的所有操作
1）改变font-size和font-family
2）改变元素的内外边距
3）通过JS改变CSS类
4）通过JS获取DOM元素的位置相关属性（如width/height/left等）
5）CSS伪类激活
6）滚动滚动条或者改变窗口大小
7）避免不必要的重绘（如页面滚动时触发的hover事件，可以在滚动的时候禁用hover事件，这样页面在滚动时会更加流畅）

此外，我们还可以通过CSS Trigger查询哪些属性会触发重排与重绘。
值得一提的是，某些CSS属性具有更好的重排性能。如使用Flex时，比使用inline-block和float时重排更快，所以在布局时可以优先考虑Flex。
```

8）不要使用@import

```js
使用@import引入CSS会影响浏览器的并行下载：使用@import引用的CSS文件只有在引用它的那个css文件被下载、解析之后，浏览器才会知道还有另外一个css需要下载，这时才去下载，然后下载后开始解析、构建render tree等一系列操作。这就导致浏览器无法并行下载所需的样式文件。
```

### 2、空间换时间的场景

1. Vue.js 3.0 使用 Proxy API 把对象变成响应式，一旦某个对象经过 reactive API 变成响应式对象后，会把响应式结果存储起来，响应式模块的内部，使用了 WeakMap 的数据结构存储响应式结果
2. KeepAlive 组件：在组件渲染挂载和更新前都会缓存组件的渲染子树，这个子树一旦被缓存了，在下一次渲染的时候就可以直接从缓存中拿到子树 vnode 以及对应的 DOM 元素来渲染。
3. 使用"SWR"一种用于数据请求的 React Hooks 库，一种由 HTTP RFC 5861 推广的 HTTP 缓存失效策略。这种策略首先从缓存中返回数据（过期的），同时发送 fetch 请求（重新验证），最后得到最新数据。

**总结下来就是前端的空间换时间基本就是各种缓存。从浏览器缓存，到组件缓存，到请求缓存。**

### 3、内联缓存策略

```js
前提：函数多了，频繁的压栈出栈也是会有问题的

内联缓存：内联缓存的目标是通过记住以前直接在调用点上方法查询的结果来加快运行时方法绑定的速度。内联缓存对动态类型语言尤为有用，其中大多数（如非全部）方法绑定发生在运行时，因此虚方法表通常无法使用。（我们可以理解为javascript每一次的栈执行遇到调用外部函数、对象时候都产生地址缓存记录，下回执行到这个位置时候直接从缓存中取出对应记录，省去重新查找这一过程从加快程序执行速度。）

例子：
let value = 0
const Calculator = {
    add1(val) {
        value += val
    },
    add2(val) {
        value += val
    },
    add3(val) {
        value += val
    }
}
Calculator[type](val) // 动态执行函数，当前调点无法确定地址，但使用了哈希快速查找（平均为80ms左右）
function optimization(val, type) {
    if (type === 'add1')
        Calculator.add1(val)
    else if (type === 'add2')
        Calculator.add2(val)
    else if (type === 'add3')
        Calculator.add3(val)
}
optimization(1, key)//使用了内联缓存策略，用了多层if else（平均为55～50ms左右）
```

**注意：对象属性值访问哈希、数组的方式是远远快于 if、switch 的，所以这里体现了内联缓存策略的优势**
