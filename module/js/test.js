var pageMain = (function(){
    var init = function(){
        console.log(2);

        var bookSlider = $('.section ul').bxSlider({
            auto:false,
            autoHover:true,
            autoControls:false,
            controls:true,
            pager:false,
            moveSlides:1,
            slideMargin:0,
            autoReload:true,
            breaks:[{screen:0, slides:1},{screen:340, slides:2},{screen:450, slides:3},{screen:600, slides:4},{screen:767, slides:5},{screen:1000, slides:9}]
        });
    };
    return {init:init}
})();



