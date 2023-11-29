const callGenerateSql = function (str) {
    let list = str.split('\n')
    let sql = '';
    let params = new Map();
    for (let i = 0, len = list.length; i < len; i++) {
        let line = list[i]
        if (sql.length === 0 && matchGenerateSql(line)) {
            let sqlLabel = 'SQL:'
            sql = line.substring(line.indexOf(sqlLabel) + sqlLabel.length);
        }
        if (line.indexOf('binding parameter') > -1) {
            let sqlLabel = 'binding parameter'
            line = line.substring(line.indexOf('binding parameter') + sqlLabel.length, line.length);
            let indexStart = line.indexOf('[') + 1;
            let indexEnd = line.indexOf(']');
            let index = line.substring(indexStart, indexEnd);
            let paramStart = line.indexOf('] - [') + 5;
            let paramEnd = line.lastIndexOf(']');
            let param = line.substring(paramStart, paramEnd);
            let typeStart = line.indexOf('] as [') + 6;
            let typeEnd = line.indexOf('] - [');
            let type = line.substring(typeStart, typeEnd);
            if (type === 'TIMESTAMP') {
                let strs = param.split(' ');
                if (strs.length > 1) {
                    param = strs[5]
                        + '-' + matchMonth(strs[1])
                        + '-' + strs[2]
                        + ' ' + strs[3]
                }
            }
            index = parseInt(index)
            if (param.length > 20) {
                param = "'" + param + "'"
            } else if (!Number.isNaN(param)
                && param !== 'true'
                && param !== 'false'
                && param !== 'null') {
                param = "'" + param + "'"
            }
            console.log(!Number.isNaN(param))
            console.log(param !== 'true')
            console.log(param !== 'false')
            console.log(param !== 'null')
            params.set(index, param)
        }
    }
    console.log(sql)
    console.log(params)
    if (sql) {
        let placeholderIndex = sql.indexOf('?')
        let mapIndex = 1
        while (placeholderIndex > -1) {
            sql = sql.substring(0, placeholderIndex) + params.get(mapIndex) + sql.substring(placeholderIndex + 1)
            placeholderIndex = sql.indexOf('?')
            mapIndex++
        }

    }
    return sql
}

const matchMonth = function (str) {
    if (!str) {
        return '';
    }
    switch (str) {
        case 'Jan':
            return '01'
        case 'Feb':
            return '02'
        case 'Mar':
            return '03'
        case 'Apr':
            return '04'
        case 'May':
            return '05'
        case 'Jun':
            return '06'
        case 'Jul':
            return '07'
        case 'Aug':
            return '08'
        case 'Sep':
            return '09'
        case 'Oct':
            return '10'
        case 'Nov':
            return '11'
        case 'Dec':
            return '12'
    }
}
const matchGenerateSql = function (str) {
    return str.indexOf("select") > -1
        || str.indexOf("SELECT") > -1
        || str.indexOf("insert") > -1
        || str.indexOf("INSERT") > -1
        || str.indexOf("update") > -1
        || str.indexOf("UPDATE") > -1
        || str.indexOf("delete") > -1
        || str.indexOf("DELETE") > -1
}

module.exports = {
    callGenerateSql,
    matchGenerateSql
}