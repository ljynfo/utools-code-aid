const callColumnCalculation = function (str) {
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
}

const callGeneratingNumbers = function (str) {
    let max = parseFloat(str.trim())
    if (isNaN(max)) {
        max = 20
    }
    let result = ''
    for (let i = 0; i <= max; i++) {
        result = result.concat(i.toString())
        if (i < max) {
            result = result.concat("\n")
        }
    }
    return result
}
const matchColumnCalculation = function (str) {
    let number = parseFloat(str.split('\n')[0].trim())
    return !isNaN(number);
}
const matchGeneratingNumbers = function (str) {
    return !isNaN(str);
}

module.exports = {
    callColumnCalculation,
    callGeneratingNumbers,
    matchGeneratingNumbers,
    matchColumnCalculation
}