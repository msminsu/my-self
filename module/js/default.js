$(document).ready(function(){
    pageMain.init();
});


var pageMain = (function(){
    var init, bindEvent, slider, calender,banner,subMenu;

    init = function() {
        slider();
        //calender.init();
        banner();
        bindEvent();
        subMenu();

    };

    slider = function(){
        var bookSlider = $('.bookContent ul').bxSlider({
            auto:true,
            autoHover:true,
            autoControls:false,
            controls:true,
            pager:false,
            moveSlides:1,
            maxSlides:1,
            autoReload:true,
            slideMargin:0
        });

        $('.book-controls li a.prev').on('click',function(){
            if(bookSlider != null ){
                bookSlider.goToPrevSlide();
            }
            return false;
        });
        $('.bannerBtn li a.next').on('click',function(){
            if(bookSlider != null){
                bookSlider.goToNextSlide();
            }
            return false;
        });



        $('.bannerImg').bxSlider({
            mode:'horizontal',
            auto:false,
            maxSlides : 6,
            slideWidth:167,
            slideMargin:11,
            moveSlides:1,
            controls: false,
            autoControlsCombine:true});
    };


    banner = function(){
        var bannerLength = $('div.bannerBox ul.bannerImg').length;
        var bannerWrap = $('div.banner');
        if(bannerWrap.hasClass('noAuto')){
            var autoType = false;
        }else{
            var autoType = true;
        }

        var bannerSlider;

        if (bannerLength > 0) {
            bannerSlider = $('div.bannerBox ul.bannerImg').bxSlider({
                slideWidth:167,
                speed:500,
                moveSlides:1,
                maxSlides:6,
                auto:autoType,
                autoHover:true,
                pager:false,
                controls:false
            });
        }

        $('.bannerBtn li a.prev').on('click',function(){
            if(bannerSlider != null ){
                bannerSlider.goToPrevSlide();
            }
            return false;
        });
        $('.bannerBtn li a.next').on('click',function(){
            if(bannerSlider != null){
                bannerSlider.goToNextSlide();
            }
            return false;
        });
        $('.bannerBtn li a.stop').on('click',function(){
            if(bannerSlider != null){
                bannerSlider.stopAuto();
            }
            $(this).removeClass('active');
            $('.bannerBtn li a.play').addClass('active');
            return false;
        });
        $('.bannerBtn li a.play').on('click',function(){
            if(bannerSlider != null){
                bannerSlider.startAuto();
            }
            $(this).removeClass('active');
            $('.bannerBtn li a.stop').addClass('active');
            return false;
        });
        /*배너 끝*/
    };

    calender = (function(){
        var addClassDay;
        var y, m, d;

        var holiDay = ["2017-11-6","2017-11-7","2017-11-13","2017-11-20","2017-11-27"], //휴일
            eventDay = ["2017-11-23"];  //행사


        addClassDay = function(date){
            m = date.getMonth(), d = date.getDate(), y = date.getFullYear();
            if($.inArray(y + '-' +(m+1) + '-' + d,holiDay) != -1) return [false, "hoil"];
            if($.inArray(y + '-' +(m+1) + '-' + d,eventDay) != -1) return [false, "event"];
            return [false];
        };
        return {
            init: function(){

                $( "#datepicker" ).datepicker({
                    showMonthAfterYear : true,
                    dayNames: [ "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT" ],
                    dayNamesMin: [ "S", "M", "T", "W", "T", "F", "S" ],
                    monthNames: [
                        "<em class='number'>.01</em>",
                        "<em class='number'>.02</em>",
                        "<em class='number'>.03</em>",
                        "<em class='number'>.04</em>",
                        "<em class='number'>.05</em>",
                        "<em class='number'>.06</em>",
                        "<em class='number'>.07</em>",
                        "<em class='number'>.08</em>",
                        "<em class='number'>.09</em>",
                        "<em class='number'>.10</em>",
                        "<em class='number'>.11</em>",
                        "<em class='number'>.12</em>"
                    ],
                    beforeShowDay: addClassDay
                });

                $('#datepicker .nowDate').html($.datepicker.formatDate('dd', new Date()));
            }
        }
    })();

    bindEvent = function(){
        // TAB
        $(document).on('click', '.tabMenu a', function(){
            var target = this.getAttribute('href').replace('#','');
            var $box = $(this).closest('.tab');
            $('.tabMenu li').removeClass('on');
            $(this).parent('li').addClass('on');

            $box.find('.con').hide();
            $box.find('[data-tab="'+target+'"]').show();
        });
    };

    subMenu = function(){
        $( ".gnbMenu li" ).on('mouseenter',function(){
            $(this).find('.subMenu').css('display','block');
        });
        $( ".gnbMenu li" ).on('mouseleave',function(){
            $(this).find('.subMenu').css('display','none');
        });
        $( ".gnbMenu" ).on('mouseleave',function(){
            $('.subMenu').css('display','none');
        });

    };

    return {
        init: init
    }
})();