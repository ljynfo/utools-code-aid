let log = require('./js/javaLog')
let javaStr = require('./js/javaStr')
let jsonStr = require('./js/jsonStr')
let taskUtil = require('./js/task')

let bookmarksDataCache = [
    {
        title: '格式化log日志参数',
        code: 'getLogParam',
        description: '格式化Java中log占位符自动填充参数',
        pinyin: 'geshihualogrizhicanshu',
        icon: 'img/getLogParam.svg' // 图标(可选)
    },
    {
        title: 'toString转Json并格式化',
        code: 'beanToStringJson',
        description: 'JavaBean的toString字符串转Json并格式化',
        pinyin: 'tostringzhuanjsonbinggeshihua',
        icon: 'img/beanToStringJson.svg' // 图标(可选)
    },
    {
        title: '格式化Json串',
        code: 'formatJson',
        description: '把Json字符串格式化输出',
        pinyin: 'geshihuajsonchuan',
        icon: 'img/formatJson.svg' // 图标(可选)
    },
    {
        title: '去字符拼接',
        code: 'removeEsc',
        description: '去除字符串拼接',
        pinyin: 'quchuzifuchuanlianjie',
        icon: 'img/removeEsc.svg' // 图标(可选)
    },
    {
        title: '复制文本',
        code: 'copyText',
        description: '复制纯文本',
        pinyin: 'fuzhichunwenben',
        icon: 'img/copyText.svg' // 图标(可选)
    },
    {
        title: '计算一列数字',
        code: 'columnCalculation',
        description: '计算一列数字大小平均值',
        pinyin: 'jisuanyilieshuzidaxiaopingjunzhipjz',
        icon: 'img/columnCalculation.svg' // 图标(可选)
    },
    {
        title: '生成有序数字',
        code: 'generatingNumbers',
        description: '从0开始生成有序的数字',
        pinyin: 'shengchengyouxushuzi',
        icon: 'img/generatingNumbers.svg' // 图标(可选)
    },
    {
        title: '任务提取',
        code: 'taskExtract',
        description: 'XMind任务提取',
        pinyin: 'XMindrenwutiqu',
        icon: 'img/taskExtract.svg' // 图标(可选)
    }
]

// af2e3a76
window.exports = {
    "codeHelper": {
        mode: "list",
        args: {
            // 进入插件时调用（可选）
            enter: (action, callbackSetList) => {
                // 如果进入插件就要显示列表数据
                callbackSetList(bookmarksDataCache)
            },
            // 子输入框内容变化时被调用 可选 (未设置则无搜索)
            search: (action, searchWord, callbackSetList) => {
                if (!searchWord) return callbackSetList(bookmarksDataCache)
                searchWord = searchWord.toLowerCase()
                return callbackSetList(bookmarksDataCache.filter(x =>
                    x.title.includes(searchWord)
                    || x.code.includes(searchWord)
                    || x.description.includes(searchWord)
                    || x.pinyin.includes(searchWord)
                ))
            },
            // 用户选择列表中某个条目时被调用
            select: (action, itemData) => {
                window.utools.hideMainWindow()
                let info = '复制成功';
                let code = itemData.code;
                let str = action.payload;
                try {
                    switch (code) {
                        case 'getLogParam':
                            str = log.getLogParam(str)
                            break;
                        case 'removeEsc':
                            str = eval(str)
                            break;
                        case 'formatJson':
                            str = jsonStr.formatJson(str)
                            break;
                        case 'beanToStringJson':
                            str = javaStr.beanStrToJson(str)
                            str = jsonStr.formatJson(str)
                            break;
                        case 'copyText':
                            str = str.toString()
                            break;
                        case 'columnCalculation':
                            str = taskUtil.columnCalculation(str)
                            break;
                        case 'generatingNumbers':
                            str = taskUtil.generatingNumbers(str)
                            break;
                        case 'taskExtract':
                            str = taskUtil.taskExtract(str)
                            break;
                        default:
                    }

                } catch (error) {
                    console.log(error)
                    info = info + '，但可能有点问题'
                }
                window.utools.copyText(str)
                window.utools.outPlugin()
                window.utools.showNotification(info)
            }
        }
    }
}