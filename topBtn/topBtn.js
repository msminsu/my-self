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

        if(isVisible == 'open'){
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


    // bottomGap = 30 : 기본 간격 ,  bottomGap + 40 : 버튼 이미지 높이값
    $.fn.TopBtn = function( bottomGap=30 ){
        new TopBtn($(this),bottomGap +40);
         return this;
    };

    $.fn.Folding = function(isVisible = false){

        new Folding($(this), isVisible);
        return this;
    };

})(jQuery);




$(document).ready(function() {
   $('.goTop').TopBtn();
   $('.section-caution').Folding('open');
});






