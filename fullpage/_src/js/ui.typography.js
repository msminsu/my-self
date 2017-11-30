
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

