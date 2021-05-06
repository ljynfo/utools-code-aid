const beanStrToJson = function (str) {
    str = str.toString()
    str = str.replace(/\(/g, '{')
    str = str.replace(/\)/g, '}')

    let list = [];
    let tem = '';
    let isArray = false
    for (let i = 0, len = str.length; i < len; i++) {
        const ch = str[i];
        if (ch === '{' || ch === '}' || ch === '[' || ch === ']' || ch === ',') {
            if (ch === '[') {
                isArray = true
            }
            if (ch === ']') {
                isArray = false
            }
            let idx = tem.indexOf('=')
            if (idx > 0) {
                let next = ch
                if (i < len - 1 && (next !== ']' && next !== '}' && next !== ',')) {
                    tem = tem.substr(0, idx + 1)
                }
                list.push(tem);
            } else if (isArray) {
                list.push(tem);
            }
            tem = '';
            list.push(ch);
        } else {
            tem = tem.concat(ch);
        }
    }
    list = list.filter(x =>
        x.indexOf('{') > -1
        || x.indexOf('}') > -1
        || x.indexOf('[') > -1
        || x.indexOf(']') > -1
        || x.indexOf(',') > -1
        || x.indexOf('=') > -1
    )
    let regPos = /^[0-9.]+$/     //判断是否是数字。
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
            if ('null' !== s2 && 'false' !== s2 && 'true' !== s2 && (s2.length > 10 || regPos.test(s2) === false)) {
                if (i < len - 1) {
                    let first = list[i + 1].substring(0, 1)
                    if (first !== '{' && first !== '[') {
                        s2 = '"' + s2 + '"'
                    }
                }
            }
            s = s1 + " : " + s2;
        }
        result = result.concat(s);
    }

    return result
}

module.exports = {beanStrToJson}