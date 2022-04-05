const callFormatLogParam = function (str) {
    str = str.replace(/：\{\}/g, '\{\}')
    str = str.replace(/:\{\}/g, '\{\}')
    str = str.replace(/\{\}/g, ':\{\}')
    let list = str.split(':\{\}')
    let result = ''
    let params = ''
    for (let i = 0, len = list.length; i < len; i++) {
        let s = list[i];
        if (i < len - 1) {
            s = s.concat(':{}')
            let param = s.replace(':{}', '')

            let index1 = param.lastIndexOf(',')
            let index2 = param.lastIndexOf(' ')
            index1 = index1 > index2 ? index1 : index2
            index1 = 0 > index1 ? 0 : index1
            param = param.substr(index1, param.length)
            let left = param.indexOf('"');
            if (left > -1) {
                param = ' '.concat(param.substr(left + 1, param.length))
            }

            if (param.lastIndexOf('.size') > 0) {
                param = param.concat('()')
            }
            params = params.concat(',', param);
        }
        result = result.concat(s);
    }
    result = result.substr(0, result.lastIndexOf('"') + 1)
    result = result.concat(params, ');')
    result = result.replace(/\{\}，/g, '\{\},')
    return result
}

const matchFormatLogParam = function (str) {
    return str.includes('log.') && str.includes('{}')
}

module.exports = {
    callFormatLogParam,
    matchFormatLogParam
}