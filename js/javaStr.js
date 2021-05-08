let jsonStr = require('./jsonStr')

const beanStrToJson = function (str) {
    str = str.toString()
    str = str.replace(/\(/g, '{')
    str = str.replace(/\)/g, '}')

    str = jsonStr.formatJsonLoose(str)

    let splitList = str.split('\n');

    let strList = []
    for (let i = 0, len = splitList.length; i < len; i++) {
        let s = splitList[i]
        if (s.indexOf('{') > -1
            || s.indexOf('}') > -1
            || s.indexOf('[') > -1
            || s.indexOf(']') > -1
            || s.indexOf(',') > -1
            || s.indexOf('=') > -1) {
            let eq = s.indexOf('=')
            if (i < len - 1 && eq > 0 && (splitList[i + 1].trim()[0] === '{' || splitList[i + 1].trim()[0] === '[')) {
                s = s.substring(0, eq + 1)
            }
            strList.push(s)
        } else {
            if (i < len - 1 && splitList[i + 1].indexOf(']') > -1) {
                strList.push(s)
            }
        }
    }

    let result = '';
    for (let i = 0, len = strList.length; i < len; i++) {
        let s = strList[i].trim();
        let index = s.indexOf('=');
        let tr = s.trim()
        if (index > 0) {
            let s1 = s.substring(0, index).trim();
            let s2 = s.substring(index + 1, s.length).trim();
            if ('' !== s1 && 'null' !== s1) {
                s1 = '"' + s1 + '"';
            }
            s2 = buildQuotationForValue(i, len, strList, s2)
            s = s1 + " : " + s2;
        } else if (
            tr.length > 0
            && tr !== '{'
            && tr !== '}'
            && tr !== '},'
            && tr !== '['
            && tr !== ']'
            && tr !== '],'
            && tr !== ','
            && tr !== '='
        ) {
            s = buildQuotationForValue(i, len, strList, s)
        }
        result = result.concat(s)
    }

    return result
}


function buildQuotationForValue(i, len, strList, value) {
    let comma = value.trim()[value.length - 1] === ','
    if (comma) {
        value = value.substring(0, value.length - 1)
    }
    //判断是否是数字。
    let regPos = /^[0-9.]+$/
    if ('null' !== value && 'false' !== value && 'true' !== value && (value.length > 10 || regPos.test(value) === false)) {
        if (i < len - 1) {
            let first = strList[i + 1].trim().substring(0, 1)
            if (first !== '[' && first !== '{') {
                value = '"' + value + '"'
            }
        }
    }
    if (comma) {
        value = value.concat(',')
    }
    return value
}

module.exports = {beanStrToJson}