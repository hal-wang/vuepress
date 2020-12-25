---
title: 开始一个简单的vuepress项目
sidebarDepth: 3
---

## 环境搭建

::: warning
node.js 版本不低于 8.0
:::

### 全局安装 vuepress

```shell
npm i -g vuepress
// 或 npm i -g vuepress --registry=https://registry.npm.taobao.org
```

## 创建项目

### 新建目录

```
mkdir vuepress-demo
cd vuepress-demo
```

### 初始化

```
npm init -y
```

## 添加脚本

此操作非必须，添加脚本的目的是为了简化命令。
打开`package.json`文件，修改`scripts`

```
{
  "scripts": {
    "dev": "vuepress dev docs",
    "build": "vuepress build docs"
  }
}
```

后续可运行命令：

- 开发：npm run dev
- 发布：npm run build

<br >

::: tip
**不继续说了，去看官网吧：[VuePress 文档](https://www.vuepress.cn/)**
:::

<br >

## clone 本项目

你也可以直接 clone 本项目，将这个项目改为你的文档

```
git clone https://github.com/hal-wang/vuepress.git
```
