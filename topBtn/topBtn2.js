
var plugin = function(){
    (function($){
        function TopBtn(target,gap){


            target.append('<a href="#header"  title="상단으로 이동" data-goTop="goTop">Top</a>');

            this.$topBtn =$('[data-goTop *= "goTop"]');
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

                    /*  $('html, body').stop()
                          .animate({
                              scrollTop :$(document).height() +$(window).height()
                          },1000);*/
                }
            });
        };

        function FullHeader(target){
            var $window = $(window);
            var h = $window.height();

            target.css({
                'background-size': 'cover'
            });

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

            target.css({
                'position':'fixed',
                'background-size': 'cover',
                'width': '100%',
                'max-width': '640px'
            });


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

            $('[data-fix = "fix"]').css({'margin-top':this.$coverHeight});
        };

        function CoachMarks(settings){

            if(!nc.promokit.cookie.getcookie('CoachMarkInfo')) {

                if(settings.direction === 'vertical'){
                    $('body').append('<div class="guide">상하로 이동하세요.</div>');
                }
                else{
                    $('body').append('<div class="guide horizental">좌우로 이동하세요.</div>');
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

                if(settings.cookie) {
                    nc.promokit.cookie.setcookie('CoachMarkInfo', true);
                }
            }

        };

        // bottomGap = 30 : 기본 간격 ,  bottomGap + 40 : 버튼 이미지 높이값
        $.fn.TopBtn = function( options ){
            var settings = $.extend({bottomGap:30, btnHeight: 40},options);
            new TopBtn($(this),settings.bottomGap + settings.btnHeight);
            return this;
        };

        $.fn.Folding = function(options){
            var settings = $.extend({open:false},options);
            new Folding($(this), settings.open);
            return this;
        };

        $.fn.FullHeader = function(){
            if (nc.promokit.util.isMobile()) {
                new FullHeader($(this));
                return this;
            }
        };

        $.fn.FixHeader = function(){
            if (nc.promokit.util.isMobile()){
                new FixHeader($(this));
                return this;
            }

        };

        $.fn.CoachMark = function(options){
            var settings = $.extend({direction:'vertical',cookie:false},options);
            if (nc.promokit.util.isMobile()) {
                new CoachMarks(settings);
                return this;
            }
        };
    })(jQuery);
};

export default plugin();