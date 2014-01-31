require(['jquery/jquery-2.1.0.min','common'],function(jQuery, c){
    var spacetime = $('#spacetime');
    var domaintime = $('#domaintime');

    function setRestTime(){
        spacetime.html(c.getRestTime('2014-10-20'));
        domaintime.html(c.getRestTime('2018-10-20'));
    }
    function interFunction(){
        return setRestTime;
    }
    setRestTime();
    setInterval(interFunction(), 1000);
    $('#navigator').load('views/navigator.ejs');
});
