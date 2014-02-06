var os = require('os');
var fs = require('fs');
var commonConf = require('../serv/common/commonConf.js');
var sConf = require('../serv/common/serverConf.js');

var items=['weather','location','relation','work','health','money','news'];

Date.prototype.Format = function (fmt) { //author: meizz 
var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
};
if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
for (var k in o)
if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
return fmt;
}

var coms={
    save: function(req, res){
        var token = req.body.token;
        if('111236' != token){
            res.render('diary/new',{});
            return;
        }
        var content = {};
        for(var i=0; i< items.length; i++){
            var paramName = items[i];
            if(req.body[paramName]){
                content[paramName] = req.body[paramName];
            }
        }
        content.date = new Date().Format('yyyy-MM-dd hh:mm:ss');
        var dir = sConf.diary.dir;
        var nl = os.EOL;
        var diaryFile = dir + '/content.json';
        var contents = [];
        fs.readFile(diaryFile, function(err,data){
            if(err){
                console.error(err);
                res.send('{"status":0, "msg":"Get content error!!"}');
            };
            if(data == null || data.length<1){
                data = '[]';
            }
            contents = JSON.parse(data);
            
            contents[contents.length] = content;
            writeContent(diaryFile, contents);
        });

        function writeContent(diaryFile, contents){
        
            fs.writeFile(diaryFile, JSON.stringify(contents), function (err) {
                if (err){
                    console.error('Can\'t save storeFile -');
                    res.send('{"status":0}');
                };
            });
        }

        console.log("con.os.platform:" +JSON.stringify(content));
    }
}
function list(req, res){
    var list = [];
    var dir = sConf.diary.dir;
    var diaryFile = dir + '/content.json';
    fs.readFile(diaryFile, function(err,data){
        if(err){
            res.send('{"status":0, "msg":"Get content error!!"}');
        };
        if(data == null || data.length<1){
            data = '[]';
        }
        contents = JSON.parse(data);
        
        res.render('diary/list', {list:contents});
    });
}
function newDiary(req, res){
    res.render('diary/newDiary', {token:'111236'});
}
exports.get = function(req, res){
    var name = req.params.name;
    if(name == 'list'){
        list(req, res);
    }else{
        res.render('diary/' + name, {path:commonConf.path});
    }
};

exports.post = function(req, res){
    var name = req.params.name;
    if(name == 'new'){
        var star = req.body.star;
        if('222136' == star){
            newDiary(req, res);
        }else{
            res.render('diary/new',{});
        }
    }else if(coms[name]){
        coms[name](req, res);
        list(req, res);
    }else{
      res.send("can not find the path " + name);
    }
}
