var Nav;
Nav = (function () {

    var isSelect = null;

    var Navi = function () {
    };

    Navi.prototype = (function () {

        function fullinIt(obj) {
            var con = obj.containerClass;
            var hmax = 0;
            var navW = 0;

            $("." + con + ">ul").find("ul").each(function () {
                if (hmax < $(this).height()) hmax = $(this).height();
                $(this).width(($(this).siblings("a").outerWidth()));
            }).height(hmax);


            $(".subBg").height(hmax + 1).css("display", "none");
            $("." + con + ">ul>li>a").on({mouseenter: fullDepth1Over, focusin: fullDepth1Over});
            $("." + con + ">ul").on({mouseleave: fullDepth1Out});
            $("." + con + " a").on({focusout: fullDepthOut});
            $("." + con + ">ul>li>ul>li>a").on({
                mouseenter: fullDepth2Over,
                focusin: fullDepth2Over,
                mouseleave: fullDepth2Out,
                focusout: fullDepth2Out
            });
        }

        function fullDepth1Over(e) {
            var $target = $(e.currentTarget);

            if (isSelect != null && isSelect != $target.parent("li")) {
                isSelect.find("a").removeClass("select");
            }
            ;
            $target.addClass("select");
            $(".depth2").slideDown();
            $(".subBg").slideDown();
            isSelect = $target.parent("li");
        }

        function fullDepth1Out(e) {

            var $target = $(e.currentTarget);
            if (e.type == "mouseleave") {
                $target.find("ul").stop().slideUp();
                $(".subBg").stop().slideUp();
            }
            $target.find('a').removeClass("select");
        }

        function fullDepthOut(e) {
            var lastMenu = $(e.target).parents(".depth1").find("li").length - 1;
            var lastCheck = $(e.currentTarget).parents(".depth1").find("li").eq(lastMenu);
            if (lastCheck.text() == $(e.target).parent("li").text()) {
                $('.depth1 ul').stop().slideUp();
                $(".subBg").slideUp();
                $(".depth1").find('a').removeClass("select");
            }
            console.log($(".nav>ul"), $(e.currentTarget).parents(".depth1"));
        }

        function fullDepth2Over(e) {

            var $target = $(e.currentTarget);
            if (e.type == "focusin") {
                $target.parents(".depth2").siblings("a").addClass("select");
                isSelect.find("a").removeClass("select");
            }
            $target.addClass("over");
            var depth1 = $target.parents(".depth1>li").index();
            $target.parents(".depth1").children("li").find("a").removeClass("select");
            $target.parents(".depth1>li").find("a").addClass("select");
        }

        function fullDepth2Out(e) {
            var $target = $(e.currentTarget);
            $target.removeClass("over");
        }

        return {
            fullnavInit: fullinIt
        };

    }());

    return Navi;

}());



$(document).ready(function(){

    var navi1 = new Nav();
    navi1.fullnavInit({containerClass: "nav"});

});
