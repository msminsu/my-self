/*

$(document).ready(function(){

    $('#fullpage').fullpage({
        anchors: ['page1', 'page2', 'page3', 'page4', 'page5'],
        sectionsColor: ['#000', '#00b6f2', '#ad5bf2','#16d3ad','#ce955d'],

        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['','2D typo', '3D typo','Calligraphy', 'Graphic'],
        responsiveWidth: 1100,
        onLeave: function(index, nextIndex, direction){
            if(nextIndex==1){
                $('#fp-nav').fadeOut();
            }
        },
        afterLoad: function(anchorLink, index){
            if(index !==1){
                $('#fp-nav').fadeIn();
            }else{
                $('#fp-nav').hide();
            }
        }
    });

});

*/

$(document).ready(function() {
    $('#fullpage').fullpage({
        anchors: ['page1', 'page2', 'page3', 'page4', 'page5'],
        sectionsColor: ['#000', '#00b6f2', '#ad5bf2','#16d3ad','#ce955d'],
        hybrid:true,  // 해당 부분 마크업에 fp-normal-scroll 추가
    });
});


// http://jsfiddle.net/97tbk/1191/    부분 스크롤
/*$(document).ready(function() {
    $('#fullpage').fullpage({
        anchors: ['page1', 'page2', 'page3', 'page4', 'page5'],
        sectionsColor: ['#000', '#00b6f2', '#ad5bf2','#16d3ad','#ce955d'],
        hybrid:true,  // 해당 부분 마크업에 fp-normal-scroll 추가
    });
});*/


//
// $(document).ready(function() {
//     $('#fullpage').fullpage({
//         anchors: ['firstPage', 'secondPage', '3rdPage', '4thPage'],
//         sectionsColor: ['#4A6FB1', '#939FAA', '#323539'],
//         scrollOverflow: true
//     });
// });
// https://alvarotrigo.com/fullPage/examples/scrolling.html
