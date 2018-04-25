var Nav = (function(){
    var isSelect = null;
    var Navi = function(){};

    Navi.prototype =(function() {

        function depth1Over(e) {
            var $target = $(e.currentTarget);

            if (isSelect != null && isSelect != $target.parent("li")) {
                isSelect.find("ul").slideUp();
                isSelect.find("a").removeClass("select");
            }
            ;
            if (!$target.siblings("ul").is(":animated")) {
                $target.siblings("ul").slideDown();
                $target.addClass("select");
            }
            isSelect = $target.parent("li");
        }

        function depth1Out(e) {
            var $target = $(e.currentTarget);
            if (e.type == "mouseleave") {
                $target.find("ul").slideUp();
            }
            $target.find('a').removeClass("select");
        }

        function depth2Over(e) {

            var $target = $(e.currentTarget);
            if (e.type == "focusin") {
                $target.parents(".depth2").siblings("a").addClass("select");
            }
            $target.addClass("over");
        }

        function depth2Out(e) {
            var $target = $(e.currentTarget);
            $target.removeClass("over");
        }

        function inIt(obj) {
            var con = obj.containerClass;
            $("." + con + ">ul>li>a").on({ mouseenter: depth1Over, focusin: depth1Over});
            $("." + con + ">ul>li").on({mouseleave: depth1Out, focusout: depth1Out});
            $("." + con + ">ul>li>ul>li>a").on({mouseenter: depth2Over, focusin: depth2Over, mouseleave: depth2Out, focusout: depth2Out});
        }
        return {
            navInit: inIt
        };
    }());

    return Navi;

}());
