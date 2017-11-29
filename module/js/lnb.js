var pageMain = (function(){

    var $target;

    var init = function($select){
        $target  = $($select);
        eventBind();
    };

    var eventBind = function(){

        $(document).on('click','.depth1>li>a',function(e){

            e.preventDefault();
            if($(this).parent('li').hasClass('open')){
                $(this).closest('li').removeClass('open');

            }else{

                if($(this).next('ul').hasClass('depth2')){
                    console.log();
                    $(this).closest('li').addClass('open');
                }
                else {
                    console.log('no');
                    return;
                }
            }

        });

    };

    var checkClass = function(_target){
        var is = _target.hasClass('open');
    };

    return {init:init}

})();


pageMain.init('#lnb');


