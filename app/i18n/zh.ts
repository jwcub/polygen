export default {
  nav: {
    home: "首页",
    game: "游戏",
    leaderboard: "排行榜",
    apps: "应用",
    casualGames: "休闲游戏",
    casualGamesDescription: "点击小圆点，围住小猫",
    profile: "个人主页",
    preference: "偏好设置",
    logout: "退出登录",
    switchLanguages: "切换语言",
    room: "房间",
    map: "创作中心",
    mapDescription: "创作并分享自定义地图"
  },
  auth: {
    login: "登录",
    register: "注册",
    username: "用户名",
    password: "密码",
    retypePassword: "重复密码",
    captcha: "验证码",
    noAccount: "没有账号？",
    haveAccount: "已有账号？",
    usernamePlaceholder: "3-18 个字符",
    passwordPlaceholder: "长度不小于 6 位",
    retypePasswordPlaceholder: "再次输入密码",
    captchaPlaceholder: "右侧图形验证码",
    usernameStartsOrEndsWithSpace: "用户名不能以空格开头或结尾",
    usernameSuccessiveSpaces: "用户名不能包含连续的多个空格",
    usernameInvalidChars: "用户名包含不允许的字符",
    usernameOrPasswordIncorrect: "用户名或密码错误",
    captchaIncorrect: "验证码错误",
    usernameAlreadyExists: "用户名已存在",
    passwordsNotMatch: "两次输入的密码不一致"
  },
  community: {
    edit: "编辑",
    preview: "预览",
    addPost: "发布",
    addComment: "评论",
    announcements: "公告",
    close: "关闭",
    confirmTitle: "确认删除",
    confirmBody: "该操作不可撤销",
    delete: "删除",
    cancel: "取消",
    second: "秒",
    minute: "分钟",
    hour: "小时",
    day: "天",
    month: "月",
    years: "年",
    countdowns: "倒计时",
    publicPreview: "公测",
    recentComments: "最新评论",
    ago: "前",
    comment_one: "评论",
    comment_other: "评论",
    showMore: "点击查看更多",
    postOf: "{{username}}的说说",
    published: "发布于",
    placeholder: "支持 Markdown 与 KaTeX 语法",
    save: "保存",
    publish: "发布",
    title: "标题",
    copied: "已复制",
    private: "私密",
    privateMode: "私密模式",
    privateModeDescription: "不公开发布",
    addAnnouncement: "创建公告"
  },
  utils: {
    plurals_one: "",
    plurals_other: ""
  },
  game: {
    id: "名称",
    properties: "属性",
    players: "玩家",
    status: "状态",
    waiting: "等待中",
    playing: "游戏中",
    rated: "计入排名",
    "vote-item-mode": "模式",
    "vote-value-hexagon": "六边形",
    "vote-value-square": "四边形",
    "vote-item-map": "地图",
    "vote-value-random": "随机地图",
    "vote-value-empty": "空白地图",
    "vote-value-maze": "迷宫地图",
    "vote-value-plots": "格点地图",
    "vote-item-speed": "速度"
  },
  leaderboard: {
    player: "玩家",
    updatedAt: "更新时间",
    posts: "说说",
    comments: "评论",
    registrationTime: "注册时间"
  }
} as const;
