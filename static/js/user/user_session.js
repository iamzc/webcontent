require(['../jquery/jquery-2.1.0.min','../common/time'],function(jQuery, c){
    var url = "/usersession";
    var sessionTimer = setInterval(function(){
        $.get(url,{},function(o){console.log(123)},"text");
    }, 45000);
});