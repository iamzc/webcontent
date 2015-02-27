var os = require('os');
var fs = require('fs');
var extend = require('node.extend');

var commonConf = require('../../serv/common/commonConf.js');
var sConf = require('../../serv/common/serverConf.js');

require('../common/time.js');
var dao = require('./diary_dao.js');

var items=['weather','location','relation','work','health','money','news','read','other'];


// 总入口. 命令列表, 定义了这个js可以处理的方法
var coms={
    save: save,
    list: list,
    login:login,
    new:newDiary
}
// 保存内容
function save(req, res){
    var token = req.body.token;
    var date = new Date().Format('yyyy-MM-dd');
    dao.find({"date":date}, function(content){
        // 查看时间, 原来有就更新, 没有就插入
        if(content == null){
            
            // 没有的插入一条新数据
            console.log("mu you");
            content = {};
            content.date = date;
            content.createTime = new Date();
            content.updateTime = new Date();
            for(var i=0; i< items.length; i++){
                var paramName = items[i];
                if(req.body[paramName]){
                    content[paramName] = req.body[paramName];
                }
            }
            dao.insert(content, function(){
                list(req, res);
            });
        }else{
            // 已经存在的就更新数据
            console.log("mu you cai guai");
            content.updateTime = new Date();
            for(var i=0; i< items.length; i++){
                var paramName = items[i];
                if(req.body[paramName]){
                    // 原来有内容就加到后面, 原来没有就设为参数的值
                    if(content[paramName]){
                        if(content[paramName] != req.body[paramName]){
                            content[paramName] = content[paramName] + os.EOL + req.body[paramName];
                        }
                    }else{
                        content[paramName] = req.body[paramName];
                    }
                        
                }
            }
            dao.update(content, function(){
                list(req, res);
            });
        }
        console.log("con.os.platform:" +JSON.stringify(content));
    });

}
// 显示记录列表
function list(req, res){
    var limit = 10;
    dao.list({}, limit, function(data){
        data = data || [];
        res.render('diary/list', {list:data, login:false});
    });
}
function newDiary(req, res){
    res.render('diary/newDiary', {token:'xxxxxx', path:commonConf.path});
}
// 登录
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
// 读取密码
function readPasswd(){
    var userdb = sConf.diary.userdb;
    var data = fs.readFileSync(userdb);
    if(data == null || data.length<1){
        return "lksjd&(&(&(HDIFhfsyfihwf(*(*OIFHF52s4d64fD&S(*F&D(FOSIDFJLFlj*&%$#$DIHF^$^#^%$^FDIOSFGDSF(O";
    }
    var contents = JSON.parse(data);
    return contents.passwd;
}
// post方法总入口 
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
// get 与post用同一套方法 
exports.get = function(req, res){
    post(req, res);
};
exports.post = post;
