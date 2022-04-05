const callRemoveEsc = function (str) {
    return eval(str)
}
const matchRemoveEsc = function (str) {
    return str.startsWith('"') && str.endsWith('"')
}

const callCopyText = function (str) {
    return str.toString()
}

const matchCopyText = function (str) {
    return true
}

module.exports = {
    callRemoveEsc,
    matchRemoveEsc,
    callCopyText,
    matchCopyText
}