// Api Endpoint
// http://fanyi.youdao.com/openapi.do?keyfrom=<keyfrom>&key=<key>&type=data&doctype=<doctype>&version=1.1&q=要翻译的文本
// 版本：1.1，请求方式：get，编码方式：utf-8
// 主要功能：中英互译，同时获得有道翻译结果和有道词典结果（可能没有）
// 参数说明：
// 　type - 返回结果的类型，固定为data
// 　doctype - 返回结果的数据格式，xml或json或jsonp
// 　version - 版本，当前最新版本为1.1
// 　q - 要翻译的文本，必须是UTF-8编码，字符长度不能超过200个字符，需要进行urlencode编码
// 　only - 可选参数，dict表示只获取词典数据，translate表示只获取翻译数据，默认为都获取
// 　注： 词典结果只支持中英互译，翻译结果支持英日韩法俄西到中文的翻译以及中文到英语的翻译
// errorCode：
// 　0 - 正常
// 　20 - 要翻译的文本过长
// 　30 - 无法进行有效的翻译
// 　40 - 不支持的语言类型
// 　50 - 无效的key
// 　60 - 无词典结果，仅在获取词典结果生效
// {
//     "errorCode":0
//     "query":"good",
//     "translation":["好"], // 有道翻译
//     "basic":{ // 有道词典-基本词典
//         "phonetic":"gʊd"
//         "uk-phonetic":"gʊd" //英式发音
//         "us-phonetic":"ɡʊd" //美式发音
//         "explains":[
//             "好处",
//             "好的"
//             "好"
//         ]
//     },
//     "web":[ // 有道词典-网络释义
//         {
//             "key":"good",
//             "value":["良好","善","美好"]
//         },
//         {...}
//     ]
// }

function translate(data, callback) {
    if (!data) {
        return;
    }
    var keyFrom = "translateOnPage";
    var key = "1750005764";
    var query = data + "";
    $.ajax({
        url: 'https://fanyi.youdao.com/openapi.do?keyfrom=' + keyFrom + '&key=' + key + '&type=data&doctype=json&version=1.1&q=' + query,
        type: 'get',
        dataType: 'json',
        data: {}
    }).done(function (response) {
        var finalResult = response;
        console.log(finalResult);
        callback(finalResult);
    });
}
