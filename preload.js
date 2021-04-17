const beanStrToJson = function (str) {
    str = str.toString()
    str = str.replace(/\(/g, '{')
    str = str.replace(/\)/g, '}')

    const list = [];
    let tem = '';
    for (let i = 0, len = str.length; i < len; i++) {
        const ch = str[i];
        if (ch === '{' || ch === '}' || ch === '[' || ch === ']' || ch === ',') {
            let idx = tem.indexOf('=')
            if (idx > 0) {
                let next = ch
                if (i < len - 1 && (next !== ']' && next !== '}' && next !== ',')) {
                    tem = tem.substr(0, idx + 1)
                }
                // console.log(tem + '   ' + i + '      ' + next + '   ' + idx)
                list.push(tem);
            }
            tem = '';
            list.push(ch);
        } else {
            tem = tem.concat(ch);
        }
    }

    let result = '';
    for (let i = 0, len = list.length; i < len; i++) {
        let s = list[i];
        const index = s.indexOf('=');
        if (index > 0) {
            let s1 = s.substring(0, index).trim();
            let s2 = s.substring(index + 1, s.length).trim();
            if ('' !== s1 && 'null' !== s1) {
                s1 = '"' + s1 + '"';
            }
            if ('' !== s2 && 'null' !== s2) {
                s2 = '"' + s2 + '"';
            }
            s = s1 + ":" + s2;
        }
        result = result.concat(s);
    }

    // console.log(result)
    return result
};

//格式化代码函数,已经用原生方式写好了不需要改动,直接引用就好
const formatJsonLoose = function (json) {
    let formatted = '',     //转换后的json字符串
        padIdx = 0,         //换行后是否增减PADDING的标识
        PADDING = '    ';   //4个空格符
    /**
     * 将对象转化为string
     */
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    }
    /**
     *利用正则类似将{'name':'ccy','age':18,'info':['address':'wuhan','interest':'playCards']}
     *---> \r\n{\r\n'name':'ccy',\r\n'age':18,\r\n
     *'info':\r\n[\r\n'address':'wuhan',\r\n'interest':'playCards'\r\n]\r\n}\r\n
     */
    json = json.replace(/([\{\}])/g, '\r\n$1\r\n')
        .replace(/([\[\]])/g, '\r\n$1\r\n')
        .replace(/(\,)/g, '$1\r\n')
        .replace(/(\r\n\r\n)/g, '\r\n')
        .replace(/\r\n\,/g, ',');
    /**
     * 根据split生成数据进行遍历，一行行判断是否增减PADDING
     */
    (json.split('\r\n')).forEach(function (node, index) {
        let indent = 0,
            padding = '';
        if (node.match(/\{$/) || node.match(/\[$/)) indent = 1;
        else if (node.match(/\}/) || node.match(/\]/)) padIdx = padIdx !== 0 ? --padIdx : padIdx;
        else indent = 0;
        for (let i = 0; i < padIdx; i++) padding += PADDING;
        formatted += padding + node + '\r\n';
        padIdx += indent;
        // console.log('index:' + index + ',indent:' + indent + ',padIdx:' + padIdx + ',node-->' + node);
    });
    // console.log(formatted)
    return formatted
};

//格式化代码函数,已经用原生方式写好了不需要改动,直接引用就好
const formatJsonStrict = function (json, options) {
    let reg = null,
        formatted = '',
        pad = 0,
        PADDING = '    ';
    options = options || {};
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true);
    options.spaceAfterColon = (options.spaceAfterColon !== false);
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    } else {
        json = JSON.parse(json);
        json = JSON.stringify(json);
    }
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ':');
    }
    (json.split('\r\n')).forEach(function (node, index) {
            var i = 0,
                indent = 0,
                padding = '';

            if (node.match(/\{$/) || node.match(/\[$/)) {
                indent = 1;
            } else if (node.match(/\}/) || node.match(/\]/)) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else {
                indent = 0;
            }

            for (i = 0; i < pad; i++) {
                padding += PADDING;
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        }
    );
    return formatted;
};

const removeEsc = function (str) {
    str = eval(str)
    return str
};

const getLogParam = function (str) {
    let list = str.split(',')
    let result = '';
    for (let i = 0, len = list.length; i < len; i++) {
        let s = list[i];
        if (s.includes(':{}')) {
            s = s.replace(':{}', '')
            result = result.concat(', ');
            if (s.lastIndexOf('.size') > 0) {
                s = s.concat('()')
            }
            result = result.concat(s);
        }
    }

    return result
};

const formatJson = function (str) {
    try {
        str = formatJsonStrict(str)
    } catch (e) {
        console.log(e)
        str = formatJsonLoose(str)
    }
    return str
};

const taskExtract = function (str) {
    let list = str.split('\n')
    let result = ''
    let task
    let taskSum = 0
    let taskNum = 0
    let taskTimeSum = 0
    let errorList = [];
    try {
        for (let i = 0, len = list.length; i < len; i++) {
            task = list[i];
            let thick = task.includes('【') && (task.includes('h】') || task.includes('H】'))
            let thin = task.includes('[') && (task.includes('h]') || task.includes('H]'))
            if (thick || thin) {
                taskSum++
                let taskTime
                if (thick) {
                    taskTime = task.substr(task.lastIndexOf('【'), task.lastIndexOf('】'))
                }
                if (thin) {
                    taskTime = task.substr(task.lastIndexOf('['), task.lastIndexOf(']'))
                }
                taskTime = taskTime.replace('h', '').replace('H', '')
                    .replace('【', '').replace('】', '')
                    .replace('[', '').replace(']', '')
                taskTime = parseFloat(taskTime)
                if (isNaN(taskTime)) {
                    errorList.push(task.trim())
                } else {
                    taskTimeSum = taskTimeSum + taskTime
                    task = task.trim()
                    taskNum++
                    result = result.concat('\n');
                    result = result.concat(task);
                }
            }
        }
        result = ('总共' + taskSum + '个任务, 解析成功' + taskNum + '个、失败' + (taskSum - taskNum) + '个, 成功任务合计' + taskTimeSum + '小时\n').concat(result)
    } catch (e) {
        result = '解析任务失败, 任务信息: '.concat(task)
    }
    let errorSum = errorList.length
    if (errorSum > 0) {
        result = result.concat("\n\n\n解析失败任务:")
    }
    for (let i = 0; i < errorSum; i++) {
        let errorTask = errorList[i];
        result = result.concat("\n".concat(errorTask))
    }
    return result
};

const columnCalculation = function (str) {
    let list = str.split('\n')
    let max
    let min
    let sum = 0
    let avg
    let count = 0
    let number
    let errorList = [];
    let result = ''
    try {
        for (let i = 0, len = list.length; i < len; i++) {
            number = parseFloat(list[i].trim())
            if (isNaN(number)) {
                errorList.push(list[i])
            } else {
                count++
                sum = sum + number
                if (max == null) {
                    max = number
                } else {
                    max = max > number ? max : number
                }
                if (min == null) {
                    min = number
                } else {
                    min = min < number ? min : number
                }
            }
        }
        avg = sum / count
        result = '总共' + list.length + '行, 解析成功' + count + '行、失败' + (list.length - count) + '行\n' +
            'max: ' + max + ', min: ' + min + ', avg: ' + avg + ', sum: ' + sum + '\n'
    } catch (e) {
        result = '解析失败, 信息: '.concat(number)
    }
    let errorSum = errorList.length
    if (errorSum > 0) {
        result = result.concat("\n\n\n解析失败:")
    }
    for (let i = 0; i < errorSum; i++) {
        let errorMsg = errorList[i];
        result = result.concat("\n".concat(errorMsg))
    }
    return result
};


let bookmarksDataCache = [
    {
        title: '提取log日志参数',
        code: 'getLogParam',
        description: '提取log日志参数',
        pinyin: 'tiqulogrizhicanshu',
        icon: 'img/getLogParam.svg' // 图标(可选)
    },
    {
        title: '去字符拼接',
        code: 'removeEsc',
        description: '去除字符串拼接',
        pinyin: 'quchuzifuchuanlianjie',
        icon: 'img/removeEsc.svg' // 图标(可选)
    },
    {
        title: '格式化Json串',
        code: 'formatJson',
        description: '把Json字符串格式化输出',
        pinyin: 'geshihuajsonchuan',
        icon: 'img/formatJson.svg' // 图标(可选)
    },
    {
        title: 'toString转Json并格式化',
        code: 'beanToStringJson',
        description: 'JavaBean的toString字符串转Json并格式化',
        pinyin: 'tostringzhuanjsonbinggeshihua',
        icon: 'img/beanToStringJson.svg' // 图标(可选)
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
        title: '拆解任务提取',
        code: 'taskExtract',
        description: '拆解任务提取',
        pinyin: 'chaijierenwutiqu',
        icon: 'img/taskExtract.svg' // 图标(可选)
    }
]

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
                            str = getLogParam(str)
                            break;
                        case 'removeEsc':
                            str = removeEsc(str)
                            break;
                        case 'formatJson':
                            str = formatJson(str)
                            break;
                        case 'beanToStringJson':
                            str = beanStrToJson(str)
                            str = formatJson(str)
                            break;
                        case 'copyText':
                            str = str.toString()
                            break;
                        case 'columnCalculation':
                            str = columnCalculation(str)
                            break;
                        case 'taskExtract':
                            str = taskExtract(str)
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