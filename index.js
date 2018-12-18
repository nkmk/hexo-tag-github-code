var https = require('https')
var path = require('path')
var assign = require('lodash.assign');

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

function str2obj(s){
    l = s.slice(1,-1).split(',')
    o = {}
    l.forEach(function(element) {
        var pair = element.trim().split(':')
        var value = pair[1].trim().toLowerCase()
        if(value == 'true'){
            value = true
        }else if(value == 'false'){
            value = false
        }
        o[pair[0].trim()] = value
    })
    return o
}

function get_result(data, url, raw_url, start, stop, options, codeTag){
    var split_data = data.split(/\r\n|\r|\n/).slice(start - 1, stop).join('\n')
    var ext = path.extname(raw_url).slice(1)
    var basename = path.basename(raw_url)
    var arg
    if(options['cap']){
        arg = [basename, 'lang:' + ext, url, options['link']]
    }else{
        arg = ['lang:' + ext]
    }
    if(!options['re']){
        arg.push('first_line:' + start)
    }
    return codeTag(arg, split_data)
}

function ghcode(args){
    var codeTag = hexo.extend.tag.env.extensions.code.fn
    var url = args[0]
    var options = {}
    var start, stop

    var groups = url.match(/#(L(\d+))(-L(\d+))?/)
    if(groups && groups.length != -1){
        if(groups.length = 5){
            start = parseInt(groups[2], 10)
            stop = parseInt(groups[4], 10)
        }else if(groups.length = 3){
            start = parseInt(groups[2], 10)
            stop = parseInt(groups[2], 10)
        }
    }

    if(typeof(args[1]) == 'string' && args[1].charAt(0) == '{'){
        options = str2obj(args[1])
    }else if(start == undefined){
        start = args[1]
        stop = args[2]
    }
    if(typeof(args[3]) == 'string' && args[3].charAt(0) == '{'){
        options = str2obj(args[3])
    }
    if(start == undefined){
        start = 1
    }

    var cap_default = true
    var re_default = false

    if('github_code' in hexo.config){
        if('cap' in hexo.config.github_code){
            cap_default = hexo.config.github_code.cap
        }
        if('re' in hexo.config.github_code){
            re_default = hexo.config.github_code.re
        }
    }

    options = assign({
        cap: cap_default,
        re: re_default,
        link: 'link'
    }, options);

    var raw_url
    return new Promise(function(resolve, reject){
        if(url.search(/gist.github.com/) != -1){
            if(url.search(/#file-/) != -1){
                var s = url.match(/#file-[\w-]+/)
                var file = s[0].slice(6).replace(/(.*)-/, "$1.")
                var base = url.slice(0, s['index'])
                var js_url = base + '.js?file=' + file
            }else{
                var js_url = url + '.js'
            }
            get_code(js_url, function(data){
                raw_url = data.match(/https:\/\/gist.github.com[\w/:%#\$&\?\(\)~\.=\+\-]+/)[0].replace(/gist.github.com/, 'gist.githubusercontent.com').replace(/blob\//, '')
                get_code(raw_url, function(data){
                    resolve(get_result(data, url, raw_url, start, stop, options, codeTag))
                })
            })
        }else if(url.search(/github.com/) != -1){
            raw_url = url.replace(/github.com/, 'raw.githubusercontent.com').replace(/blob\//, '').replace(/#(L(\d+))(-L(\d+))?/, '')
            get_code(raw_url, function(data){
                resolve(get_result(data, url, raw_url, start, stop, options, codeTag))
            })
        }else{
            raw_url = url
            get_code(raw_url, function(data){
                resolve(get_result(data, url, raw_url, start, stop, options, codeTag))
            })
        }
    })
}

hexo.extend.tag.register('ghcode', ghcode, {async: true})