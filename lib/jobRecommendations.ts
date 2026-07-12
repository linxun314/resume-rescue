/**
 * 专业-岗位推荐映射系统
 * 基于专业关键词匹配推荐相关岗位方向
 */

// 岗位推荐接口定义
export interface JobRecommendation {
  title: string;
  tags: string[];
}

// 专业-岗位映射表（覆盖30+常见专业）
export const MAJOR_JOB_MAPPING: Record<string, JobRecommendation[]> = {
  // 计算机类
  '计算机': [
    { title: '前端开发工程师', tags: ['React', 'Vue', 'JavaScript', 'TypeScript'] },
    { title: '后端开发工程师', tags: ['Java', 'Python', 'Go', 'Node.js'] },
    { title: '全栈开发工程师', tags: ['前后端', '独立开发', '技术栈广'] },
    { title: '算法工程师', tags: ['机器学习', '深度学习', '数据挖掘'] },
  ],
  '软件工程': [
    { title: '软件开发工程师', tags: ['Java', 'Python', 'C++'] },
    { title: '测试开发工程师', tags: ['自动化测试', '性能测试', '测试框架'] },
    { title: 'DevOps工程师', tags: ['CI/CD', 'Docker', 'K8s'] },
  ],
  '人工智能': [
    { title: 'AI算法工程师', tags: ['深度学习', 'CV', 'NLP'] },
    { title: '数据科学家', tags: ['机器学习', '数据分析', '建模'] },
    { title: 'AI产品经理', tags: ['AI落地', '需求分析', '技术理解'] },
  ],

  // 设计类
  '设计': [
    { title: 'UI设计师', tags: ['界面设计', 'Figma', 'Sketch'] },
    { title: 'UX设计师', tags: ['用户体验', '交互设计', '用户研究'] },
    { title: '视觉设计师', tags: ['品牌设计', '运营设计', '插画'] },
    { title: '产品设计师', tags: ['全链路设计', '用户增长', '设计思维'] },
  ],
  '视觉传达': [
    { title: '平面设计师', tags: ['海报', 'Logo', '品牌'] },
    { title: '品牌设计师', tags: ['品牌策略', '视觉系统', '品牌升级'] },
    { title: '包装设计师', tags: ['产品包装', '礼盒设计', '印刷'] },
  ],
  '数字媒体': [
    { title: '动效设计师', tags: ['AE', '动效', '交互'] },
    { title: '视频设计师', tags: ['剪辑', '后期', '短视频'] },
    { title: '游戏UI设计师', tags: ['游戏界面', '图标', '特效'] },
  ],

  // 商科类
  '金融': [
    { title: '金融分析师', tags: ['行业研究', '财务分析', '估值建模'] },
    { title: '投资助理', tags: ['尽调', '投后管理', '行业研究'] },
    { title: '银行客户经理', tags: ['客户维护', '产品销售', '风险控制'] },
  ],
  '会计': [
    { title: '审计助理', tags: ['审计底稿', '财务核查', '内控测试'] },
    { title: '财务专员', tags: ['账务处理', '税务申报', '财务报表'] },
    { title: '成本会计', tags: ['成本核算', '预算管理', '费用控制'] },
  ],
  '市场营销': [
    { title: '市场专员', tags: ['活动策划', '品牌推广', '渠道管理'] },
    { title: '新媒体运营', tags: ['内容策划', '用户增长', '社群运营'] },
    { title: '品牌营销', tags: ['品牌策略', '广告投放', '公关传播'] },
  ],
  '工商管理': [
    { title: '管培生', tags: ['轮岗培养', '综合能力', '管理潜力'] },
    { title: '运营管理', tags: ['流程优化', '数据分析', '团队协调'] },
    { title: '项目助理', tags: ['项目跟进', '协调沟通', '进度管理'] },
  ],
  '人力资源': [
    { title: 'HR助理', tags: ['招聘', '培训', '员工关系'] },
    { title: '招聘专员', tags: ['简历筛选', '面试安排', '人才库'] },
    { title: '薪酬绩效专员', tags: ['薪酬核算', '绩效管理', '社保公积金'] },
  ],

  // 文科类
  '中文': [
    { title: '内容运营', tags: ['文案写作', '内容策划', '编辑'] },
    { title: '新媒体编辑', tags: ['公众号', '小红书', '短视频文案'] },
    { title: '文案策划', tags: ['广告文案', '活动文案', '品牌故事'] },
  ],
  '新闻': [
    { title: '新媒体运营', tags: ['内容策划', '热点追踪', '用户增长'] },
    { title: '公关专员', tags: ['新闻稿', '舆情监测', '媒体关系'] },
    { title: '短视频编导', tags: ['脚本', '拍摄', '后期'] },
  ],
  '英语': [
    { title: '英语运营', tags: ['内容翻译', '海外运营', '本地化'] },
    { title: '跨境电商运营', tags: ['亚马逊', 'Shopee', '选品'] },
    { title: '外贸专员', tags: ['客户开发', '跟单', '报关'] },
  ],

  // 工科类
  '机械': [
    { title: '机械工程师', tags: ['SolidWorks', 'CAD', '结构设计'] },
    { title: '工艺工程师', tags: ['工艺优化', '生产流程', '质量控制'] },
    { title: '设备工程师', tags: ['设备维护', '自动化', '产线优化'] },
  ],
  '电气': [
    { title: '电气工程师', tags: ['电路设计', 'PLC', '自动化'] },
    { title: '硬件工程师', tags: ['PCB设计', '嵌入式', '单片机'] },
    { title: '新能源工程师', tags: ['光伏', '储能', '电力电子'] },
  ],
  '土木': [
    { title: '结构工程师', tags: ['结构计算', 'PKPM', 'CAD'] },
    { title: '施工管理', tags: ['现场管理', '进度控制', '质量监督'] },
    { title: '造价工程师', tags: ['工程造价', '预算编制', '结算审核'] },
  ],

  // 理科类
  '数学': [
    { title: '数据分析师', tags: ['Python', 'SQL', '数据可视化'] },
    { title: '算法工程师', tags: ['机器学习', '优化算法', '数学建模'] },
    { title: '精算师', tags: ['保险', '风险评估', '统计建模'] },
  ],
  '统计': [
    { title: '数据分析师', tags: ['数据分析', '统计建模', 'BI工具'] },
    { title: '商业分析师', tags: ['业务分析', '指标体系', '策略建议'] },
    { title: '风控建模', tags: ['信用评分', '反欺诈', '风险定价'] },
  ],

  // 医学类
  '临床医学': [
    { title: '临床医生', tags: ['规培', '住院医师', '临床技能'] },
    { title: '医学编辑', tags: ['医学内容', '科普写作', '学术论文'] },
    { title: '医学联络官', tags: ['学术推广', 'KOL管理', '医学教育'] },
  ],
  '护理': [
    { title: '临床护士', tags: ['护理技能', '患者管理', '急救'] },
    { title: '护理管理', tags: ['质量管理', '护理培训', '流程优化'] },
    { title: '健康管理师', tags: ['健康评估', '慢病管理', '健康教育'] },
  ],
  '药学': [
    { title: '药物研发', tags: ['临床前研究', '药效学', '安全性评价'] },
    { title: '注册专员', tags: ['药品注册', '法规事务', '申报材料'] },
    { title: '医药代表', tags: ['产品推广', '客户管理', '学术会议'] },
  ],

  // 艺术类
  '动画': [
    { title: '动画师', tags: ['3D动画', '角色动画', '特效'] },
    { title: '游戏美术', tags: ['角色建模', '场景建模', '贴图'] },
    { title: '分镜师', tags: ['故事板', '镜头语言', '动态设计'] },
  ],
  '音乐': [
    { title: '音乐制作', tags: ['编曲', '混音', '作曲'] },
    { title: '音乐运营', tags: ['版权', '艺人经纪', '演出策划'] },
    { title: '音频工程师', tags: ['录音', '声音设计', '音频后期'] },
  ],

  // 法学类
  '法学': [
    { title: '律师助理', tags: ['法律检索', '文书起草', '案件跟进'] },
    { title: '法务专员', tags: ['合同审核', '合规管理', '知识产权'] },
    { title: '知识产权专员', tags: ['专利申请', '商标注册', '版权'] },
  ],

  // 教育类
  '教育': [
    { title: '课程顾问', tags: ['课程销售', '需求分析', '学习规划'] },
    { title: '教研专员', tags: ['课程研发', '教材编写', '教学设计'] },
    { title: '教育运营', tags: ['用户增长', '社群运营', '活动策划'] },
  ],

  // 其他热门方向
  '电子商务': [
    { title: '电商运营', tags: ['店铺运营', '活动策划', '数据分析'] },
    { title: '电商产品经理', tags: ['需求分析', '产品设计', '数据分析'] },
    { title: '直播运营', tags: ['直播策划', '主播管理', '数据分析'] },
  ],
  '物流': [
    { title: '物流专员', tags: ['仓储', '配送', '供应链'] },
    { title: '供应链管理', tags: ['采购', '库存管理', '供应商管理'] },
  ],
  '旅游': [
    { title: '旅游顾问', tags: ['行程规划', '客户服务', '产品设计'] },
    { title: '酒店管理', tags: ['前厅', '客房', '收益管理'] },
  ],
};

/**
 * 根据专业推荐相关岗位
 * 支持精确匹配、模糊匹配、关键词匹配
 */
export function recommendJobs(major: string): JobRecommendation[] {
  if (!major || major.trim().length === 0) {
    return [];
  }

  const normalizedMajor = major.toLowerCase().trim();

  // 1. 精确匹配
  for (const [key, jobs] of Object.entries(MAJOR_JOB_MAPPING)) {
    if (normalizedMajor === key.toLowerCase()) {
      return jobs;
    }
  }

  // 2. 模糊匹配（包含关系）
  for (const [key, jobs] of Object.entries(MAJOR_JOB_MAPPING)) {
    if (normalizedMajor.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedMajor)) {
      return jobs;
    }
  }

  // 3. 关键词匹配
  const keywordMapping: Record<string, string[]> = {
    '计算机': ['计算机', '计科', 'CS', '软件', '信息', 'IT', '互联网'],
    '设计': ['设计', '艺术', '美术', '视觉', '数媒', '创意'],
    '金融': ['金融', '财经', '经济', '银行', '投资', '证券'],
    '市场': ['市场', '营销', '推广', '品牌', '广告'],
    '管理': ['管理', '工商', '人力', '行政', '运营'],
    '语言': ['英语', '日语', '翻译', '外语', '语言'],
    '工程': ['工程', '机械', '电气', '土木', '建筑', '自动化'],
    '医学': ['医学', '临床', '护理', '药学', '卫生', '健康'],
    '数据': ['数据', '统计', '数学', '分析', '大数据'],
    '法律': ['法律', '法学', '法务', '合规', '知识产权'],
    '教育': ['教育', '师范', '教学', '课程', '培训'],
    '电商': ['电商', '商务', '贸易', '国际', '跨境'],
  };

  for (const [category, keywords] of Object.entries(keywordMapping)) {
    if (keywords.some(kw => normalizedMajor.includes(kw.toLowerCase()))) {
      // 找到包含该关键词的专业
      for (const [key, jobs] of Object.entries(MAJOR_JOB_MAPPING)) {
        if (key.includes(category) || category.includes(key)) {
          return jobs;
        }
      }
    }
  }

  // 4. 未匹配到，返回通用岗位
  return [
    { title: '管培生', tags: ['轮岗培养', '综合能力', '管理潜力'] },
    { title: '运营专员', tags: ['内容运营', '用户运营', '活动运营'] },
    { title: '项目助理', tags: ['项目跟进', '协调沟通', '进度管理'] },
    { title: '销售专员', tags: ['客户开发', '商务谈判', '业绩达成'] },
  ];
}

/**
 * 获取所有专业列表（用于搜索提示）
 */
export function getAllMajors(): string[] {
  return Object.keys(MAJOR_JOB_MAPPING);
}
