# yaowenhu-pm.github.io

胡耀文的个人主页：**https://yaowenhu-pm.github.io**

零框架、零构建的静态站，原生 ES Module 直接跑在 GitHub Pages 上。设计参考文字优先的极简风格：760px 窄版心、黑白基调、靠留白分区。

## 页面结构

Hero（照片 + 简历 / GitHub / 邮件 / 微信四个入口）→ 教育经历 → 实习经历 → 作品 → 在别处找我（公众号 / 小红书 / 即刻）→ 页脚。

## 目录

| 路径 | 职责 |
|---|---|
| `index.html` | 文档骨架、防闪主题脚本、模块入口 |
| `js/data.js` | 全部展示内容——改文案只动这个文件 |
| `js/components/` | 各区块渲染器（hero、education、experience、projects、elsewhere、footer、header、theme） |
| `js/editor.js` | 可视化编辑器（`?edit=1` 进入，GitHub OAuth 仅限本人） |
| `styles/` | `tokens.css`（设计变量 + 深浅色）→ base → layout → components → responsive |
| `assets/` | 头像、公众号二维码、简历 PDF（与投递版保持一致） |
| `workers/` | Cloudflare Worker：访问计数（Durable Objects）+ 编辑器登录 |

## 本地开发

```bash
python3 -m http.server 4173
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

- 深浅色模式：默认跟随系统，导航栏按钮手动覆盖并记忆（localStorage）。
- 访问统计：页脚展示总访问 / 今日访问，数据存 Cloudflare Durable Objects。
- 微信号一键复制：带 `execCommand` 降级，兼容微信内置浏览器。

## 更新约定

- 内容改动只动 `js/data.js`，样式改动遵循 `tokens.css` 的变量体系。
- 简历 PDF 与实际投递版本保持一致。
- 每次更新后检查本 README 是否需要同步。
