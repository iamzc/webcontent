var os = require('os');
var fs = require('fs');
var extend = require('node.extend');

var commonConf = require('../serv/common/commonConf.js');
var sConf = require('../serv/common/serverConf.js');

var items=['weather','location','relation','work','health','money','news','read'];

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
                };
                list(req, res);
            });
        }

        console.log("con.os.platform:" +JSON.stringify(content));
    },
    list: list,
    login:login,
    new:newDiary
}
function list(req, res){
    var now = new Date();
    var token = req.body.token;
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
        
        res.render('diary/list', {list:contents,login:false});
    });
}
function newDiary(req, res){
    res.render('diary/newDiary', {token:'111236'});
}
function login(req, res, params){
    var star = req.body.star;
    params = extend({msg:"", action:""}, params);
    var passwd = readPasswd();
        console.log(params.action + "   " + star + " p:" + passwd);
    if(params.action == "login" || passwd != star ){
        console.log(111);
        res.render('diary/login',params);
    }else{
        console.log(222);
        // 登录成功
        req.session.user = {date: new Date().getTime()};
        var action = req.body.action;
        console.log("action is:" + action);
        if(coms[action]){
            coms[action](req, res);
        }else{
            res.render('diary/login',{msg:"error path"});
        }
    }
}
function readPasswd(){
    var userdb = sConf.diary.userdb;
    var data = fs.readFileSync(userdb);
    if(data == null || data.length<1){
        return "lksjd&(&(&(HDIFhfsyfihwf(*(*OIFHF52s4d64fD&S(*F&D(FOSIDFJLFlj*&%$#$DIHF^$^#^%$^FDIOSFGDSF(O";
    }
    var contents = JSON.parse(data);
    return contents.passwd;
}
function post(req, res){
    var name = req.params.name;
    if(name != 'login' && ! req.session.user){
        login(req, res, {action:name});
        return;
    }
    if(coms[name]){
        coms[name](req, res);
    }else{
        login(req, res, {msg:"error path"});
    }
};
exports.get = function(req, res){
    post(req, res);
};
exports.post = post;
