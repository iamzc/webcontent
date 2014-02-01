
/*
 * GET home page.
 */
var commonConf = require('../serv/common/commonConf.js');

exports.index = function(req, res){
  res.render('index', { title: 'Express', path:commonConf.path});
};
