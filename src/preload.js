let CommonStrUtil = require('./js/CommonStrUtil')
let JavaLogUtil = require('./js/JavaLogUtil')
let JavaStrUtil = require('./js/JavaStrUtil')
let JsonStrUtil = require('./js/JsonStrUtil')
let ColumnUtil = require('./js/ColumnUtil')
let DateTimeUtil = require('./js/DateTimeUtil')
let JwtUtil = require('./js/JwtUtil.js')
let SQLUtil = require('./js/SQLUtil.js')

let formatLogParam = {
    title: '格式化log日志参数',
    code: 'formatLogParam',
    description: '格式化Java中log占位符自动填充参数',
    pinyin: 'geshihualogrizhicanshu',
    icon: 'img/getLogParam.svg'
}
let jwtParseToJson = {
    title: '将jwt解析成json格式',
    code: 'jwtParseToJson',
    description: '将jwt解析成json格式',
    pinyin: 'jwttojson',
    icon: 'img/jwtParseToJson.svg'
}
let beanToStringJson = {
    title: 'toString转Json并格式化',
    code: 'beanToStringJson',
    description: 'JavaBean的toString字符串转Json并格式化',
    pinyin: 'tostringzhuanjsonbinggeshihua',
    icon: 'img/beanToStringJson.svg'
}
let formatJson = {
    title: '格式化Json串',
    code: 'formatJson',
    description: '把Json字符串格式化输出',
    pinyin: 'geshihuajsonchuan',
    icon: 'img/formatJson.svg'
}
let removeEsc = {
    title: '去字符拼接',
    code: 'removeEsc',
    description: '去除字符串拼接',
    pinyin: 'quchuzifuchuanlianjie',
    icon: 'img/removeEsc.svg'
}
let copyText = {
    title: '复制文本',
    code: 'copyText',
    description: '复制纯文本',
    pinyin: 'fuzhichunwenben',
    icon: 'img/copyText.svg'
}
let columnCalculation = {
    title: '计算一列数字',
    code: 'columnCalculation',
    description: '计算一列数字大小平均值',
    pinyin: 'jisuanyilieshuzidaxiaopingjunzhipjz',
    icon: 'img/columnCalculation.svg'
}
let generateTimeStampStr = {
    title: '生成时间戳',
    code: 'generatingTimeStampStr',
    description: 'yyyyMMddHHmmss',
    pinyin: 'sjcrqshengchengshijianchuo',
    icon: 'img/generateTimeStr.svg'
}
let generateTimeStr = {
    title: '生成时间',
    code: 'generateTimeStr',
    description: 'yyyy-MM-dd HH:mm:ss',
    pinyin: 'sjcrqshengchengshijian',
    icon: 'img/generateTimeStr.svg'
}
let generateNumbers = {
    title: '生成有序数字',
    code: 'generateNumbers',
    description: '从0开始生成有序的数字',
    pinyin: 'shengchengyouxushuzi',
    icon: 'img/generateNumbers.svg'
}
let generateSql = {
    title: '生成SQL',
    code: 'generateSql',
    description: '从日志中提取出SQL语句',
    pinyin: 'shengchengsql',
    icon: 'img/SQL.svg'
}

let allSetListDataCache = [
    formatLogParam,
    jwtParseToJson,
    beanToStringJson,
    formatJson,
    removeEsc,
    copyText,
    columnCalculation,
    generateTimeStampStr,
    generateTimeStr,
    generateNumbers,
    generateSql
]

function paste() {
    if (window.utools.isMacOs()) {
        utools.simulateKeyboardTap('v', 'command')
    }
    if (window.utools.isWindows()
        || window.utools.isLinux()) {
        utools.simulateKeyboardTap('v', 'ctrl')
    }
}

// af2e3a76
window.exports = {
    "codeHelper": {
        mode: "list",
        args: {
            // 进入插件时调用（可选）
            enter: (action, callbackSetList) => {
                let list = []
                let str = action.payload

                if (JavaLogUtil.matchFormatLogParam(str)) {
                    list.push(formatLogParam)
                }
                if (JwtUtil.matchJwt(str)) {
                    list.push(jwtParseToJson)
                }
                if (JavaStrUtil.matchBeanToStringJson(str)) {
                    list.push(beanToStringJson)
                }
                if (JsonStrUtil.matchFormatJson(str)) {
                    list.push(formatJson)
                }
                if (CommonStrUtil.matchRemoveEsc(str)) {
                    list.push(removeEsc)
                }
                if (ColumnUtil.matchColumnCalculation(str)) {
                    list.push(columnCalculation)
                }
                if (DateTimeUtil.matchGenerateTimeStr(str)) {
                    list.push(generateTimeStr)
                    list.push(generateTimeStampStr)
                }
                if (ColumnUtil.matchGenerateNumbers(str)) {
                    list.push(generateNumbers)
                }
                if (CommonStrUtil.matchCopyText(str)) {
                    list.push(copyText)
                }
                if (SQLUtil.matchGenerateSql(str)) {
                    list.push(generateSql)
                }

                // 如果进入插件就要显示列表数据
                callbackSetList(list)
            },
            // 子输入框内容变化时被调用 可选 (未设置则无搜索)
            search: (action, searchWord, callbackSetList) => {
                if (!searchWord) return callbackSetList(allSetListDataCache)
                searchWord = searchWord.toLowerCase()
                return callbackSetList(allSetListDataCache.filter(x =>
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
                        case 'formatLogParam':
                            str = JavaLogUtil.callFormatLogParam(str)
                            break;
                        case 'jwtParseToJson':
                            str = JwtUtil.callJwtParseToJson(str)
                            break;
                        case 'removeEsc':
                            str = CommonStrUtil.callRemoveEsc(str)
                            break;
                        case 'formatJson':
                            str = JsonStrUtil.callFormatJson(str)
                            break;
                        case 'beanToStringJson':
                            str = JavaStrUtil.callBeanStrToJson(str)
                            str = JsonStrUtil.callFormatJson(str)
                            break;
                        case 'copyText':
                            str = CommonStrUtil.callCopyText(str)
                            break;
                        case 'columnCalculation':
                            str = ColumnUtil.callColumnCalculation(str)
                            break;
                        case 'generateNumbers':
                            str = ColumnUtil.callGenerateNumbers(str)
                            break;
                        case 'generateTimeStr':
                            str = DateTimeUtil.callGenerateTimeStr("yyyy-MM-dd HH:mm:ss")
                            break;
                        case 'generateTimeStampStr':
                            str = DateTimeUtil.callGenerateTimeStr("yyyyMMddHHmmss")
                            break;
                        case 'generateSql':
                            str = SQLUtil.callGenerateSql(str)
                            break;
                        default:
                    }

                } catch (error) {
                    console.log(error)
                    info = info + '，但可能有点问题'
                }
                window.utools.hideMainWindow()
                window.utools.copyText(str)
                paste()
                window.utools.outPlugin()
                window.utools.showNotification(info)
            }
        }
    }
}