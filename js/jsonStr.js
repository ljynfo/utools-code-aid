const formatJsonLoose = function (json) {
    let formatted = '',     //转换后的json字符串
        padIdx = 1,         //换行后是否增减PADDING的标识
        PADDING = '  ';     //2个空格符
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
    });
    return formatted
}

const formatJsonStrict = function (json, options) {
    let reg = null,
        formatted = '',
        pad = 0,
        PADDING = '  ';
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
}

const formatJson = function (str) {
    try {
        str = formatJsonStrict(str)
    } catch (e) {
        console.log(e)
        str = formatJsonLoose(str)
    }
    return str
}

module.exports = {
    formatJson,
    formatJsonLoose,
    formatJsonStrict
}