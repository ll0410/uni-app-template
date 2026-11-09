# uni-app-template

通用 uni-app + Vue3 + TypeScript + Vite + Pinia 项目模板。面向 VSCode / CLI 开发，微信开发者工具调试小程序，HBuilderX 仅用于 App 真机调试与打包。

模板只内置基础设施与最小业务示例，不绑定 UI 组件库，便于直接复制到新项目。

## 特性

- Vue3 `<script setup lang="ts">`，`@/` 路径别名，Vue / Pinia / uni-app 生命周期 / `useI18n` 自动导入。
- ESLint 为主、Prettier 为辅、Stylelint 校验样式，保存自动修复。
- Husky + lint-staged + Commitlint（Conventional Commits）。
- 请求封装：统一响应结构、Token 注入、401 单飞刷新与请求重放、取消请求、超时重试、Loading / Toast。
- Pinia 持久化：主题、语言、用户信息、角色、权限；Token 单独存 uni storage，避免循环依赖。
- 路由守卫：登录白名单、角色校验，拦截 `navigateTo / redirectTo / reLaunch / switchTab`。
- 主题切换（CSS 变量 + 深色模式）、中英文 i18n（构建期预编译，小程序端无 `eval`）。
- 小程序分包、`preloadRule` 预下载、多环境构建、条件编译示例。
- 内置轻量 Mock，可通过 `VITE_USE_MOCK` 开关。

## 技术栈

| 能力   | 选型                          | 版本                             |
| ------ | ----------------------------- | -------------------------------- |
| 框架   | uni-app Vue3                  | `3.0.0-5030420261029002`         |
| 视图   | Vue                           | `3.4.21`                         |
| 构建   | Vite                          | `5.2.8`                          |
| 状态   | Pinia + persistedstate        | `2.3.1` / `3.2.3`                |
| 国际化 | vue-i18n + unplugin-vue-i18n  | `9.14.5` / `5.3.1`               |
| 语言   | TypeScript                    | `5.9.3`                          |
| 规范   | ESLint / Stylelint / Prettier | `10.14.0` / `17.16.0` / `3.9.10` |
| 样式   | Sass                          | `1.77.8`                         |

> Vue、Vite、uni-app 三个版本存在 peer 约束，已在 `package.json` 中锁定；升级时需同步验证 `@dcloudio/*`、`vue`、`vite` 三者兼容性。

## 环境要求

- Node.js >= 20.19.0
- pnpm >= 9.0.0
- 微信开发者工具（调试小程序）
- HBuilderX（可选，App 真机调试 / 云打包）

## 快速开始

```bash
pnpm install
pnpm dev:h5          # http://localhost:5173
pnpm dev:mp-weixin   # 输出 dist/dev/mp-weixin
```

开发环境默认开启 Mock，测试账号：

| 账号    | 密码     | 角色    | 权限                      |
| ------- | -------- | ------- | ------------------------- |
| `admin` | `123456` | `admin` | `user:edit`、`order:view` |
| `user`  | `123456` | `user`  | `order:view`              |

## 常用脚本

| 命令                                      | 说明                                        |
| ----------------------------------------- | ------------------------------------------- |
| `pnpm dev:h5`                             | H5 开发（Vite 代理 `/api`）                 |
| `pnpm dev:h5:test`                        | H5 测试环境开发（`.env.test`）              |
| `pnpm dev:mp-weixin`                      | 微信小程序开发，输出 `dist/dev/mp-weixin`   |
| `pnpm dev:app`                            | App 开发，输出 `dist/dev/app`               |
| `pnpm build:h5`                           | H5 生产构建                                 |
| `pnpm build:h5:test`                      | H5 测试环境构建                             |
| `pnpm build:mp-weixin`                    | 小程序生产构建，输出 `dist/build/mp-weixin` |
| `pnpm build:mp-weixin:test`               | 小程序测试环境构建                          |
| `pnpm build:app`                          | App 资源构建，输出 `dist/build/app`         |
| `pnpm lint` / `pnpm lint:fix`             | ESLint 检查 / 修复                          |
| `pnpm lint:style` / `pnpm lint:style:fix` | Stylelint 检查 / 修复                       |
| `pnpm format`                             | Prettier 格式化                             |
| `pnpm type-check`                         | `vue-tsc --noEmit`                          |

## 目录结构

```text
uni-app-template/
├── .husky/                     # Git hooks（pre-commit / commit-msg）
├── .vscode/                    # 保存自动修复、推荐插件、调试配置
├── src/
│   ├── api/                    # 接口定义，按业务模块拆分
│   ├── components/             # 全局组件（app-page / theme-switch / lang-switch）
│   ├── hooks/                  # useRequest、usePaging、usePermission 等
│   ├── locales/                # i18n 入口与 json5 语言包
│   ├── mock/                   # 轻量 Mock 与业务模拟数据
│   ├── pages/                  # 主包页面（首页 / 登录 / 我的）
│   ├── plugins/                # 全局插件注册（$utils）
│   ├── router/                 # 路由元信息、守卫、白名单
│   ├── services/               # 可选扩展：websocket / update / report
│   ├── stores/                 # Pinia 模块与持久化插件
│   ├── styles/                 # 主题变量、mixin、全局样式
│   ├── subPackages/            # 分包：goods / order / demo
│   ├── types/                  # 业务类型与全局类型声明
│   ├── utils/                  # request / storage / auth / ui / platform
│   ├── App.vue
│   ├── main.ts
│   ├── manifest.json           # 各端配置（app-plus / mp-weixin / h5）
│   └── pages.json              # 页面、TabBar、分包、预下载
├── .env                        # 公共变量
├── .env.development            # 开发环境
├── .env.test                   # 测试环境
├── .env.production             # 生产环境
├── eslint.config.mjs
├── stylelint.config.mjs
├── commitlint.config.mjs
├── vite.config.ts
└── package.json
```

## 工程规范

### ESLint / Prettier / Stylelint

- ESLint 是唯一检查与修复入口，Prettier 仅补充格式化，规则冲突由 `eslint-config-prettier` 关闭。
- Stylelint 约束类名为 BEM：`block`、`block__element`、`block--modifier`。
- VSCode 安装 `.vscode/extensions.json` 推荐插件，保存时自动执行 ESLint + Stylelint 修复。
- `*.d.ts` 与自动生成的 `src/types/auto-imports.d.ts` 不参与 ESLint 校验。

### Git 提交

```bash
git add .
git commit -m "feat: 新增订单分包页面"
```

- `pre-commit` 执行 `lint-staged`，按文件类型运行 ESLint / Stylelint / Prettier。
- `commit-msg` 执行 Commitlint，提交信息需符合 Conventional Commits：`feat`、`fix`、`docs`、`refactor`、`chore` 等。

### 环境变量

变量必须以 `VITE_` 开头，类型声明在 `src/env.d.ts`。

| 变量                | 说明                                        |
| ------------------- | ------------------------------------------- |
| `VITE_APP_TITLE`    | 应用标题                                    |
| `VITE_APP_ENV`      | 环境标识（development / test / production） |
| `VITE_API_BASE_URL` | 非 H5 端的接口基础地址                      |
| `VITE_USE_MOCK`     | `true` 时启用本地 Mock                      |
| `VITE_PROXY_TARGET` | H5 开发代理目标                             |

- H5 开发环境固定使用 `/api` + Vite 代理，规避跨域。
- 小程序 / App 使用 `VITE_API_BASE_URL`。
- `.env.test` 默认关闭 Mock，指向测试域名；按实际后端地址修改。

### 别名与自动导入

- `@/` 指向 `src/`，`vite.config.ts` 与 `tsconfig.json` 已同步配置。
- `unplugin-auto-import` 自动导入：`vue`、`pinia`、`vue-i18n` 的 `useI18n`、`@dcloudio/uni-app` 生命周期，以及 `src/hooks`、`src/stores/modules` 下的导出。
- 类型声明输出到 `src/types/auto-imports.d.ts`，已提交到版本库，保证 `type-check` 在首次克隆后仍可运行。

## 核心能力

### 请求封装

入口：`src/utils/request/index.ts`

```ts
import type { UserInfo } from '@/types/api'
import { request, RequestError, cancelRequest } from '@/utils/request'

try {
  const profile = await request<UserInfo>({
    url: '/user/profile',
    method: 'GET',
    loading: true, // true 使用默认文案，字符串为自定义文案
    retry: 1, // 仅网络错误与 5xx 重试
    cancelKey: 'profile', // 相同 key 会取消上一个请求
    showError: true, // 统一错误提示
  })
} catch (error) {
  if (error instanceof RequestError) {
    console.warn(error.code, error.message)
  }
}

cancelRequest('profile')
```

行为约定：

- 业务响应结构 `{ code, message, data }`，`code === 0` 视为成功，其余抛出 `RequestError`。
- `auth !== false` 时自动注入 `Authorization: Bearer <token>`。
- 401 时只发起一次刷新请求，成功后重放等待中的请求；刷新失败清空登录态并触发 `auth:expired`。
- 刷新请求自身带 `skipAuthRefresh`，避免递归。
- 页面卸载或切换查询条件时可调用 `cancelRequest(key)` / `cancelAllRequests()`。

### Pinia 与持久化

- `src/stores/index.ts` 注册 `pinia-plugin-persistedstate`，存储适配器使用 uni storage。
- `user` 模块只持久化 `userInfo / roles / permissions`；Token 通过 `src/utils/auth.ts` 单独读写，避免 store 与 request 循环依赖。
- `app` 模块持久化 `theme / locale / primaryColor`。

### 路由守卫与权限

- 路由元信息集中在 `src/router/routes.ts`，白名单在 `src/router/whitelist.ts`。
- 守卫通过 `uni.addInterceptor` 拦截 `navigateTo / redirectTo / reLaunch / switchTab`。
- 未登录会记录待跳转地址并跳转登录页，登录成功后回跳。
- 元信息支持 `roles`，无权限时提示并中止跳转。

新增受保护页面：

```ts
// src/router/routes.ts
'/subPackages/order/pages/list/index': {
  title: '订单列表',
  requiresAuth: true,
  roles: ['admin']
}
```

页面内判断权限（小程序无可靠的 DOM 指令，统一使用 Hook）：

```ts
const { hasRole, hasPermission } = usePermission()
const isAdmin = computed(() => hasRole('admin'))
```

### 主题与国际化

- 主题通过 CSS 变量实现，`app-page` 组件承载 `theme-light / theme-dark` 类与主色变量。
- 切换主题调用 `useTheme().toggleTheme()`，会同步页面背景、导航栏与 TabBar；导航栏 / TabBar 在 H5、小程序、App 上的 API 差异已做特性判断。
- H5 的导航栏与 TabBar 额外提供深色样式兜底，避免首次加载、刷新时出现浅色闪烁。
- 语言包位于 `src/locales/lang/*.json5`，新增文案后在页面使用 `$t('key')` 或 `useI18n().t('key')`。
- 小程序禁止 `eval` / `new Function`，因此 i18n 在构建期预编译为 JIT AST，运行时不编译模板。
- `vite.config.ts` 中的 `__INTLIFY_JIT_COMPILATION__: true` 是 vue-i18n 9 读取 JIT AST 的必要开关，请勿删除。

### Hooks

| Hook            | 说明                                                              |
| --------------- | ----------------------------------------------------------------- |
| `useRequest`    | 单次请求，`data / loading / error / run / refresh`                |
| `usePaging`     | 分页列表，`list / loading / hasMore / loadMore / reset / refresh` |
| `useCountDown`  | 倒计时，`remaining / counting / formatted / start / stop / reset` |
| `usePermission` | `hasRole / hasPermission`，支持字符串或数组                       |
| `useTheme`      | 主题状态、切换、主色设置、`applyTheme`                            |
| `useLocale`     | 语言状态与切换                                                    |

### 全局 Loading / Toast 与 $utils

- `src/utils/ui.ts` 提供 `showLoading / hideLoading / showToast / showError / sleep`，Loading 使用计数器避免重复关闭。
- `src/plugins/index.ts` 将 `auth / storage / ui` 挂载到 `uni.$utils`，类型声明在 `src/types/global.d.ts`：

```ts
const token = uni.$utils.auth.getToken()
uni.$utils.ui.showToast('操作成功')
```

### Mock

- `src/mock/index.ts` 按 URL 注册路由，`VITE_USE_MOCK=true` 时请求层直接走 Mock，不发送真实网络请求。
- 已内置登录、刷新、用户信息、商品分页、订单分页。
- 演示页支持「模拟 Token 过期并并发请求」，用于验证 401 单飞刷新。

## 多端适配

### TabBar 与分包

- `pages.json` 配置两个 TabBar 页面：`pages/index/index`、`pages/mine/index`（默认纯文字，不依赖图标资源）。
- 分包：`subPackages/goods`、`subPackages/order`、`subPackages/demo`。
- `preloadRule`：首页预下载商品分包，「我的」预下载订单与演示分包。
- TabBar 页面之间跳转必须使用 `uni.switchTab`，模板中已处理。
- 需要图标时，在 `src/static/tabbar/` 放置 PNG，并为每个 Tab 增加 `iconPath` / `selectedIconPath`（建议 81x81，40KB 以内）。

### 条件编译

统一封装在 `src/utils/platform.ts`：

```ts
// #ifdef H5
runtimePlatform = 'h5'
// #endif
// #ifdef MP-WEIXIN
runtimePlatform = 'mp-weixin'
// #endif
// #ifdef APP-PLUS
runtimePlatform = 'app'
// #endif
```

规范：

- `#ifdef / #ifndef` 必须独立成行，可用于 JS/TS、样式、模板、`pages.json`、`manifest.json`。
- 平台判断统一走 `platform` 与 `getPlatformLabel()`，不要在业务代码里散落平台字符串。
- 微信端专属配置（例如 `permission`、`lazyCodeLoading`）放在 `manifest.json` 的 `mp-weixin` 节点；实测放在 `pages.json` 不会写入 `app.json`。

### 多环境

```bash
pnpm build:h5:test
pnpm build:mp-weixin:test
```

构建时通过 `--mode test` 读取 `.env.test`。已验证测试构建产物中的接口地址来自 `.env.test`。

### App 与 HBuilderX

1. 在 `manifest.json` 中填写 DCloud `appid`（当前为空）。
2. 真机调试：`pnpm dev:app`，用 HBuilderX 导入 `dist/dev/app`，连接手机运行。
3. 发行打包：`pnpm build:app`，用 HBuilderX 导入 `dist/build/app`，执行云打包或本地打包。
4. 首次打包需在 HBuilderX 中配置 Android 包名、证书、iOS 证书与描述文件。
5. 日常开发仍在 VSCode + CLI，HBuilderX 只承担 App 真机与打包。

## VSCode + 微信开发者工具

1. 执行 `pnpm dev:mp-weixin`，产物输出到 `dist/dev/mp-weixin`。
2. 微信开发者工具选择「导入项目」，目录指向 `dist/dev/mp-weixin`。
3. AppID 可先用测试号，或在 `src/manifest.json` 的 `mp-weixin.appid` 填入真实 AppID。
4. 本地联调后端时勾选「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」。
5. 修改代码后小程序产物会自动重新编译，微信开发者工具会自动刷新。

正式构建使用 `pnpm build:mp-weixin`，导入 `dist/build/mp-weixin` 上传。

## UI 组件库集成

模板不内置 UI 库，按需选择其一：

| 组件库                 | 安装                       | easycom 规则                                               |
| ---------------------- | -------------------------- | ---------------------------------------------------------- |
| wot-design-uni（推荐） | `pnpm add wot-design-uni`  | `"^wd-(.*)": "wot-design-uni/components/wd-$1/wd-$1.vue"`  |
| uv-ui                  | `pnpm add @climblee/uv-ui` | `"^uv-(.*)": "@climblee/uv-ui/components/uv-$1/uv-$1.vue"` |
| uview-plus             | `pnpm add uview-plus`      | `"^u-(.*)": "uview-plus/components/u-$1/u-$1.vue"`         |

以 wot-design-uni 为例，在 `pages.json` 中增加：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^wd-(.*)": "wot-design-uni/components/wd-$1/wd-$1.vue"
    }
  }
}
```

uview-plus 还需在 `src/main.ts` 中 `app.use(uviewPlus)` 并引入其样式，具体以组件库文档为准。

## 可选高级能力

模板在 `src/services/` 下提供三个可选扩展入口，默认不与业务耦合：

- `services/websocket/index.ts`：`createWebSocket()`，支持心跳、断线重连、消息与状态订阅。
- `services/update/index.ts`：`setupMiniProgramUpdate()`，在 `App.vue` 的 `onLaunch` 调用即可启用小程序更新提示。
- `services/report/index.ts`：`setReporter()` 注入埋点实现，`reportEvent()` / `reportError()` 统一上报。

示例：

```ts
import { createWebSocket } from '@/services/websocket'

const socket = createWebSocket({
  url: 'wss://example.com/ws',
  heartbeatInterval: 30000,
})

socket.onMessage((data) => console.info(data))
socket.connect()
```

其他可按需接入：

- UnoCSS：在 `vite.config.ts` 增加 UnoCSS 插件，小程序端需选用兼容 uni-app 的 preset，并按端验证样式产物。
- App 热更新 / 整包更新：接入 uni-upgrade-center 或 `plus.runtime`，模板只内置了小程序更新提示。
- 隐私合规：发布前在微信公众平台配置「用户隐私保护指引」，涉及隐私接口时按微信官方流程补充授权弹窗。
- 请求重试与刷新策略集中在一处，接入真实后端时只需保证响应结构为 `{ code, message, data }`。

## 可运行验证步骤

1. 安装与静态检查：

   ```bash
   pnpm install
   pnpm lint
   pnpm lint:style
   pnpm type-check
   ```

2. H5 验证：

   ```bash
   pnpm dev:h5
   ```

   - 首页显示「运行平台 h5」，底部有「首页 / 我的」Tab。
   - 点击「分包商品」加载商品列表并可「加载更多」。
   - 未登录点击「我的」会跳转登录页；登录后回跳。
   - 使用 `admin / 123456` 登录后可进入「订单列表（管理员）」。
   - 使用 `user / 123456` 登录后点击订单入口，提示无访问权限。
   - 切换深色主题、切换英文，刷新后状态保持。

3. 小程序验证：

   ```bash
   pnpm dev:mp-weixin
   ```

   微信开发者工具导入 `dist/dev/mp-weixin`，重复上述登录、分包、主题与语言流程。

4. 测试环境构建：

   ```bash
   pnpm build:h5:test
   pnpm build:mp-weixin:test
   ```

5. 演示页（能力演示分包）额外覆盖：请求取消、分页、倒计时、权限隐藏、Token 过期并发刷新。

## 开始新项目

1. 修改 `package.json` 的 `name`、`src/manifest.json` 的 `name` 与 `appid`、`src/pages.json` 的标题、`.env*` 中的标题与接口地址。
2. 删除不需要的分包与示例页面，并同步更新 `pages.json` 与 `router/routes.ts`。
3. 执行 `pnpm install`，按上文「可运行验证步骤」逐项确认。

## 常见问题

### 小程序里 i18n 报错或文案不显示

小程序禁止动态编译模板，模板已使用构建期 JIT AST。请确认：

- 语言包仍为 `*.json5`（内容为标准 JSON），不要把扩展名改回 `.json`，否则 Vite JSON 插件会再次解析预编译产物。
- `vite.config.ts` 保留 `define: { __INTLIFY_JIT_COMPILATION__: true }`。
- `@intlify/shared` 与 `@intlify/message-compiler` 的 overrides 保持 `9.14.5`。

### H5 切换主题报 `uni.setBackgroundColor is not a function`

H5 不提供该 API，`useTheme` 已做特性判断；自定义主题逻辑时请沿用同样的能力检测。

### 依赖安装后版本被提升

Vue、Vite、uni-app 之间存在精确 peer 约束，模板使用固定版本并配合 `pnpm.overrides`。不要单独升级其中一个包。

### TabBar 没有图标

默认使用纯文字 TabBar，避免模板依赖二进制资源。需要图标时按「TabBar 与分包」一节的约定补充 `static/tabbar` 资源。

### 小程序请求失败

开发环境确认：

- `VITE_USE_MOCK=true` 时不会发真实请求，先关闭 Mock。
- 微信开发者工具勾选「不校验合法域名」。
- 真机调试需要 HTTPS 域名并在小程序后台配置 request 合法域名。

### Token 刷新导致页面重复跳转

刷新失败会清空登录态并触发 `auth:expired`，`main.ts` 中统一 `reLaunch` 到登录页。业务侧不要在多个页面重复监听该事件。
