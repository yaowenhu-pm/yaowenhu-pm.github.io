export const siteContent = {
  "hero": {
    "name": "胡耀文",
    "greeting": "你好，我是胡耀文",
    "meta": "AI 产品经理 · 电子科技大学 · 辅修交互新媒体艺术",
    "summary": "四段 AI 产品实习：在快手做内容治理与智能标注，在百度做医疗 AI 后台，在好未来从 0 到 1 建过 300 万家长在用的社区，在龙猫数据交付过 6 个多模态数据集。热衷 AI Coding，代表作品全部在线可访问。",
    "email": "yaowen_hu@foxmail.com",
    "wechat": "h17345250018",
    "githubUrl": "https://github.com/yaowenhu-pm",
    "resumeUrl": "assets/resume.pdf",
    "photo": "assets/hero-photo.jpg"
  },
  "experiences": [
  {
    "date": "2026.06 — 至今",
    "company": "快手 · 商业化事业部",
    "role": "AI 产品实习生",
    "summary": "审核员逐句对照原文的风险标注链路太慢，我把它重构为「AI 预标注 + 人工校对 + 视频时间轴联动」，两份 PRD 通过评审进入研发，按当前标注量测算预计节降 5 个标注人力。",
    "points": [
      "负责 Stella 智能标注平台建设与对内宣讲：AI 预标注 → 置信度分流 → 人工校准 → 反哺训练的数据飞轮。"
    ]
  },
  {
    "date": "2026.03 — 2026.06",
    "company": "百度 · 健康业务部",
    "role": "AI 产品实习生",
    "summary": "负责「医院通」AI 医院后台：AI 分导诊、AI 加号、智能候诊室等六大能力模块，服务 172 家合作医院。",
    "points": [
      "主导 60w+ 存量病历回传档案中台的 MRD 设计，支撑 Q2 新增 30 万健康档案。"
    ]
  },
  {
    "date": "2025.11 — 2026.03",
    "company": "好未来 · 平台产品部",
    "role": "AI 产品实习生",
    "summary": "学而思亲子 APP 家长社区从 0 到 1：完成 8 个大版本迭代，覆盖 300w+ 家长用户。",
    "points": [
      "用分阶段供给策略和 30 位种子家长解决社区冷启动。"
    ]
  },
  {
    "date": "2025.07 — 2025.11",
    "company": "龙猫数据 · 大客户部",
    "role": "数据产品实习生",
    "summary": "面向腾讯混元大模型交付 6 个多模态数据集，100% 按时交付，单项目周期从 200 人日压缩到 170 人日。",
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
  "education": {
    "school": "电子科技大学",
    "degree": "行政管理 · 本科，辅修交互新媒体艺术 · 2023.09 — 2027.07",
    "detail": "GPA 3.73/4.0 · 国创赛省级金奖 · 职业规划大赛省级银奖"
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

export const githubUrl = siteContent.hero.githubUrl;
export const email = siteContent.hero.email;
export const experiences = siteContent.experiences;
export const projects = siteContent.projects;
