/* ============================================================
   models-data.js —— 跨学科思维模型格栅库核心数据源 (44 项模型全集)
   严格映射《思考的框架》（1-3卷）与思考与判断体系各层级
   ============================================================ */
window.THINKING_MODELS = [
    /* 1-9 通用思维 */
    {
      id: 1, name: '地图不等于疆域', en: 'The Map is Not the Territory',
      disc: 'general', discName: '通用思维', layer: 'L1', layerUrl: 'critical-thinking.html',layerName: 'L1 认知原则',
      attr: 'meta', attrName: '认知隐喻',
      desc: '任何模型、报表、框架都只是对现实的简化与抽象投影，绝非现实本身。',
      trigger: '当你过于自信地依据数据报表、PPT 架构图或理论公式做决策，而与一线员工的实际体感出现割裂时。',
      boundary: '不能走向不可知论。地图虽非疆域，但好地图仍是不可或缺的降维工具；关键是时刻意识到其比例尺和省略项。'
    },
    {
      id: 2, name: '能力圈', en: 'Circle of Competence',
      disc: 'general', discName: '通用思维', layer: 'L0', layerUrl: 'metacognition.html',layerName: 'L0 元层自省',
      attr: 'meta', attrName: '认知隐喻',
      desc: '明确区分“真正懂（知道内部因果机制与边界）”与“自以为懂（仅仅知道名词与结论）”的界限。',
      trigger: '面临重大资源投入、跨界重大决策，或情绪激昂想要发表确定性高见时。',
      boundary: '能力圈不是封闭保守的借口。圈内做决策，圈边缘做探索；坚决避免把某一领域的专业声誉盲目外推到无关领域。'
    },
    {
      id: 3, name: '第一性原理', en: 'First Principles Thinking',
      disc: 'general', discName: '通用思维', layer: 'L1', layerUrl: 'critical-thinking.html',layerName: 'L1 认知原则',
      attr: 'hard', attrName: '硬因果机制',
      desc: '拒绝类比与习俗经验，将事物剥离至不可再拆的基本物理事实，再由底向上重新推导构建。',
      trigger: '面临行业顽疾、成本居高不下、所有人都说“历来如此”但直觉存在巨大优化空间时。',
      boundary: '认知成本极高。常规日常决策若处处套用会导致决策瘫痪；应主要用于战略枢纽与颠覆性创新突破。'
    },
    {
      id: 4, name: '思想实验', en: 'Thought Experiment',
      disc: 'general', discName: '通用思维', layer: 'L1', layerUrl: 'critical-thinking.html',layerName: 'L1 认知原则',
      attr: 'hard', attrName: '硬因果机制',
      desc: '在大脑中构建极端受控场景（如爱因斯坦追光、电车难题），推演逻辑自洽性与极限状态。',
      trigger: '物理实验成本过高、道德伦理无法直接测试，或需要检验某个假说在极端边界下是否依然成立时。',
      boundary: '严密性受限于直觉偏见。若前提假设暗含了未经审视的偏见，推导出的只会是荒谬但自圆其说的结论。'
    },
    {
      id: 5, name: '二阶思维', en: 'Second-Order Thinking',
      disc: 'general', discName: '通用思维', layer: 'L4', layerUrl: 'notes.html',layerName: 'L4 工程闭环',
      attr: 'hard', attrName: '硬因果机制',
      desc: '超越“这样做立刻会得到什么（一阶）”，持续追问“然后呢？接下来会引发什么连锁反应（二阶及更高阶）？”',
      trigger: '制定考核制度、实施价格战、进行政策干预或短期解决看似简单的痛点时。',
      boundary: '谨防无限推演导致的发散与焦虑。一般聚焦于二阶和三阶的核心利益相关方博弈即可有效收敛。'
    },
    {
      id: 6, name: '概率思维与贝叶斯更新', en: 'Probabilistic Thinking',
      disc: 'general', discName: '通用思维', layer: 'L5', layerUrl: 'judgment-system.html',layerName: 'L5 风险判断',
      attr: 'hard', attrName: '硬因果机制',
      desc: '放弃非黑即白的确定性幻想；当获得新证据时，按照证据强度动态调整先验概率（信念修正）。',
      trigger: '信息不完全的商业竞争、投资决策，或遭遇新事实打脸需要调整原有信念时。',
      boundary: '基率忽略陷阱。人们往往过度关注眼前的显性个案，而忽视了底层基础概率；肥尾世界中概率极值计算易失灵。'
    },
    {
      id: 7, name: '逆向思维', en: 'Inversion',
      disc: 'general', discName: '通用思维', layer: 'L4', layerUrl: 'notes.html',layerName: 'L4 工程防错',
      attr: 'hard', attrName: '硬因果机制',
      desc: '“倒过来想，总是倒过来想”。与其苦思“如何成功”，不如系统列出“怎样做会必然导致灾难”并全力封堵。',
      trigger: '重大项目启动前风险评审（事前验尸）、制定长期准则或遇到正面强攻无法突破的死局时。',
      boundary: '避开所有错误并不自动等于成功，逆向思维负责兜底与生存，仍需结合正向战略牵引。'
    },
    {
      id: 8, name: '奥卡姆剃刀', en: "Occam's Razor",
      disc: 'general', discName: '通用思维', layer: 'L1', layerUrl: 'critical-thinking.html',layerName: 'L1 认知原则',
      attr: 'meta', attrName: '认知隐喻',
      desc: '“若无必要，勿增实体”。面对解释力同等有效的多个假设，优先选择假设前提最少、最简洁的一个。',
      trigger: '面对阴谋论、过度复杂化的汇报包装或逻辑过于曲折的归因分析时。',
      boundary: '简洁不等于简单（Simple, but not simpler）。如果一个现象本质上就是复杂的非线性系统，强行削足适履属于偷懒。'
    },
    {
      id: 9, name: '汉隆剃刀', en: "Hanlon's Razor",
      disc: 'general', discName: '通用思维', layer: 'L0', layerUrl: 'metacognition.html',layerName: 'L0 元层自校准',
      attr: 'meta', attrName: '认知隐喻',
      desc: '能用愚蠢、疏忽、疲劳或认知差异解释的行为，切勿归咎为深谋远虑的恶意。',
      trigger: '同事出现失误影响合作、跨部门协作受阻或遭遇看似针对自己的挑衅行为时。',
      boundary: '防人之心不可无。当某种行为反复出现且持续带来不对称利益倾斜时，系统性利益驱动与恶意依然存在。'
    },

    /* 10-16 物理学 */
    {
      id: 10, name: '相对性', en: 'Relativity',
      disc: 'physics', discName: '物理学', layer: 'L1', layerUrl: 'critical-thinking.html',layerName: 'L1 认知原则',
      attr: 'meta', attrName: '认知隐喻',
      desc: '观测结果严格依赖于观测者所处的参考系，不存在凌驾于一切之上的孤立绝对视角。',
      trigger: '出现无法调和的观点分歧、跨文化跨阶层沟通，或试图评价某一政策的“好坏”时。',
      boundary: '不要滑向彻底的虚无主义。物理上的参考系虽不同，但物理规律在所有参考系中形式一致；寻找跨坐标系的不变量才是关键。'
    },
    {
      id: 11, name: '互惠与反作用力', en: 'Reciprocity / Newton\'s Third Law',
      disc: 'physics', discName: '物理学', layer: 'L3', layerUrl: 'discussion-baseline.html',layerName: 'L3 讨论机制',
      attr: 'meta', attrName: '认知隐喻',
      desc: '作用力与反作用力大小相等、方向相反。施加的外力必然在社会网络中激发同等强度的反向抵抗或回馈。',
      trigger: '管理上强行推行新规、谈判中极限施压，或在社群中建立长效合作信任时。',
      boundary: '社会系统存在时间延迟与非对称缓冲，反作用力往往不是瞬间在原地爆发，而是以被动怠工或信誉损耗滞后出现。'
    },
    {
      id: 12, name: '速度 vs 速率', en: 'Velocity vs. Speed',
      disc: 'physics', discName: '物理学', layer: 'L4', layerUrl: 'notes.html',layerName: 'L4 工程闭环',
      attr: 'hard', attrName: '硬因果机制',
      desc: '速率只有快慢大小（标量），速度则同时包含大小与矢量方向。方向错误时，速率越高，离目标越远。',
      trigger: '团队天天加班赶进度但战略方向模糊、个人陷入战术忙碌却无实质战略产出时。',
      boundary: '过度纠结方向会导致行动瘫痪。在方向不完全明朗时，以小步快跑（小速率试错）来探索方向，好过原地空想。'
    },
    {
      id: 13, name: '惯性与动量', en: 'Inertia & Momentum',
      disc: 'physics', discName: '物理学', layer: 'L2-time', layerUrl: 'systems-thinking.html',layerName: 'L2 动态演构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '物体具有保持当前运动状态的性质；改变状态必须施加持续外力；质量越大，惯性与动量越大。',
      trigger: '推行大型组织架构调整、个人破除坏习惯，或启动一款冷启动产品时。',
      boundary: '惯性阻碍变革时是负资产，但在形成“飞轮效应”后则是壁垒。启动时要集中全力击穿阻力，之后靠自转维系。'
    },
    {
      id: 14, name: '摩擦力与黏度', en: 'Friction and Viscosity',
      disc: 'physics', discName: '物理学', layer: 'L2-time', layerUrl: 'systems-thinking.html',layerName: 'L2 动态演构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '相对运动界面上消耗有效能量的阻力；黏度反映流体内部抵抗形变的能力。',
      trigger: '审批流程冗长、协同沟通成本吞噬产出、转化漏斗各环节流失严重时。',
      boundary: '消除阻力往往比加大推力更高效。但并非所有摩擦力都是坏事：核心风控、重大决策需要适度的主动“工程摩擦力”。'
    },
    {
      id: 15, name: '杠杆原理', en: 'Leverage',
      disc: 'physics', discName: '物理学', layer: 'L2-time', layerUrl: 'systems-thinking.html',layerName: 'L2 动态演构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '利用力臂与支点，以微小输入换取巨大输出。现代四大杠杆：资本、劳动力、代码与媒体。',
      trigger: '业务突破天花板、寻求不对称竞争优势、摆脱线性时间出卖模式时。',
      boundary: '阿基米德定律是双刃剑。杠杆放大了收益，同时也等比例放大了风险与损失（如高杠杆爆仓、严重 Bug 影响海量用户）。'
    },
    {
      id: 16, name: '热力学与熵增', en: 'Thermodynamics & Entropy',
      disc: 'physics', discName: '物理学', layer: 'L5', layerUrl: 'judgment-system.html',layerName: 'L5 风险判断',
      attr: 'hard', attrName: '硬因果机制',
      desc: '孤立系统自发从有序走向无序。维持组织与认知系统的秩序，必须持续从外部输入能量（负熵）。',
      trigger: '团队自然沉淀官僚风气、文档库逐渐荒废、个人知识体系日渐散乱无序时。',
      boundary: '混乱是物理自然规律而非犯错。必须建立日常的定期重构机制（清理负资产、重构笔记），将其视为必要的新陈代谢成本。'
    },

    /* 17-19 化学 */
    {
      id: 17, name: '活化能', en: 'Activation Energy',
      disc: 'chemistry', discName: '化学', layer: 'L4', layerUrl: 'notes.html',layerName: 'L4 工程闭环',
      attr: 'meta', attrName: '认知隐喻',
      desc: '触发化学反应所必须跨越的最低能量壁垒。',
      trigger: '面临深度写作、复杂架构设计或开始锻炼等严重拖延行为时。',
      boundary: '不要指望靠意志力硬刚活化能。工程化解法是拆解首步操作（如“只写 50 个字”），人为将初始活化能降到无限接近于零。'
    },
    {
      id: 18, name: '催化剂', en: 'Catalysts',
      disc: 'chemistry', discName: '化学', layer: 'L2-time', layerUrl: 'systems-thinking.html',layerName: 'L2 动态演构',
      attr: 'meta', attrName: '认知隐喻',
      desc: '自身不参与消耗，但能提供新反应路径、大幅降低活化能、成倍加速进程的要素。',
      trigger: '跨部门协作推不动、团队士气低落、业务陷入胶着状态寻找破局支点时。',
      boundary: '催化剂无法让热力学上不可能发生的反应发生。催化剂不能替代底层真实价值，只能加速既定趋势。'
    },
    {
      id: 19, name: '合金效应', en: 'Alloying',
      disc: 'chemistry', discName: '化学', layer: 'L2-space', layerUrl: 'structured-engineering.html',layerName: 'L2 空间解构',
      attr: 'meta', attrName: '认知隐喻',
      desc: '两种或多种金属融合成合金后，抗拉强度、硬度或耐腐蚀性远超单一成分之和。',
      trigger: '设计产品独特卖点、规划个人职业核心竞争力、跨界技能组装时。',
      boundary: '杂质不等于合金。随意拼凑技能只会导致博而不精，合金效应要求各元素之间产生深度协同化学反应。'
    },

    /* 20-24 生物学 */
    {
      id: 20, name: '自然选择与灭绝', en: 'Natural Selection & Extinction',
      disc: 'biology', discName: '生物学', layer: 'L5', layerUrl: 'judgment-system.html',layerName: 'L5 风险判断',
      attr: 'hard', attrName: '硬因果机制',
      desc: '生存下来的往往不是最强壮的，而是最适应环境变化的；剧变期过度特化的物种最先灭绝。',
      trigger: '行业底层逻辑剧变（如 AI 颠覆工种）、企业面临技术代际更替时。',
      boundary: '进化没有崇高的预设方向，只关乎当下适应度。不要把过去的适应当作永恒真理，警惕特化能力成为新牢笼。'
    },
    {
      id: 21, name: '适应率与红皇后效应', en: 'Adaptation Rate & Red Queen Effect',
      disc: 'biology', discName: '生物学', layer: 'L2-time', layerUrl: 'systems-thinking.html',layerName: 'L2 动态演构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '“你必须全力奔跑，才能留在原地”。因为对手与环境都在协同进化，相对优势处于动态贬值中。',
      trigger: '商业模式遭遇竞品像素级跟进、存量业务增长陷入同质化滞胀时。',
      boundary: '不要把全部精力耗在红皇后奔跑上，那只是战术内卷。真正的解法是利用突变或跳入新生态位打破军备竞赛。'
    },
    {
      id: 22, name: '生态系统与生态位', en: 'Ecosystems & Niches',
      disc: 'biology', discName: '生物学', layer: 'L2-space', layerUrl: 'structured-engineering.html',layerName: 'L2 空间解构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '高度互联共生的有机网络；完全相同的两个物种无法长期占据完全相同的生态位。',
      trigger: '企业战略定位、个人职业细分方向选择、平台型业务生态治理时。',
      boundary: '生态位不是静态避难所。随着外部资源供给变化，小生态位可能萎缩，也可能被外来物种入侵；必须时刻观察上下游物种。'
    },
    {
      id: 23, name: '合作与共生', en: 'Cooperation & Symbiosis',
      disc: 'biology', discName: '生物学', layer: 'L3', layerUrl: 'discussion-baseline.html',layerName: 'L3 讨论机制',
      attr: 'hard', attrName: '硬因果机制',
      desc: '互利共生是演化产生复杂性的跃迁引擎，比单纯的零和淘汰具备更长期的系统韧性。',
      trigger: '产业链上下游博弈、合伙人利益分配、对话中把“说服”转为“共同探索”时。',
      boundary: '谨防寄生与剥削。健康的共生必须建立在清晰的权责对等与透明的退出机制上，否则会退化为公地悲剧。'
    },
    {
      id: 24, name: '层级组织与能量最小化', en: 'Hierarchical Organization & Energy Minimization',
      disc: 'biology', discName: '生物学', layer: 'L2-space', layerUrl: 'structured-engineering.html',layerName: 'L2 空间解构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '生物系统演化出树状层级以最小化能耗；生命本能沿着能量消耗最小路径行事（走捷径）。',
      trigger: '组织架构设计、制定制度规则、设计用户产品体验动线时。',
      boundary: '机制设计必须顺应人性惰性，而非妄图逆向压制。若规则违反能量最小化原则，人们必然会自发形成潜规则走捷径。'
    },

    /* 25-35 系统科学 */
    {
      id: 25, name: '反馈回路', en: 'Feedback Loops (R & B)',
      disc: 'systems', discName: '系统科学', layer: 'L2-time', layerUrl: 'systems-thinking.html',layerName: 'L2 动态演构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '增强回路（自我加速滚雪球）与平衡回路（自我纠偏维持目标稳态）的动力学交互。',
      trigger: '分析平台飞轮效应、排查系统失控崩溃、理解为什么某些改革措施推行后被悄然反弹。',
      boundary: '世界上没有无限运行的增强回路，最终必然会撞上某一环境资源的平衡回路限制（成长上限）。'
    },
    {
      id: 26, name: '均衡与动态平衡', en: 'Equilibrium',
      disc: 'systems', discName: '系统科学', layer: 'L2-time', layerUrl: 'systems-thinking.html',layerName: 'L2 动态演构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '处于相互竞争或抵消力量下的系统暂时稳定状态。表面看似平静，底层是持续同等强度的动量对抗。',
      trigger: '供需价格平抑、长期博弈的职场政治平衡、技术架构的稳定态分析。',
      boundary: '打破低效均衡绝不能仅凭主观意愿，必须改变决定均衡的底层力量配比或边界约束。'
    },
    {
      id: 27, name: '瓶颈与约束理论', en: 'Bottlenecks / Theory of Constraints',
      disc: 'systems', discName: '系统科学', layer: 'L2-time', layerUrl: 'systems-thinking.html',layerName: 'L2 动态演构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '系统的最大产出完全取决于最脆弱、吞吐量最小的单一环节；在非瓶颈处的任何优化往往只是徒增库存的伪勤奋。',
      trigger: '业务漏斗转化停滞、全员疲惫忙碌但整体交付延迟、供应链阻塞排查。',
      boundary: '瓶颈漂移法则。一旦当前瓶颈被攻克，系统瓶颈会立即转移到下一个环节，必须动态重新识别。'
    },
    {
      id: 28, name: '规模效应与规模法则', en: 'Scale & Scaling Laws',
      disc: 'systems', discName: '系统科学', layer: 'L2-space', layerUrl: 'structured-engineering.html',layerName: 'L2 空间解构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '系统几何尺寸增大时，其内在属性非线性变化。体积按立方增长而表面积按平方增长，系统支撑结构必须经历相变。',
      trigger: '团队从 10 人扩张到 500 人、单体架构转向微服务分布式、业务跨区域复制。',
      boundary: '规模不一定带来经济性，也可能带来“规模不经济”（协调复杂度按平方级爆炸），必须配套模块化解耦。'
    },
    {
      id: 29, name: '安全边际与冗余', en: 'Margin of Safety & Redundancy',
      disc: 'systems', discName: '系统科学', layer: 'L4', layerUrl: 'notes.html',layerName: 'L4 工程闭环',
      attr: 'hard', attrName: '硬因果机制',
      desc: '针对不可预测的极端载荷、人为计算偏差和偶发故障，提前预留的结构性缓冲带。',
      trigger: '重大资金预算编制、核心系统容灾设计、在不确定环境下做出不可逆承诺。',
      boundary: '冗余是有成本的。过度冗余会降低系统整体敏捷度，关键是区分“可逆风险（允许低冗余）”与“致死风险（顶格安全边际）”。'
    },
    {
      id: 30, name: '流动与更迭', en: 'Churn & Throughput',
      disc: 'systems', discName: '系统科学', layer: 'L2-time', layerUrl: 'systems-thinking.html',layerName: 'L2 动态演构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '存量由流入与流出的动态差额决定。流失率（Churn）决定了水库下限，单纯加大注水无法挽救底部漏水的系统。',
      trigger: 'SaaS 业务续费率复盘、团队员工流失率过高、个人技能半衰期评估。',
      boundary: '警惕表面存量的稳定掩盖了内部结构的质变（如新进人员都是初阶小白，流失的全是骨干核心）。'
    },
    {
      id: 31, name: '临界质量与相变', en: 'Critical Mass & Phase Transition',
      disc: 'systems', discName: '系统科学', layer: 'L2-time', layerUrl: 'systems-thinking.html',layerName: 'L2 动态演构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '系统在未达阈值前表现温和线性，一旦越过临界点便发生突兀且不可逆的形态相变（水结成冰）。',
      trigger: '双边平台冷启动、社会观念演变、技术爆发点预判。',
      boundary: '临界点前放弃是最大浪费；但若因果链不可行，盲目堆砌资源试图越过虚幻的临界质量则是纯粹的沉没成本陷阱。'
    },
    {
      id: 32, name: '涌现', en: 'Emergence',
      disc: 'systems', discName: '系统科学', layer: 'L2-time', layerUrl: 'systems-thinking.html',layerName: 'L2 动态演构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '整体展现出单个组成部分所完全不具备的全新属性与规律（More is Different）。',
      trigger: '大语言模型突破、金融市场集体恐慌、组织集体心智形成。',
      boundary: '无法通过单纯拆解微观要素还原涌现属性。分析复杂系统时，必须在宏观整体和微观机制之间多尺度穿梭。'
    },
    {
      id: 33, name: '复杂自适应系统', en: 'Complex Adaptive Systems',
      disc: 'systems', discName: '系统科学', layer: 'L2-time', layerUrl: 'systems-thinking.html',layerName: 'L2 动态演构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '系统内部主体具备自主学习与适应能力，外部干预会诱发各主体策略调整，产生反直觉的副作用（政策阻抗）。',
      trigger: '制定反垄断政策、设计复杂的 KPI 考核体系、宏观经济调控分析。',
      boundary: '放弃机械钟表式的完全掌控幻想。对复杂系统只能设定底层边界与激励规则，引导其演化，而非微观下场干预。'
    },
    {
      id: 34, name: '边际收益递减', en: 'Law of Diminishing Returns',
      disc: 'systems', discName: '系统科学', layer: 'L2-space', layerUrl: 'structured-engineering.html',layerName: 'L2 空间解构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '在其他要素固定的前提下，持续单向增加某一要素投入，新增产出最终会越过极值并趋于递减。',
      trigger: '代码过度优化、考前死记硬背边际提分、产品功能无度堆砌。',
      boundary: '当边际收益递减至阈值时，必须停止线性的“量增”，转而寻求范式转变或结构性重构。'
    },
    {
      id: 35, name: '混沌动力学与敏感度', en: 'Chaos Dynamics',
      disc: 'systems', discName: '系统科学', layer: 'L5', layerUrl: 'judgment-system.html',layerName: 'L5 风险判断',
      attr: 'hard', attrName: '硬因果机制',
      desc: '确定性非线性系统对初始条件极度敏感（蝴蝶效应）。微小初始误差随时间指数放大，长期确定性预测在物理上不可行。',
      trigger: '做未来 5 年的精细财务预测、天气预报、复杂地缘政治趋势预判。',
      boundary: '混沌不等于随机，混沌系统存在“奇异吸引子”。我们无法预测某天的确切轨迹，但能把握系统的拓扑边界。'
    },

    /* 36-44 数学与逻辑 */
    {
      id: 36, name: '复利效应', en: 'Compounding',
      disc: 'math', discName: '数学逻辑', layer: 'L5', layerUrl: 'judgment-system.html',layerName: 'L5 风险判断',
      attr: 'hard', attrName: '硬因果机制',
      desc: '收益的收益，指数增长引擎。微小的边际增量只要在足够长的时间内保持不中断，后端产出呈断崖式爆发。',
      trigger: '知识体系积累、财务投资、技术信誉复利。',
      boundary: '复利最大的杀手是“中断”和“负增长乘数”。保持系统长期存活不被清零是复利的绝对先决条件。'
    },
    {
      id: 37, name: '抽样与代表性偏差', en: 'Sampling & Selection Bias',
      disc: 'math', discName: '数学逻辑', layer: 'L1', layerUrl: 'critical-thinking.html',layerName: 'L1 认知原则',
      attr: 'hard', attrName: '硬因果机制',
      desc: '以局部观测推断总体特征时，样本的非随机抽取或存活筛选会导致推断系统性偏离事实（幸存者偏差）。',
      trigger: '听取成功企业家传记经验、查看客户好评率、医学研究对照组设计。',
      boundary: '永远主动寻找“沉默的数据”，先检验样本的代表性，再检验推理的逻辑。'
    },
    {
      id: 38, name: '随机性与分布形态：正态 vs 肥尾', en: 'Randomness & Distributions',
      disc: 'math', discName: '数学逻辑', layer: 'L5', layerUrl: 'judgment-system.html',layerName: 'L5 风险判断',
      attr: 'hard', attrName: '硬因果机制',
      desc: '正态分布（薄尾，均值有效）与幂律分布（肥尾，极端黑天鹅主导一切，均值失效）的本质分野。',
      trigger: '评估投资组合敞口、制定安全红线、防范系统性破产风险。',
      boundary: '最致命的错误是“用正态分布的模型去管理肥尾世界”。在肥尾领域，防范单次致死打击重于一切均值优化。'
    },
    {
      id: 39, name: '均值回归', en: 'Regression to the Mean',
      disc: 'math', discName: '数学逻辑', layer: 'L5', layerUrl: 'judgment-system.html',layerName: 'L5 风险判断',
      attr: 'hard', attrName: '硬因果机制',
      desc: '极端偏离常态的偶发表现（极佳或极差），随后大概率会自然向长期均值靠拢。',
      trigger: '团队某月业绩创历史新高后、高考模拟考严重失常后、批评与表扬的心理效果评估。',
      boundary: '不要把纯粹的统计回归误归因于主观干预；但也要警惕“底层基本盘已经发生实质迁移”被误当作均值回归。'
    },
    {
      id: 40, name: '乘以零法则', en: 'Multiplying by Zero',
      disc: 'math', discName: '数学逻辑', layer: 'L4', layerUrl: 'notes.html',layerName: 'L4 工程防错',
      attr: 'hard', attrName: '硬因果机制',
      desc: '在一个连乘系统中，只要有一项因子是零，最终乘积必然为零：X × Y × Z × 0 = 0。',
      trigger: '重大并购合规审查、系统安全架构单点故障（SPOF）排查、人品与商业信誉评估。',
      boundary: '在复杂项目中识别出哪一项属于“乘数因子”而非“加法因子”。对乘法致命项实行一票否决，绝不容忍侥幸心理。'
    },
    {
      id: 41, name: '网络效应', en: 'Network Effects',
      disc: 'math', discName: '数学逻辑', layer: 'L2-time', layerUrl: 'systems-thinking.html',layerName: 'L2 动态演构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '系统的价值随着接入用户（节点）数量的增加而呈超线性增长（梅特卡夫定律：价值正比于 N²）。',
      trigger: '通讯软件、交易市场、去中心化协作协议的竞争优势评估。',
      boundary: '警惕反向网络效应（网络污染与噪声爆炸导致高净值核心用户流失）。网络效应只负责扩张，不负责质量保证。'
    },
    {
      id: 42, name: '表面积效应与维度诅咒', en: 'Surface Area / Dimensionality',
      disc: 'math', discName: '数学逻辑', layer: 'L2-space', layerUrl: 'structured-engineering.html',layerName: 'L2 空间解构',
      attr: 'hard', attrName: '硬因果机制',
      desc: '表面积决定了系统与外界能量、信息或威胁的交互界面大小。尺度扩张使风险暴露面急剧放大。',
      trigger: '评估攻击面与网络安全风险、大组织外部沟通接口设计、微观纳米颗粒化学反应活性。',
      boundary: '系统扩张不仅带来了能力提升，更带来了成倍膨胀的“风险暴露表面积”。在做大体积的同时必须建立隔离舱。'
    },
    {
      id: 43, name: '全局最优 vs 局部最优', en: 'Global vs. Local Optima',
      disc: 'math', discName: '数学逻辑', layer: 'L0', layerUrl: 'metacognition.html',layerName: 'L0 元层自校准',
      attr: 'hard', attrName: '硬因果机制',
      desc: '盲目采用贪心算法容易被困在局部小山峰。要想登上全局主峰，必须经历暂时“下山（短期指标恶化）”的策略退步。',
      trigger: '传统业务转型阵痛、架构技术重构放弃旧包袱、个人跳出舒适区。',
      boundary: '下山是痛苦且危险的（可能在低谷失血过多死去）。必须在战略上确保足够的安全边际与资源储备，方可启动下山周期。'
    },
    {
      id: 44, name: '数量级思维', en: 'Orders of Magnitude',
      disc: 'math', discName: '数学逻辑', layer: 'L1', layerUrl: 'critical-thinking.html',layerName: 'L1 认知原则',
      attr: 'hard', attrName: '硬因果机制',
      desc: '以 10 倍、100 倍的指数级量级快速进行费米估算，穿透细枝末节，粗估问题的基本可行性与影响规模。',
      trigger: '商业计划初审、战略可行性评估、技术方案规模估算。',
      boundary: '数量级估算用于在战略初期快速否决荒谬方案与把握核心矛盾，不能替代后期工程落地时的严谨数值计算。'
    }
  ];
