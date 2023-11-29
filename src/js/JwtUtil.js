let jsonStr = require('./JsonStrUtil')

const callJwtParseToJson = function (str) {
    let jwt = findJwtFromStr(str)
    let jwtJsonStr = parseJwtStrToJson(jwt)
    return jsonStr.callFormatJson(jwtJsonStr)
}

const matchJwt = function (str) {
    str = str.trim()
    return (str.startsWith('Bearer ') || str.startsWith('eyJ0e'))
        && str.includes('.') && str.split('.').length >= 3
}

function findJwtFromStr(str) {
    str = str.substring(str.indexOf('Bearer '))
    let line = str.indexOf("\n")
    if (line > 1) {
        str = str.substring(0, line)
    }
    return str
}

function parseJwtStrToJson(jwtStr) {
    let strings = jwtStr.trim()
        .split(".")
    if (strings.length !== 3) {
        return '不是jwt格式'
    }
    return b64_to_utf8(strings[1].replace(/-/g, "+").replace(/_/g, "/"))
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

module.exports = {
    callJwtParseToJson,
    matchJwt
}