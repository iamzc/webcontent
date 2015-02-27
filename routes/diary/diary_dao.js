var sConf = require('../../serv/common/serverConf.js');
var MongoClient = require('mongodb').MongoClient, format = require('util').format;


// 查看content的时间是否存在, 有则更新, 无则插入
function insert(content, callback){
    callback = typeof callback == 'function' ? callback : null;
    
    var saveContent = function(db, collection){
        collection.insert(content, {w:1}, function(err, docs) {
            db.close();
            if(callback != null){
                callback();
            }
	    });
    }
    connectDiary(saveContent);
}
// 查看content的时间是否存在, 有则更新, 无则插入
function update(content, callback){
    callback = typeof callback == 'function' ? callback : null;
    
    var saveContent = function(db, collection){
        collection.update({"date":content.date}, content, {w:1}, function(err, docs) {
            db.close();
            if(callback != null){
                callback();
            }
	    });
    }
    connectDiary(saveContent);
}
// 查找单个内容
function find(query, callback){
    callback = typeof callback == 'function' ? callback : null;
    // If callback is null throw an exception
    if(callback == null)
        throw new Error("no callback function provided");
    
    var findOne = function(db, collection){
        collection.findOne(query, function(e, item){
            if(e)throw e;
            callback(item);
            db.close();
        });
    }
    connectDiary(findOne);
}

// 返回内容列表
function list(query, limit, callback){
    callback = typeof callback == 'function' ? callback : null;
    // If callback is null throw an exception
    if(callback == null)
        throw new Error("no callback function provided");
    
    var getList = function(db, collection){
        var cursor = collection.find(query).sort({"date":-1}).limit(limit);
        cursor.toArray(function(err, docs){
            if(err) throw err;
            callback(docs);
            db.close();
        });
    }
    connectDiary(getList);
}


function connectDiary(callback){
    callback = typeof callback == 'function' ? callback : null;
    // If callback is null throw an exception
    if(callback == null)
        throw new Error("no callback function provided");

    
    
    MongoClient.connect(sConf.db.url, function(err, db) {
        if(err) throw err;

        var collection = db.collection('diary');
        callback(db, collection);
    })
}

exports.insert = insert;
exports.update = update;
exports.find = find;
exports.list = list;