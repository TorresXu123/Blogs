---
title: CI/CD实现文档自动化部署
order: 1
toc: menu
nav:
  title: 技术杂项
  order: 1
---

## 前言

> **博客现在貌似成为了一个技术人的标配，用于记录自己趟过的坑或是沉淀工作和学习心得！**本篇文章主要是利用 dumi 结合 Github Action 的方式实现博客的搭建及自动化部署
>
> 简单介绍一下使用到的技术工具：
>
> - **dumi：**蚂蚁金服出品，一款为组件开发场景而生的文档工具；官网地址：https://d.umijs.org/zh-CN
> - **Github Action：**Github Action 是 GitHub 推出的持续集成 (Con­tin­u­ous in­te­gra­tion，简称 CI) 服务，它提供了配置非常不错的虚拟服务器环境，基于它可以进行构建、测试、打包、部署项目，其最大优势就是它是与 GitHub 高度整合的，只需一个配置文件即可自动开启服务。甚至你不需要购买服务器 —— GitHub Actions 自带云环境运行，包括私有仓库也可以享用，而且云环境性能也非常不错。

## 搭建静态站点脚手架

先利用 dumi 搭建一个文档项目，首先确保本地有 node 且 node 版本是 10.13 或以上。

```bash
npx @umijs/create-dumi-app && yarn create @umijs/dumi-app # 搭建项目框架
yarn install # 安装依赖
yarn start #启动文档
```

可以根据自己需求是否使用国际化等配置，主要是修改项目下的.umirc.ts 文件，详情查阅官方文档

**注意：base、publicPath、exportStatic 是在 build 构建时的文件路径配置和你实际要挂载到的目录有关，如这里是会将编译后文件部署到 torresxu123.github.io/Blogs 下**

```js
//本项目.umirc.ts配置
{
  title: 'Blogs', // 站点标题
  base: '/',//文档起始路由
  publicPath: '/',//静态资源起始路径
  exportStatic: {}, // 将所有路由输出为 HTML 目录结构，以免刷新页面时 404
  mode: 'site',
  locales: [['zh-CN', '中文']],//去除国际化,该配置为二维数组，第一项配置会作为站点默认的 locale
}
```

## 配置 github 远程仓库

1、创建 Blogs 仓库，并将上述项目上传到 github 远程仓库

2、创建 [username].github.io 仓库（username 指的是你的 github 用户名，如 torresxu123.github.io

3、Github 生成访问令牌（建议把所有权限勾上）

```
github -> setting -> Developer settings -> Personal access tokens -> Generate new token
```

4、配置 Github Actions 流水线

回到你的仓库（Blogs），依次点击 Settings > Secrets > New secret 将 name 设置为 DEPLOY_KEY（自己定义后面在.yml 文件中会用到），并将刚才复制的 token 粘贴在下方

5、在项目根目录下新建 `.github/workflows/gh-pages.yml` 文件，yml 配置语法可以参考[阮一峰 GitHub Actions 入门教程](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

```yml
# 本项目配置如下：
# This workflow uses actions that are not certified by GitHub.
# They are provided by a third-party and are governed by
# separate terms of service, privacy policy, and support
# documentation.

# This workflow will install Deno and run tests across stable and nightly builds on Windows, Ubuntu and macOS.
# For more information see: https://github.com/denolib/setup-deno

name: release blog to TorresXu123.github.io #工作流名称，不设置的话默认取配置文件名

# 指定触发 workflow 的条件
# 指定触发事件时，可以限定分支或标签
# 当前是 只有main分支上触发 push 和 pull_request 事件时才执行工作流任务
on:
  push:
    branches: [main] #限定只有main分支
  pull_request:
    branches: [main]

jobs: # 工作流执行的一个或多个任务
  build: # 任务名称
    runs-on: ${{ matrix.os }} # runs a test on Ubuntu, Windows and macOS 任务运行的容器类型（虚拟机环境）

    strategy:
      matrix:
        node: [12]
        os: [ubuntu-latest]

    steps: # 任务执行步骤
      - uses: actions/checkout@v1
      - name: Use Node.js 15.x
        uses: actions/setup-node@v1
        with:
          node-version: 15.x

      - name: yarn install, build
        run: |
          yarn
          yarn build
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@3.7.1
        with:
          ACCESS_TOKEN: ${{ secrets.DEPLOY_KEY }} # 上述定义存放的token值
          BRANCH: master # 指定部署的分支，默认是 gh-pages 分支
          FOLDER: dist # 默认源码在 dist 目录
          REPOSITORY_NAME: TorresXu123/TorresXu123.github.io # 远程仓库所在地址
          # TARGET_FOLDER: Blogs 静态资源需要部署到的目录（目的地）不写默认放到TorresXu123.github.io仓库根目录

        env:
          CI: true
```

后续只要 push 或者 pull request 代码到 main，都会触发 CI 推送代码到 [username].github.io 仓库

## 利用 gh-pages 实现手动部署推送

在文档项目中引入 gh-pages 包，并写好推送脚本

```bash
yarn add gh-pages -D #安装gh-pages

# 项目package.json配置新增
+"homepage": "https://torresxu123.github.io",# 访问站点的URL
"scripts": {
+   "docs:deploy": "gh-pages -d dist"  # dist是打包生成的目录
}
```

部署推送操作

```bash
yarn build # 构建静态资源
yarn docs:deploy # 会对打包好的dist目录执行推送，自动发布到远程仓库并生成gh-pages branch分支
```
