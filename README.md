# yaowenhu-pm.github.io

胡耀文的个人主页：**https://yaowenhu-pm.github.io**

零框架、零依赖的静态站，原生 ES Module 直接跑在 GitHub Pages 上。正文由 `build.js` 预渲染进 `index.html`，搜索引擎和不执行 JS 的抓取工具（含各类 AI 工具）也能直接读到内容。设计参考文字优先的极简风格：760px 窄版心、黑白基调、靠留白分区。

## 页面结构

Hero → 教育经历 → 实习经历 → 作品 → 随想 → 在别处找我 → 页脚。导航提供“经历 / 作品 / 随想”，手机端同样可用。

## 目录

| 路径 | 职责 |
|---|---|
| `index.html` | 文档骨架、防闪主题脚本、模块入口；`#app` 内是 `build.js` 生成的预渲染正文，不要手改 |
| `build.js` | 预渲染脚本（零依赖 Node），改完内容后跑 `node build.js` 重新生成 |
| `js/data.js` | 个人资料与作品内容，并统一导出随想数据 |
| `js/thoughts-data.js` | 精选随想数据，由 `js/data.js` 统一导出；独立于个人资料编辑器，避免相互覆盖 |
| `js/components/` | 各区块渲染器（hero、education、experience、projects、elsewhere、footer、header、theme） |
| `js/editor.js` | 可视化编辑器（`?edit=1` 进入，GitHub OAuth 仅限本人） |
| `styles/` | `tokens.css`（设计变量 + 深浅色）→ base → layout → components → responsive |
| `assets/` | 头像、公众号二维码、简历 PDF（与投递版保持一致） |
| `workers/` | Cloudflare Worker：访问计数（Durable Objects）+ 编辑器登录 |

## 本地开发

```bash
python3 -m http.server 4173
```

改过 `js/data.js` 或 `js/components/` 后，必须重新预渲染再提交：

```bash
node build.js
```

提交前检查（详见 AGENTS.md）：

```bash
find js -name '*.js' -print0 | xargs -0 -n1 node --check
git diff --check
```

并在桌面与 375px 视口下人工核对布局、深浅色切换和控制台。

## 部署

- **站点**：推到 `main` 后 GitHub Pages 自动发布。
- **Worker**：改动 `workers/` 后需手动 `npx wrangler deploy`。注意 worker 内有 Origin 白名单与 GitHub 登录白名单，域名或用户名变更时必须同步修改。

## 特性

- 邮件联系：点击“发送邮件”展开邮箱，可复制地址或打开邮件应用；复制受限时可手动选中复制。
- 深浅色模式：默认跟随系统，导航栏按钮手动覆盖并记忆（localStorage）。
- 访问统计：页脚展示总访问 / 今日访问，数据存 Cloudflare Durable Objects。
- 微信号一键复制：带 `execCommand` 降级，兼容微信内置浏览器。

## 更新约定

- 个人资料改动在 `js/data.js`，随想在 `js/thoughts-data.js`，样式改动遵循 `tokens.css` 的变量体系。
- “随想”每条仅有 `id`、原始发表日期 `date`、阅读标题 `title`、原文 `content`。按日期倒序，点击展开全文，全部正文也会预渲染；单条可用 `#note-…` 定位。
- 同步程序和源资料留在本机私有目录。这里只接收经过筛选的公开文字，不保存账号标识、数据库、朋友圈原始记录、互动、图片或同步日志。新增与正文修订都需重新筛选；读取失败不能发布旧快照。
- 新随想发布需同时提交 `js/thoughts-data.js` 与 `node build.js` 生成的 `index.html`。内置 `node --test tests/thoughts.test.mjs` 检查文本转义、公开字段和预渲染；不需要安装依赖。
- 内容或组件改完必须跑 `node build.js`，否则爬虫看到的是旧内容（浏览器里 JS 会重渲染，肉眼发现不了这种不一致）。
- 简历 PDF 与实际投递版本保持一致。
- 每次更新后检查本 README 是否需要同步。
