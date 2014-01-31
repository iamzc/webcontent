define(function(){
    /** 传入参数格式 2014-10-12， 返回参数距离现在的时间 */
    function getRestTime(time){
        var times = time.split('-');
        var date = new Date(0);
        date.setFullYear(times[0]);
        date.setMonth(times[1] - 1);
        date.setDate(times[2]);
        var ms = date.getTime() - new Date().getTime();
        
        var minutes = 1000 * 60;
        var hours = minutes * 60;
        var days = hours * 24;
        var months = 30 * days;
        var result = '';
        if(ms > months){
            var temp = Math.floor(ms/months);
            result += temp + '个月';
            ms = ms - temp * months;
        }
        if(ms > days){
            var temp = Math.floor(ms/days);
            result += temp + '天';
            ms = ms - temp * days;
        }
        if(ms > hours){
            var temp = Math.floor(ms/hours);
            result += temp + '小时';
            ms = ms - temp * hours;
        }
        if(ms > minutes){
            var temp = Math.floor(ms/minutes);
            result += temp + '分';
            ms = ms - temp * minutes;
        }
        if(ms > 1000){
            var temp = Math.floor(ms/1000);
            result += temp + '秒';
        }
        return result;
    }

    return {
        getRestTime:getRestTime
    }
});
