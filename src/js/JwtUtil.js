let jsonStr = require('./JsonStrUtil')

const callJwtParseToJson = function (str) {
    let jwt = findJwtFromStr(str)
    let jwtJsonStr = parseJwtStrToJson(jwt)
    return jsonStr.callFormatJson(jwtJsonStr)
}
const callJwtParseToHeaderHump = function (str) {
    let jwt = findJwtFromStr(str)
    let jwtJsonStr = parseJwtStrToJson(jwt)
    return callJwtParseToHeader(jwtJsonStr, false)
}
const callJwtParseToHeaderUnderline = function (str) {
    let jwt = findJwtFromStr(str)
    let jwtJsonStr = parseJwtStrToJson(jwt)
    return callJwtParseToHeader(jwtJsonStr, true)
}

const matchJwt = function (str) {
    return str.includes('Bearer ') && str.includes('.') && str.split('.').length >= 3
}

function findJwtFromStr(str) {
    str = str.substring(str.indexOf('Bearer '))
    let line = str.indexOf("\n")
    if (line > 1) {
        str = str.substring(0, line)
    }
    return str
}

function callJwtParseToHeader(jwtJsonStr, underline) {
    let jwtJson = JSON.parse(jwtJsonStr)

    let result = ''
    for (let k in jwtJson) {
        // if (typeof (jwtJson[k]) == "object"){
        //     continue
        // }

        if (k === 'iss'
            || k === 'sub'
            || k === 'iat'
            || k === 'exp'
            || k === 'nbf') {
            continue
        }
        let v = jwtJson[k]
        if (v == null || v.length === 0) {
            continue
        }

        let name
        if (underline) {
            name = toLine(k)
        } else {
            name = toHump(k)
        }

        result = result
            .concat('\n')
            .concat(name)
            .concat(': ')
            .concat(v)
    }
    return result
}

function toLine(name) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function toHump(name) {
    return name.replace(/\_(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
}

function parseJwtStrToJson(jwtStr) {
    let strings = jwtStr.split(".")
    if (strings.length !== 3) {
        return '不是jwt格式'
    }
    let atob = window.atob(strings[1].replace(/-/g, "+").replace(/_/g, "/"));
    return atob
}

module.exports = {
    callJwtParseToJson,
    callJwtParseToHeaderHump,
    callJwtParseToHeaderUnderline,
    matchJwt
}