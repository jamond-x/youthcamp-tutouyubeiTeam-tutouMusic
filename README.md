# 秃头音乐

秃头预备选手专属音乐APP

## 安装依赖

> 将仓库下载到本地后运行该命令安装依赖

```bash
npm install
```

### 本地运行项目
```bash
npm run dev
```

### 打包构建
```bash
npm run build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).



### 技术栈

- [Vue3](https://v3.cn.vuejs.org/guide/introduction.html)
- [Vuex](https://next.vuex.vuejs.org/zh/index.html)
- [Vue Router](https://next.router.vuejs.org/zh/index.html)
- [Sass](https://www.sass.hk/guide/)
- [Quasar2](https://quasar.dev/vue-components/ajax-bar)
- [Quasar1中文文档](http://www.quasarchs.com/)

> quasar1中文文档和quasar最新版本quasar2英文文档几乎相同，最终以英文文档为准
>
> 建议
>
> quasar看下组件怎么用就好（其实大同小异），看看quasar的布局class



### 项目基础配置

#### 推荐插件

在 `.vscode/extensions.json`中列出了推荐安装的插件，打开 VSCode 的时候会提示是否安装，最好全部安装一下。

#### workspace 设置

在 `.vscode/settings.json` 中配置了项目的共享配置，这些配置在所有的协作者本地都是一样的，保证大家的环境一致性。

#### 文件结构

```bash
├─.vscode/
|    ├─extensions.json          # vsCode 插件设置
|    └settings.json             #
├─public/                       # 纯静态资源
├─src/
|  ├─assets/                    # 动态资源
|  ├─components/                # .vue 组件
|  ├─css/                       # CSS/Sass/...文件
|  |  ├─app.scss
|  |  └quasar.variables.scss    # 调整quasar的sass变量
|  ├─i18n/                      # 语言切换插件 暂时用不上
|  ├─layouts/                   # 页面整体布局
|  ├─pages/                     # 页面.vue文件
|  ├─boot/                      # 根文件 用于初始化代码
|  ├─router/                    # Vue路由
|  |   ├─index.js               # Vue路由定义
|  |   └routes.js               # App路由定义
|  ├─store/                     # Vuex Store
|  |   ├─index.js               # Vuex Store 定义
|  │   └── <folder>             # Vuex Store 模块...
|  ├─utils/                     # 工具文件
|  |   ├─const.js               # 常用的常量
|  |   ├─index.js
|  |   ├─request/               # 用于请求相关文件
|  ├─App.vue                    # APP的根Vue组件
|  ├─index.template.html        # index.html模板
|  ├─quasar.d.ts                # quasar 的ts类型声明文件
├─.editorconfig                 # editor配置
├─.eslintignore                 # ESlint忽略路径
├─.eslintrc.js                  # ESlint配置
├─.postcssrc.js                 # PostCSS配置
├─.prettierignore               # prettierrc忽略路径
├─.prettierrc.js                # prettierrc配置文件
├─babel.config.js               # Babeljs配置
├─jsconfig.json                 # JS配置
├─package-lock.json
├─package.json                  # npm脚本和依赖项
├─quasar.conf.js                # Quasar App配置文件
├─README.md                     # README
```



