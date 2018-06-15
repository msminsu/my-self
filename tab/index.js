$(document).ready(function () {

    pageMain.init();
    // pageMain.activeTab(2,3);
});


var pageMain = (function () {
    var tab, topBtn;
    var checkedVote = false;
    //swiper

    tab = function (n, m) {

        var n = n || 0;
        var m = m || 0;

        var $tablist = $('.tab-server li');
        var $tabcons = $('.tab-con dl');

        $tabcons.eq(0).show();

        $tablist.on('click',function(){
            if($(this).hasClass('active')) return;
            var target =  $(this).index();
            resetTab($tablist,$tabcons);
            $tablist.eq(target).addClass('active');
            $tabcons.eq(target).show();
        });
    };

    function activeTab(n,m){

        var $tablist = $('.tab-server li');
        var $tabcons = $('.tab-con dl');
        checkedVote = true;
        resetTab($tablist,$tabcons);
        $tablist.eq(n).addClass('active');
        $tabcons.eq(n).show();
        $tabcons.eq(n).find('input').eq(m).prop('checked',true);

        if(checkedVote){
            console.log(checkedVote);
            $tabcons.find('label').on('click',function(e){
                e.preventDefault();
                alert('이미 투표 하셨습니다.');
            });

            $tablist.on('click',function(){
                $tabcons.eq(n).find('input').eq(m).prop('checked',true);
            });
        }

    }

    function resetTab($tablist,$tabcons){
        $tablist.removeClass('active');
        $tabcons.find('input').prop('checked',false);
        $tabcons.find('li').removeClass('active');
        $tabcons.hide();
    }


    topBtn = function () {
        var $topBtn = $('.btn-link-gotop');
        var startPoint = $('#header').height();
        var currentPos = $(window).scrollTop();

        $topBtn.hide();

        if (currentPos >= startPoint) {
            $topBtn.css({top: 'auto'}).show().addClass('fix');
        } else {
            $topBtn.hide();
        }

        $(window).scroll(function () {
            var nowPos = $(window).scrollTop();

            if (nowPos >= startPoint) {
                $topBtn.fadeIn();
            } else {
                $topBtn.fadeOut();
            }
        });

        $topBtn.on('click', function (e) {
            e.preventDefault();
            $('html, body').stop()
                .animate({
                    scrollTop: 0
                }, 800);
        });

    };


    return {
        init: function () {
            topBtn();
            tab ();
        },
        activeTab:function(n,m){
            activeTab(n,m);
        }

    }
})();


