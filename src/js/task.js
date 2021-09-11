let jsonStr = require('./jsonStr')

const taskExtract = function (str) {
    let zhixiStart = '￿﻿'
    let isZhixi = str.startsWith(zhixiStart) && jsonStr.isJosn(str.replace(zhixiStart, ''))
    if (isZhixi) {
        return taskExtractWithZhixi(str.replace(zhixiStart, ''))
    } else {
        return taskExtractWithString(str)
    }
}

function taskExtractWithZhixi(str) {
    let roots = JSON.parse(str)
    let root = roots[0]

    let errorList = []
    let map = new Map()
    map.set('task', '')
    map.set('result', '')
    map.set('taskSum', 0)
    map.set('taskNum', 0)
    map.set('taskTimeSum', 0)

    let result = ''
    try {
        taskExtractWithZhixiTree(errorList, map, root.data.text, root, root.children)
        result = ('总共' + map.get('taskSum') + '个任务, 解析成功' + map.get('taskNum') + '个、失败' +
            (map.get('taskSum') - map.get('taskNum')) + '个, 成功任务合计' +
            map.get('taskTimeSum') + '小时\n').concat(map.get('result'))
    } catch (error) {
        result = '解析任务失败, 任务信息: '.concat(map.get('task'))
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

}

function taskExtractWithZhixiTree(errorList, map, lastStr, data, children) {
    for (let i = 0; i < children.length; i++) {
        let task = map.get('task')
        let result = map.get('result')
        let taskSum = map.get('taskSum')
        let taskNum = map.get('taskNum')
        let taskTimeSum = map.get('taskTimeSum')

        let child = children[i]
        task = child.data.text

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
                result = result.concat((lastStr + '>' + task).trim());
            }
        }

        map.set('task', task)
        map.set('result', result)
        map.set('taskSum', taskSum)
        map.set('taskNum', taskNum)
        map.set('taskTimeSum', taskTimeSum)
        let grandchildren = child.children
        if (grandchildren && grandchildren.length > 0) {
            taskExtractWithZhixiTree(errorList, map, child.data.text, child, grandchildren)
        }
    }

}

function taskExtractWithString(str) {
    let list = str.split('\n')
    let result = ''
    let task
    let taskSum = 0
    let taskNum = 0
    let taskTimeSum = 0
    let errorList = []
    try {
        let lastStr
        for (let i = 0, len = list.length; i < len; i++) {
            task = list[i];
            let thick = task.includes('【') && (task.includes('h】') || task.includes('H】'))
            let thin = task.includes('[') && (task.includes('h]') || task.includes('H]'))
            let suspected = (task.trim().endsWith('h') || task.trim().endsWith('H')) && !isNaN(parseFloat((task.trim().substr(task.trim().length - 2, task.trim().length - 1))))
            if (thick || thin || suspected) {

                let taskTabCount = task.split('\t').length - 1
                for (let j = i; j > 0; j--) {
                    lastStr = list[j - 1]
                    let lastStrTabCount = lastStr.split('\t').length - 1
                    if (lastStrTabCount <= taskTabCount - 1) {
                        lastStr = lastStr.replace(/[\r\n\t]/g, '')
                        break
                    }
                }
                taskSum++
                if (suspected) {
                    errorList.push(lastStr + '>' + task.trim())
                } else {
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
                        errorList.push(lastStr + '>' + task.trim())
                    } else {
                        taskTimeSum = taskTimeSum + taskTime
                        task = task.trim()
                        taskNum++
                        result = result.concat('\n');
                        result = result.concat((lastStr + '>' + task).trim());
                    }
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
}

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
}

const generatingNumbers = function (str) {
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

module.exports = {
    taskExtract,
    columnCalculation,
    generatingNumbers
}