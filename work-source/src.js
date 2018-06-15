$(document).ready(function(){
    pageMain.init();


});


var pageMain = (function(){
    var quick, tab, slider, topBtn;


    //swiper

    slider = function(){
        var swiper = new Swiper('.swiper-container', {
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },

            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
        //navigation
        $('.pagination').click(function(){
            swiper.slideTo($(this).index());
            resetList($(this).index())
        })

        swiper.on('slideChange', function () {
            console.log('slide changed');
            resetList(swiper.activeIndex);
        });

        function resetList(num){
            $('.pagination').removeClass('active');
            $('.pagination').eq(num).addClass('active');
        }
    };


    topBtn = functon(){

        $(".goTop").append('<a href="#header"  data-goTop="goTop">Top</a>');

        var $topBtn = $('[data-goTop = "goTop"]');
        var bottomGap = $('[data-caution="caution"]').position().top + (70*(-1));//주위사항 위로 70px
        var startPoint = $('#header').height();
        var stopPoint =($(document).height()-$(window).height())-( $('.section-caution').height() + $('#footer').height());
        var currentPos = $(window).scrollTop();

        $topBtn.hide();

        if(currentPos >= startPoint) {
            if(currentPos >= stopPoint){
                $topBtn.css({top: bottomGap}).show().addClass('stay');
            }else {
                $topBtn.css({top:'auto'}).show().addClass('fix');
            }
        }else{
            $topBtn.hide();
        }

        $(window).scroll(function(){
            var nowPos = $(window).scrollTop();

            if(nowPos >= startPoint){
                $topBtn.fadeIn();
            }else{
                $topBtn.fadeOut();
            }

            if (!( stopPoint >=  nowPos)){
                $topBtn.css({top: bottomGap}).removeClass('fix').addClass('stay')
            }else{
                $topBtn.css({top:'auto'}).removeClass('stay').addClass('fix');
            }
        });

        $topBtn.on('click', function(e){
            e.preventDefault();
            $('html, body').stop()
                .animate({
                    scrollTop : 0
                },800);
        });

    }







    tab = function(){
        var $btns = $('.week-list>li>a');

        $btns.on('click', function(e){
            e.preventDefault();
            var $index = $(this).parents('li').index();
            showContents($index);

        });

    };


    var showContents =function(index){
        var $list = $('.week-list>li');
        var $contents = $('.week-list>li>div');

        $list.removeClass('active');
        $list.eq(index).addClass('active');

        $contents.hide();
        $contents.eq(index).show();
    };




    quick = function(){
        var $menu = $('.quick-menu ul li'),
            $contents = $('.target'),
            btnTop = $('.top');
        var scltop = $(window).scrollTop();


        currentChk(scltop);

        function currentChk(scltop){



            $.each($contents, function(idx, item){
                var $target = $contents.eq(idx),
                    i = idx,
                    targetTop = $target.offset().top;
                if (targetTop <= scltop) {
                    $menu.removeClass('on');
                    $menu.eq(i).addClass('on');
                }
                if (!(610 <= scltop)) $menu.removeClass('on');
            });

            if (scltop >= 610) $('.quick-menu').addClass('fix');
            else $('.quick-menu').removeClass('fix');

        }

        if (!(610 <= scltop)) $menu.removeClass('on');

        $menu.on('click','a', function(e){
            e.preventDefault();
            var target = $(this).attr("href"),
                offsetTop = $(target).offset().top;
            var $doc = $('html, body');
            $doc.stop()
                .animate({
                    scrollTop :offsetTop
                }, 800)
        });

        $(window).scroll(function(){
            var scltop = $(window).scrollTop();
            currentChk(scltop);
        });

        btnTop.on('click', function(e){
            e.preventDefault();
            $('html, body').stop()
                .animate({
                    scrollTop : 0
                },800)
        });
    };

    return {
        init: function(){
            /*quick();
            tab();*/
            topBtn();
            slider();
        },
        showContents: function(n){
            if(n>=6) return;
            showContents(n);
        }
    }
})();


