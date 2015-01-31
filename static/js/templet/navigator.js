define(['jquery/jquery-2.1.0.min'], function(jQuery){
    return{
        bindEvent: function(){
            $('#nav_index').click(function(){
                alert(101);
            });
            $('#nav_10000hours').click(function(){
                alert(102);
            });
        
        }
    }
});
