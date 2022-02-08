---
title: 打造免费快速稳定的私人图床
order: 2
toc: menu
---

## 前言

> 我们在写 markdown 文档时，时常会需要通过图片资源去辅以说明。这时候我们就需要一个图床来满足我们的需求，而图床存在的意义，就是专门用来存放图片，同时允许你把图片对外连接的网上空间。网上搭建免费图床的方案有很多，我们今天选择通过 Vscode 插件 vs-picgo+Github 的方式来搭建 Markdown 图床，优点在于快捷轻便，借助 github 平台安全可靠，缺点在于我们必须要借助 vscode 的快捷键来上传图片。

## 整体思路如下

1. 在 vscode 中下载安装 vs-picgo 插件，关键 setting.json 配置如下

   1. `current` 设置为 GitHub
   2. `Branch` 是我们仓库的分支，默认为 main
   3. `custom url` 是我们图片上传的连接，有两种方式可以使用
      ```txt
       原生方式：使用GitHub原生连接，格式为
          https://raw.githubusercontent.com/[用户名]/[仓库名]/[分支名]
          如https://raw.githubusercontent.com/TorresXu123/PicGo/main
          原生方式有一个弊端就是，国内速度比较慢
       cdn加速方式：格式为
          https://cdn.jsdelivr.net/gh/[用户名]/[仓库名]@[分支名]
          如https://cdn.jsdelivr.net/gh/TorresXu123/PicGo@main
          cdn加速的优点是国内访问速度比较快
      ```
   4. `path`是我们的图片存储在仓库中的路径，比如我的是 blogs/imgs/
   5. `Repo`是我们的仓库，比如我的是 TorresXu123/PicGo/

2. 在 github 个人账号下新建仓库用于存放图片资源，具体配置参考[官方手把手教学如何配置 github 图床](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#github%E5%9B%BE%E5%BA%8A)
3. 做好上述操作后，我们就可以在 vscode 上使用快捷键` option + cmd + u（mac）`插入图片会自动生成图片格式链接

## 不用命令行，删除 GitHub 上图片或文件

通常情况下，我们删除 GitHub 的图片或文件只能通过命令行进行，实际上 github 提供了可视化操作辅助我们删除，步骤如下：

1. 鼠标点击要删除的图片

![删除图床操作1](https://cdn.jsdelivr.net/gh/TorresXu123/PicGo@main/blogs/imgs/删除图床操作1.png)

2. 进入图片预览，点击右上角删除按钮

![删除图床操作2](https://cdn.jsdelivr.net/gh/TorresXu123/PicGo@main/blogs/imgs/删除图床操作2.png)

3. 点击 commit changes 删除并提交 commit 即可

![删除图床操作3](https://cdn.jsdelivr.net/gh/TorresXu123/PicGo@main/blogs/imgs/删除图床操作3.png)
