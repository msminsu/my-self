$(document).ready(function(){
    pageMain.init();
});

var pageMain = (function(){
    var quick;

    quick = function(){
        var $menu = $('.quick-menu ul li'),
            $contents = $('.target'),
            btnTop = $('.top'),
            $doc = $('html, body');
        var scltop = $(window).scrollTop();

        if (!(744 <= scltop)) $menu.removeClass('on');

        $menu.on('click','a', function(e){
            e.preventDefault();
            var target = $(this).attr("href"),
                offsetTop = $(target).offset().top;

            $doc.stop().animate({scrollTop :offsetTop}, 800);
        });

        $(window).scroll(function(){
            var scltop = $(window).scrollTop();
            $.each($contents, function(idx, item){
                var $target = $contents.eq(idx),
                    i = idx,
                    targetTop = $target.offset().top;

                if (targetTop <= scltop) {
                    $menu.removeClass('on');
                    $menu.eq(i).addClass('on');
                }
                if (!(744 <= scltop)) $menu.removeClass('on');
            });

            if (scltop >= 744) {
                $('.quick-menu').addClass('fix');
            }
            else{ $('.quick-menu').removeClass('fix');}
        });
        btnTop.on('click', function(e){
            e.preventDefault();
            $('html, body').stop().animate({scrollTop : 0},800);
        });
    };

    return {
        init: function(){
            quick();
            console.log('1111');
        }
    }
})();
