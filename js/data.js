export const siteContent = {
  "hero": {
    "name": "胡耀文",
    "greeting": "你好，我是胡耀文",
    "summary": "AI PM，做面向用户的产品。",
    "introduction": "把产品判断与 AI 实践，整理成手册、Skills 和工具。",
    "belief": "相信产品的价值最终由多少人真的在用来决定。",
    "email": "yaowen_hu@foxmail.com",
    "wechat": "h17345250018",
    "photo": "assets/hero-photo.jpg"
  },
  "experiences": [
  {
    "date": "2026.06.25 — 2026.08.25",
    "company": "潜入梦科技（infiDive）",
    "role": "AI 产品实习生",
    "summary": "面向海外市场的 AI 角色养成 C 端产品，负责成长与经济数值体系：关系与虚拟货币双轨，升级曲线由留存窗口反推，而不是直接拍数值。",
    "points": []
  },
  {
    "date": "2026.06.01 — 2026.06.24",
    "company": "快手 · 商业化事业部",
    "role": "AI 产品实习生",
    "summary": "短剧内容治理场景下的多模态 AI 标注平台建设，负责视频风险定位能力：把审核动作从“通读找错”收敛为“定点核对”。",
    "points": []
  },
  {
    "date": "2026.03 — 2026.05",
    "company": "百度 · 健康业务部",
    "role": "AI 产品实习生",
    "summary": "负责 AI 医院后台的产品规划：把 AI 分导诊、AI 加号等核心能力做成医院可自主配置的形态，用一套产品承接不同医院的差异。",
    "points": []
  },
  {
    "date": "2025.11 — 2026.03",
    "company": "好未来 · 平台产品部",
    "role": "AI 产品实习生",
    "summary": "学而思亲子 APP 家长社区从 0 到 1：覆盖发帖、审核、推荐、搜索等核心模块，用分阶段供给策略解决冷启动。",
    "points": []
  },
  {
    "date": "2025.07 — 2025.11",
    "company": "龙猫数据 · 大客户部",
    "role": "数据产品实习生",
    "summary": "面向头部大模型客户交付多模态数据集，通过流程优化压缩单项目交付周期。",
    "points": []
  }
  ],
  "projects": [
  {
    "title": "AI Product Playbook",
    "description": "AI 产品经理的实践手册：产品判断、Prompt、Skill、Agent 和 AI 工作流沉淀。",
    "url": "https://github.com/yaowenhu-pm/ai-product-playbook"
  },
  {
    "title": "Agent Skills 合集",
    "description": "个人 Agent Skills 集合，Claude Code 即装即用。",
    "url": "https://github.com/yaowenhu-pm/yaowenhu-skills"
  }
  ],
  "elsewhere": [
  {
    "title": "GitHub",
    "description": "开源项目与代码。",
    "url": "https://github.com/yaowenhu-pm"
  },
  {
    "title": "公众号",
    "description": "长文与 AI 实践记录。",
    "qr": "assets/wechat-qr.jpg"
  },
  {
    "title": "小红书",
    "description": "AI 与产品内容分享。",
    "url": "https://www.xiaohongshu.com/user/profile/688f37480000000028027ee6"
  },
  {
    "title": "即刻",
    "description": "日常想法与动态。",
    "url": "https://okjk.co/NsEfZL"
  }
  ],
  "education": {
    "school": "电子科技大学",
    "degree": "行政管理 · 本科 · GPA 3.73/4.0 · 2023.09 — 2027.07"
  },
  "footer": {
    "slogan": "Bet on something, do it."
  },
  "style": {
    "accentColor": "#0c0d10",
    "cardRadius": 14,
    "sectionSpace": 64
  }
};

export const email = siteContent.hero.email;
export const experiences = siteContent.experiences;
export const projects = siteContent.projects;
export { thoughts } from "./thoughts-data.js";

// Kept outside siteContent so the profile editor preserves these translations.
export const englishContent = {
  "nav.label": "Main navigation",
  "nav.brand": "Yaowen Hu",
  "nav.home": "Yaowen Hu · Home",
  "nav.experience": "Experience",
  "nav.work": "Work",
  "nav.thoughts": "Thoughts",
  "theme.label": "Toggle light and dark mode",
  "hero.greeting": {
    "source": "你好，我是胡耀文",
    "translation": "Hi, I'm Yaowen Hu"
  },
  "hero.summary": {
    "source": "AI PM，做面向用户的产品。",
    "translation": "AI product manager, building products for people."
  },
  "hero.introduction": {
    "source": "把产品判断与 AI 实践，整理成手册、Skills 和工具。",
    "translation": "Turning product judgment and AI practice into playbooks, skills, and tools."
  },
  "hero.belief": {
    "source": "相信产品的价值最终由多少人真的在用来决定。",
    "translation": "I believe a product's value comes from how many people actually use it."
  },
  "hero.photo": "Photo of Yaowen Hu",
  "social.label": "Find me elsewhere",
  "social.xiaohongshu": "REDnote",
  "social.wechat": "WeChat",
  "social.jike": "Jike",
  "contact.email": "Email",
  "contact.emailAddress": "Email address",
  "contact.copyEmail": "Copy email",
  "contact.openEmail": "Open mail app",
  "contact.emailHint": "Copy the address and write to me in your preferred mail app.",
  "contact.emailCopied": "Email copied. Paste it into your mail app.",
  "contact.emailFallback": "Press Ctrl/Cmd+C or long-press to copy the selected address.",
  "contact.wechatId": "WeChat ID",
  "contact.copyWechat": "Copy WeChat ID",
  "contact.wechatHint": "Find me on WeChat using this ID.",
  "contact.wechatCopied": "WeChat ID copied.",
  "contact.wechatFallback": "Press Ctrl/Cmd+C or long-press to copy the selected WeChat ID.",
  "education.title": "Education",
  "education.school": {
    "source": "电子科技大学",
    "translation": "University of Electronic Science and Technology of China"
  },
  "education.degree": {
    "source": "行政管理 · 本科 · GPA 3.73/4.0 · 2023.09 — 2027.07",
    "translation": "Public Administration · Undergraduate · GPA 3.73/4.0 · Sep 2023 – Jul 2027"
  },
  "experience.title": "Internships",
  "experiences.0.company": {
    "source": "潜入梦科技（infiDive）",
    "translation": "infiDive"
  },
  "experiences.0.role": {
    "source": "AI 产品实习生",
    "translation": "AI Product Intern"
  },
  "experiences.0.summary": {
    "source": "面向海外市场的 AI 角色养成 C 端产品，负责成长与经济数值体系：关系与虚拟货币双轨，升级曲线由留存窗口反推，而不是直接拍数值。",
    "translation": "Designed progression and economy systems for an AI companion product serving overseas users. Used separate relationship and currency tracks, with progression curves informed by retention windows."
  },
  "experiences.1.company": {
    "source": "快手 · 商业化事业部",
    "translation": "Kuaishou · Commercialization"
  },
  "experiences.1.role": {
    "source": "AI 产品实习生",
    "translation": "AI Product Intern"
  },
  "experiences.1.summary": {
    "source": "短剧内容治理场景下的多模态 AI 标注平台建设，负责视频风险定位能力：把审核动作从“通读找错”收敛为“定点核对”。",
    "translation": "Worked on a multimodal AI annotation platform for short-drama moderation. Designed video risk localization to help reviewers verify flagged moments instead of searching entire videos."
  },
  "experiences.2.company": {
    "source": "百度 · 健康业务部",
    "translation": "Baidu · Healthcare"
  },
  "experiences.2.role": {
    "source": "AI 产品实习生",
    "translation": "AI Product Intern"
  },
  "experiences.2.summary": {
    "source": "负责 AI 医院后台的产品规划：把 AI 分导诊、AI 加号等核心能力做成医院可自主配置的形态，用一套产品承接不同医院的差异。",
    "translation": "Planned an AI hospital administration platform, making AI triage and additional appointment slots configurable so one product could support different hospitals."
  },
  "experiences.3.company": {
    "source": "好未来 · 平台产品部",
    "translation": "TAL Education · Platform Products"
  },
  "experiences.3.role": {
    "source": "AI 产品实习生",
    "translation": "AI Product Intern"
  },
  "experiences.3.summary": {
    "source": "学而思亲子 APP 家长社区从 0 到 1：覆盖发帖、审核、推荐、搜索等核心模块，用分阶段供给策略解决冷启动。",
    "translation": "Built a parent community for the Xueersi parenting app from zero to one, covering posting, moderation, recommendations, and search. Used a phased content supply strategy to address the cold start."
  },
  "experiences.4.company": {
    "source": "龙猫数据 · 大客户部",
    "translation": "Longmao Data · Key Accounts"
  },
  "experiences.4.role": {
    "source": "数据产品实习生",
    "translation": "Data Product Intern"
  },
  "experiences.4.summary": {
    "source": "面向头部大模型客户交付多模态数据集，通过流程优化压缩单项目交付周期。",
    "translation": "Delivered multimodal datasets for leading foundation-model clients and improved workflows to shorten project delivery cycles."
  },
  "work.title": "Work",
  "projects.0.description": {
    "source": "AI 产品经理的实践手册：产品判断、Prompt、Skill、Agent 和 AI 工作流沉淀。",
    "translation": "A practical playbook for AI product managers: product judgment, prompts, skills, agents, and AI workflows."
  },
  "projects.1.title": {
    "source": "Agent Skills 合集",
    "translation": "Agent Skills Collection"
  },
  "projects.1.description": {
    "source": "个人 Agent Skills 集合，Claude Code 即装即用。",
    "translation": "A collection of personal agent skills, ready to install in Claude Code."
  },
  "elsewhere.title": "Find me elsewhere",
  "elsewhere.0.description": {
    "source": "开源项目与代码。",
    "translation": "Open-source projects and code."
  },
  "elsewhere.1.title": {
    "source": "公众号",
    "translation": "WeChat Official Account"
  },
  "elsewhere.1.description": {
    "source": "长文与 AI 实践记录。",
    "translation": "Long-form writing and notes on AI practice."
  },
  "elsewhere.2.title": {
    "source": "小红书",
    "translation": "REDnote"
  },
  "elsewhere.2.description": {
    "source": "AI 与产品内容分享。",
    "translation": "Writing about AI and products."
  },
  "elsewhere.3.title": {
    "source": "即刻",
    "translation": "Jike"
  },
  "elsewhere.3.description": {
    "source": "日常想法与动态。",
    "translation": "Everyday thoughts and updates."
  },
  "thoughts.title": "Thoughts",
  "thoughts.intro": "Selected notes from my WeChat Moments, reflecting on everyday life.",
  "thoughts.empty": "No notes published yet.",
  "thoughts.languageNote": "Notes are published in their original Chinese.",
  "footer.copyright": "© Yaowen Hu",
  "pages.experience.title": "Experience · Yaowen Hu",
  "pages.experience.description": "Yaowen Hu's introduction, education, and internship experience.",
  "pages.work.title": "Work · Yaowen Hu",
  "pages.work.description": "Projects by Yaowen Hu and places to find him online.",
  "pages.thoughts.title": "Thoughts · Yaowen Hu",
  "pages.thoughts.description": "Selected notes and everyday reflections by Yaowen Hu."
};
