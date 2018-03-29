// TOP 버튼

//var 1
/*jQuery(function($){


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
});*/

//var 2
/*
var TopBtn = (function () {

    var $topBtn, $window, bottomGap, currentPos, startPoint, stopPoint;

    var init = function(opts){
        $(".goTop").append('<a href="#header"  data-goTop="goTop">Top</a>');

        $window = $(window);
        $topBtn = $('[data-goTop = "goTop"]');
        bottomGap = $('[data-caution="caution"]').position().top +(opts.bottomGap *(-1));//주위사항 위로
        startPoint = $('#header').height();
        stopPoint =($(document).height()-$(window).height())-( $('.section-caution').height() + $('#footer').height());
        currentPos = $window.scrollTop();

        $topBtn.hide();

        positionChk();
        scrollEvt();
        moveEvt();
    };

    function positionChk(){
        if(currentPos >= startPoint) {
            if(currentPos >= stopPoint){
                $topBtn.css({top: bottomGap}).show().addClass('stay');
            }else {
                $topBtn.css({top:'auto'}).show().addClass('fix');
            }
        }else{
            $topBtn.hide();
        }
    }

    function scrollEvt(){
        $window.on('scroll',function(e){
            var nowPos = $(this).scrollTop();

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
    }

    function moveEvt(){
        $topBtn.on('click', function(e){
            e.preventDefault();
            $('html, body').stop()
                .animate({
                    scrollTop : 0
                },800);
        });
    }

    return {
        options: init
    }

})();


new TopBtn.options({   // 엘리먼트
    bottomGap:70,    // caution 상단으로 부터의 간격
});
*/





//var 3
/*
function TopBtn(gap){
    $(".goTop").append('<a href="#header"  data-goTop="goTop">Top</a>');
    this.$topBtn =$('[data-goTop = "goTop"]');
    this.$window = $(window);
    this.bottomGap = $('[data-caution="caution"]').position().top +(gap *(-1));
    this.currentPos = this.$window.scrollTop();
    this.startPoint = $('#header').height();
    this.stopPoint = ($(document).height()-$window.height())-( $('.section-caution').height() + $('#footer').height());

    this.init();
};

TopBtn.prototype.init = function(){
    this.positionChk();
    this.scrollEvt();
    this.moveEvt();
};

TopBtn.prototype.positionChk = function(){
    if(this.currentPos >= this.startPoint) {
        if(this.currentPos >= this.stopPoint){
            this.$topBtn.css({top: this.bottomGap}).show().addClass('stay');
        }else {
            this.$topBtn.css({top:'auto'}).show().addClass('fix');
        }
    }else{
        $topBtn.hide();
    }
};

TopBtn.prototype.scrollEvt = function(){
    var that = this;
    this.$window.on('scroll',function(){
        var nowPos = $(this).scrollTop();

        if(nowPos >= that.startPoint){
            that.$topBtn.fadeIn();
        }else{
            that.$topBtn.fadeOut();
        }

        if (!( that.stopPoint >=  nowPos)){
            that.$topBtn.css({top: that.bottomGap}).removeClass('fix').addClass('stay')
        }else{
            that.$topBtn.css({top:'auto'}).removeClass('stay').addClass('fix');
        }
    });
};

TopBtn.prototype.moveEvt = function(){
    this.$topBtn.on('click', function(e){
        e.preventDefault();
        $('html, body').stop()
            .animate({
                scrollTop : 0
            },800);
    });
};

*/



/*

jQuery(function($){

    var $caution = $('.section-caution');
    var $disc = $('.section-caution .disc-wrap');

    $(document).on('click','.section-caution .btn-arrow', function(){
        if($caution.hasClass('show')) {
            $caution.removeClass('show');
            $disc.slideUp();
        }else{
            $caution.addClass('show');
            $disc.slideDown();

            $('html, body').stop()
                .animate({
                    scrollTop :$(document).height() +$(window).height()
                },1000);
        }
    });

});

*/







(function($){
    function TopBtn(target,gap){

        target.append('<a href="#header"  data-goTop="goTop">Top</a>');

        this.$topBtn =$('[data-goTop = "goTop"]');
        this.$caution = $('.section-caution');
        this.$window = $(window);
        this.bottomGap = this.$caution.position().top +( gap *(-1));
        this.currentPos = this.$window.scrollTop();
        this.startPoint = $('#header').height();
        this.stopPoint = ($(document).height()-this.$window.height())-( this.$caution.height() + $('#footer').height() + gap);

        this.init();
    };

    TopBtn.prototype.init = function(){
        this.positionChk();
        this.scrollEvt();
        this.goTopEvt();
    };

    TopBtn.prototype.positionChk = function(){
        if(this.currentPos >= this.startPoint) {
            if(this.currentPos >= this.stopPoint){
                this.$topBtn.css({top: this.bottomGap}).show().addClass('stay');
            }else {
                this.$topBtn.css({top:'auto'}).show().addClass('fix');
            }
        }else{
            this.$topBtn.hide();
        }
    };

    TopBtn.prototype.scrollEvt = function(){
        var that = this;
        this.$window.on('scroll',function(){
            var nowPos = $(this).scrollTop();

            if(nowPos >= that.startPoint){
                that.$topBtn.fadeIn();
            }else{
                that.$topBtn.fadeOut();
            }

            if (!( that.stopPoint >=  nowPos)){
                that.$topBtn.css({top: that.bottomGap}).removeClass('fix').addClass('stay')
            }else{
                that.$topBtn.css({top:'auto'}).removeClass('stay').addClass('fix');
            }
        });
    };

    TopBtn.prototype.goTopEvt = function(){
        this.$topBtn.on('click', function(e){
            e.preventDefault();
            $('html, body').stop()
                .animate({
                    scrollTop : 0
                },800);
        });
    };



    function Folding(target, isVisible){
        this.$caution = target;
        this.$panel = this.$caution.find('.disc-wrap');
        this.$foldingBtn = $('.btn-arrow');

        this.init(isVisible);
    }

    Folding.prototype.init = function( isVisible ){

        if(isVisible){
            this.$caution.addClass('show');
            this.$panel.show();
        }

        this.toggleEvt();
    };

    Folding.prototype.toggleEvt = function(){

        var that = this;

        this.$foldingBtn.on('click', function(){
            if(that.$caution.hasClass('show')) {
                that.$caution.removeClass('show');
                that.$panel.slideUp();
            }else{
                that.$caution.addClass('show');
                that.$panel.slideDown();

                $('html, body').stop()
                    .animate({
                        scrollTop :$(document).height() +$(window).height()
                    },1000);
            }
        });
    };

    function FullHeader(target){
        var $window = $(window);
        var h = $window.height();

        target.height(h);

        $(window).resize(function(){
            target.height($window.height());
        });
    };

    function FixHeader(target){
        this.$window = $(window);
        this.$coverHeight = null;
        this.$value = null;
        this.$header = target;
        var that =this;

        this.init();

        this.$window.resize(function(){
           that.screenChk();
        });

        this.$window.scroll(function(e){
            var scrollY = e.currentTarget.scrollY;

            that.$value = (that.$coverHeight - (scrollY)) / that.$coverHeight;

            if (that.$value >= 0) {
                that.$header.css('opacity',that.$value);
            }

            if(scrollY >= that.$coverHeight){
                that.$value = 0;
                that.$header.css('opacity',0);
            }
        });

    };

    FixHeader.prototype.init = function(){
        this.screenChk();
    };

    FixHeader.prototype.screenChk = function(){
        this.$coverHeight = this.$window.height();
        this.$value = (this.$coverHeight - (this.$window.scrollTop())) / this.$coverHeight;

        this.$header.height(this.$coverHeight).css('opacity',this.$value);

        this.$header.next('div').css({'margin-top':this.$coverHeight});
    };


    function CoachMarks(settings){

        if( /*!nc.promokit.cookie.getcookie('SliderGuideCookie')*/  true) {

            if(settings === 'vertical'){
                $('body').append('<div class="guide"></div>');
            }
            else{
                $('body').append('<div class="guide horizental"></div>');
            }

            var $guide = $('.guide');

            setTimeout(function(){
                if( $guide.length ) $guide.fadeOut(function(){
                    $(this).remove()
                });
            }, 2000);

            $(window).on('touchstart',function(){
                $guide.fadeOut(function(){
                    $(this).remove()
                });
            });
           // nc.promokit.cookie.setcookie('SliderGuideCookie', true);
        }

    };


    // bottomGap = 30 : 기본 간격 ,  bottomGap + 40 : 버튼 이미지 높이값
    $.fn.TopBtn = function( options ){
        var settings = $.extend({bottomGap:30, btnHeight: 40},options);
        new TopBtn($(this),settings.bottomGap + settings.btnHeight);
         return this;
    };

    $.fn.Folding = function(options){
        var settings = $.extend({isVisible:false},options);
        new Folding($(this), settings.isVisible);
        return this;
    };

    $.fn.FullHeader = function(){
        new FullHeader($(this));
        return this;
    };

    $.fn.FixHeader = function(){
        new FixHeader($(this));
        return this;
    };

    $.fn.CoachMark = function(options){
        var settings = $.extend({direction:'vertical'},options);
        new CoachMarks(settings.direction);
        return this;
    };


})(jQuery);




$(document).ready(function() {


    if(/(android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini)/i.test(navigator.userAgent.toLowerCase())) {

        //$('#header').FullHeader();
        // $('#header').FixHeader();


    }
    $('.goTop').TopBtn();
    $('body').CoachMark({direction:'horizental'});
    $('.section-caution').Folding();
});

















/* setTimeout(function(){
     if( $('.guide').length ) $('.guide').fadeOut(function(){
         $(this).remove()
     });
 }, 2000);*/



/* if( !nc.promokit.cookie.getcookie('SliderGuideCookie') ){
            $('body').append('<div class="guide"></div>');
            nc.promokit.cookie.setcookie('SliderGuideCookie', true);
        }*/



//모바일 체크
/*
var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
*/



// var isMobile = /(android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini)/i.test(navigator.userAgent.toLowerCase());