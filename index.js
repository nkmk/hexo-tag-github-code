var https = require('https')
var path = require('path')

function get_code(url, callback){
    var data = ''
    var req = https.get(url, function (res) {
        res.setEncoding('utf8')
        res.on('data', function (line) {
            data += line;
        })
        res.on('end', function () {
            callback(data)
        }) 
    })
}

function ghcode(args){
    codeTag = hexo.extend.tag.env.extensions.code.fn
    var url = args[0]
    var start = args[1]
    if(start == undefined){
        start = 1
    }
    var stop = args[2]
    var raw_url = url.replace(/github.com/, 'raw.githubusercontent.com').replace(/blob\//, '')
    var ext = path.extname(raw_url).slice(1)
    var basename = path.basename(raw_url)
    return new Promise(function(resolve, reject){
        get_code(raw_url, function(data){
            split_data = data.split(/\r\n|\r|\n/).slice(start - 1, stop).join('\n')
            result = codeTag([basename, 'lang:' + ext, url, 'first_line:' + start], split_data)
            resolve(result)
        })
    })
}

hexo.extend.tag.register('ghcode', ghcode, {async: true})