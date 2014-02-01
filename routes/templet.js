
/*
 * navigator templet
 */
var commonConf = require('../serv/common/commonConf.js');

exports.getTemplet = function(req, res){
    var name = req.params.name;
    res.render('templet/' + name, {path:commonConf.path});
};
