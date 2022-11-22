# pi-cloud-web

pi-cloud-web 是 [pi-cloud](https://gitee.com/linjiabin100/pi-cloud.git) 的前端源码，它是基于 Vue 3、Vite 3、Typescript、Pinia、ElementPlus 等前端主流技术栈构建的。

## 特性

- 使用基于 Vite 的构建设置进行 Vue 3 开发
- 页面基于 ElementPlus 构建
- 使用 Pinia 进行状态管理
- 国际化、按钮权限、ElementPlus 自定义主题

## 预览

## 

| ![image-20221104164240613.png](https://gitee.com/linjiabin100/pi-cloud-resource/raw/master/imgs/image-20221104164240613.png) | ![image-20221104164357964](https://gitee.com/linjiabin100/pi-cloud-resource/raw/master/imgs/Snipaste_2022-11-22_11-18-12.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![image-20221104164416152](https://gitee.com/linjiabin100/pi-cloud-resource/raw/master/imgs/Snipaste_2022-11-22_11-18-34.png) | ![image-20221104164428444](https://gitee.com/linjiabin100/pi-cloud-resource/raw/master/imgs/Snipaste_2022-11-22_11-18-52.png) |
| ![Snipaste_2022-11-22_11-19-14](https://gitee.com/linjiabin100/pi-cloud-resource/raw/master/imgs/Snipaste_2022-11-22_11-19-14.png) | ![Snipaste_2022-11-22_11-12-16](https://gitee.com/linjiabin100/pi-cloud-resource/raw/master/imgs/Snipaste_2022-11-22_11-12-16.png) |

## 源码

|      | Gitee                                           | GitHub                                     |
| ---- | ----------------------------------------------- | ------------------------------------------ |
| 后端 | https://gitee.com/linjiabin100/pi-cloud.git     | https://github.com/zengpi/pi-cloud.git     |
| 前端 | https://gitee.com/linjiabin100/pi-cloud-web.git | https://github.com/zengpi/pi-cloud-web.git |

## 项目功能模块

```
- 系统管理
	- 用户管理
	- 菜单管理
	- 角色管理
	- 客户端管理
- 系统监控
	- 接口文档
	- 操作日志
	- 服务监控
```

## 运行环境  

要在你的机器上开发运行 pi-cloud-web，你需要 node.js 16.0 + 版本，推荐使用 16.0.0。

### nvm-windows

nvm-windows 用于在 Windows 中管理 node.js 的多个版本安装。安装程序请点击 [此处](https://github.com/coreybutler/nvm-windows/releases) 下载，具体使用方式请参考 [官方文档](https://github.com/coreybutler/nvm-windows)。以下是常用操作：

```shell
# 设置 node 国内镜像
$ nvm node_mirror https://npmmirror.com/mirrors/node/
# 设置 npm 国内镜像
$ nvm npm_mirror https://npmmirror.com/mirrors/npm/
# 安装指定 <version> 的 node.js
$ nvm install <version>
# 查看已安装的 node.js
$ nvm list
# 切换到指定 <version> 的 node.js
$ nvm use <version>
```

## 项目启动

```bash
# Project Setup
npm install
# Compile and Hot-Reload for Development
npm run dev
# Type-Check, Compile and Minify for Production
npm run build
# Lint with [ESLint](https://eslint.org/)
npm run lint
# Run Unit Tests with [Vitest](https://vitest.dev/)
npm run test:unit
# Run End-to-End Tests with [Cypress](https://www.cypress.io/)
npm run test:e2e:dev
```

## 参考文档

一定要阅读 pi-cloud-web 的 [参考文档](https://www.yuque.com/zengpi/szfuh0)，它描述了开发、运行 pi-cloud-web 的必要信息以及核心原理。

阅读 [个人博客](https://www.cnblogs.com/zn-pi/) 也是一个不错的选择，它是对文档很好的一个补充，阅读它会对项目有更深的理解。
