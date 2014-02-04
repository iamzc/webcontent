var os=require('os');
var commonConf = require('../serv/common/commonConf.js');
var sConf = require('../serv/common/serverConf.js');

var items=['weather','location','relation','work','health','money'];
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
        var dir = sConf.diary.dir;
        var nl = os.EOL;
        console.log("con.os.platform:" +JSON.stringify(content));
    }
}
function list(req, res){
    var list = [{},{}];
    res.render('diary/list', {list:list});
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
