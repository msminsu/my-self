
/* ===============================================
Date : 2013-10-01 ~ 2014-10-30
Description : UI 관련 스크립트 함수 정의(탭,레이어,네비게이션,배너 등)
=============================================== */

var bsUI = {}

$.extend(bsUI, (function(){
    var _Class = {

        /* ==================================================================
            레이어팝업
        ================================================================== */
        layerPop :function(id,w,event){ //레이어id, 클래스, 레이어 가로값
            var _thisElement; //레이어 띄우는 요소 저장 변수
            var _obj = $(id);

            _obj.find('.layerpop').css({
                width : w+'px',
                marginLeft : -(w/2)+'px'
            });
            _obj.fadeIn('fast');
            _obj.find('.layer-header').find('.layer-close').focus();

            if(event){
                if(!event) event = window.event; //for firefox
                _thisElement = (event.target) ? event.target : event.srcElement;
            }

            layerResize(id); //레이어 컨텐츠 길이에 따라 높이 조절

            _obj.find('.js-layer-close').on('click',function(){
                $(this).parents('.layerpop-wrap').fadeOut('fast');
                if(event){
                    _thisElement.focus(); //레이어띄운 요소에 포커스
                }
            });

            _obj.find('.js-layer-close').focusout(function(){
                $(this).parents('.layerpop-wrap').find('.layer-inner').focus();
            });

            _obj.find('.tooltip-close').on('click',function(){
                $(this).parents('.tooltip-layer').fadeOut('fast');
                if(event){
                    _thisElement.focus(); //레이어띄운 요소에 포커스
                }
            });

            /* 레이어 컨텐츠 높이에 따라 리사이징 */
            function layerResize(id){
                var _obj = $(id);
                var titH = _obj.find('.layer-header').outerHeight(); //레이어 헤더 높이
                var conH = _obj.find('.layer-body').outerHeight(); //레이어 컨텐츠 높이
                var bottomH = _obj.find('.layer-bottom').outerHeight(); //레이어 컨텐츠 높이
                var screenH = parseInt($(window).height()); //스크린 높이
                var popMaxH = screenH - 182;
                var gap = 2*30; //레이어 상하 마진의 합

                if(conH > popMaxH){ //레이어 컨텐츠가 스크린보다 길면
                    _obj.find('.layer-inner').css({
                        'height' : popMaxH +'px',
                        'overflow' : 'auto'
                    });
                    _obj.find('.layerpop').css('margin-top',-((screenH - gap)/2)+'px');
                }else{
                    _obj.find('.layer-inner').css('height',conH+'px');
                    _obj.find('.layerpop').css('margin-top',-((conH + titH + bottomH)/2)+'px');
                }
            }
            $(window).resize(function(){layerResize(id);}) //윈도우 창 리사이즈 할 때마다 함수 호출
        },

        /* ==================================================================
            탭
        ================================================================== */
        tab : function(){
            // 탭과 컨텐츠 구조 따로
            $('.js-tabA').each(function(n){
                var _this = $(this);
                var tabOn = $(this).find('li.on').length;
                _this.find('a.js-tab').each(function(n){
                    if (tabOn == 0){
                        $(this).parents('li').removeClass('on');
                        $($(this).attr('href')).hide();
                        if(n==0){
                            $(this).parents('li').addClass('on');
                            $($(this).attr('href')).show();
                        }
                    }
                    $(this).on('click', function(){
                        _this.find('a.js-tab').each(function(n){
                            $(this).parents('li').removeClass('on');
                            $($(this).attr('href')).hide();
                        });
                        $(this).parents('li').addClass('on');
                        $($(this).attr('href')).show();
                        return false;
                    });
                });
            });

            // 탭과 컨텐츠 논리적 구조
            $('.js-tabB').each(function(n){
                var _this = $(this);
                _this.find('a.js-tab').each(function(n){
                    $(this).parents('li').removeClass('on');
                    $(this).next('.con').hide();
                    if(n==0){
                        $(this).parents('li').addClass('on');
                        $(this).next('.con').show();
                    }
                    $(this).on('click', function(){
                        _this.find('a.js-tab').each(function(n){
                            $(this).parents('li').removeClass('on');
                            $(this).next('.con').hide();
                        });
                        $(this).parents('li').addClass('on');
                        $(this).next('.con').show();
                    });
                });
            });

            // 탭과 컨텐츠 구조 따로
            $('.js-tabC').each(function(n){
                var _this = $(this);
                _this.find('a.js-tab').each(function(n){
                    $(this).parents('li').removeClass('on');
                    if(n==0){
                        $(this).parents('li').addClass('on');
                    }
                    $(this).on('click', function(){
                        _this.find('a.js-tab').each(function(n){
                            $(this).parents('li').removeClass('on');
                        });
                        $(this).parents('li').addClass('on');
                        return false;
                    });
                });
            });
        },

        /* ==================================================================
            아코디언
        ================================================================== */
        accordion : function(){
            $('.js-accordion').each(function(n){
                var _this = $(this);

                _this.find('.js-accordion-header').each(function(n){
                    $(this).on('click', function(){
                        _this.find('.js-accordion-header').each(function(n){
                            $(this).next().hide();
                        });   //2014-04-08
                        $('.js-accordion li a').css('font-weight','normal');
                        $(this).css('font-weight','bold');
                        $(this).next().show();
                    });
                });
            });
        },


        /* ==================================================================
            롤링배너 (배너 2개이상 노출 롤링시 사용)
        ================================================================== */
        banner : function(target,max){
            var liLength = $("li",target).length;
            var liWidth = $("li",target).width();
            var liOne = $(".js-banner-wrap").find("li").width();
            var ul = $(".js-banner-wrap",target);
            var maxWidth = max * liOne;
            var ulWidth = liLength * liWidth;
            var prev = $(".js-ctr.js-prev",target);
            var next = $(".js-ctr.js-next",target);
            var input = $("input:hidden",target);
            $(".js-banner-inner",target).width(maxWidth);
            $(".js-banner-wrap",target).width(ulWidth);

            $(".js-banner-wrap>ul>li").eq(1-1).addClass('on');

            if (liLength > max){
                $(next).addClass("on").attr("status",liLength+2);
            }
            var nextGo = function(){
                var li_Lst = $(".js-banner-wrap>ul>li").filter('.on').index();

                var value = $(input).val() * 1;
                if ((max-liLength) != value) {
                    $(input).val(value - 1);
                    $(prev).addClass("on").attr("status",-1);
                    $(ul).stop(true,true).animate({"left":"-="+liOne},200);

                    $(".js-banner-wrap>ul>li").eq(li_Lst).removeClass('on');
                    $(".js-banner-wrap>ul>li").eq(li_Lst+1).addClass('on');
                }
                if ((max-liLength+1) == value) {
                    $(".js-ctr.js-next.on",target).removeClass("on").removeAttr("status");
                }
            };
            var prevGo = function(){
                var li_Lst = $(".js-banner-wrap>ul>li").filter('.on').index();

                var value = $(input).val() * 1;
                if (value < 0) {
                    $(input).val(value + 1);
                    $(next).addClass("on").attr("status",liLength+2);
                    $(ul).stop(true,true).animate({"left":"+="+liOne},200);

                    $(".js-banner-wrap>ul>li").eq(li_Lst).removeClass('on');
                    $(".js-banner-wrap>ul>li").eq(li_Lst-1).addClass('on');
                }
                if (value == -1){
                    $(".js-ctr.js-prev.on",target).removeClass("on").removeAttr("status");
                }
            };

            //탭이동시 이벤트
            var nowVar, newVar;
            if(max != 1 && liLength > max){
                $('.img-view').find('div').hide();
                $('.img-view').find('div:first').show();

                var lolling = $('.smartbr-gall').find('li');
                var viewImg = $('.img-view').find('div');

                $("li a",target).each(function(n){
                    $(this).attr("status",n+1);
                    if ($(this).find('.nomouseover').length >= 1) {
                    }  else {
                        $(this).mouseover(function(){
                            $(this).append("<span></span>");
                        }, function(){
                            $(this).find('span').remove();
                        });
                    }

                    $(this).click(function(){
                        $('.img-view').find('div').hide();
                        $(this).parents('.smartbr-gall').find('.img-view').children().eq(n).fadeIn(500);
                    });
                });

                $("a",target).blur(function(){
                    nowVar = ($(this).attr("status"));
                });
                $("li a",target).focus(function(){
                    newVar = ($(this).attr("status"));
                    if((nowVar-newVar) == -1){
                        nextGo();
                    }else if((nowVar-newVar) == 1){
                        prevGo();
                    }else if((nowVar-newVar) == -2){
                        for(i=0; i<liLength; i++){prevGo();}
                    }else if((nowVar-newVar) == 2){
                        for(i=0; i<liLength; i++){nextGo();}
                    }
                });
            }

            //버튼클릭함수 실행(최초1회 실행)
            this.btnClickEvent = function(){
                $(".js-ctr.js-next",target).on("click",function(){nextGo();});
                $(".js-ctr.js-prev",target).on("click",function(){prevGo();});
                $(".js-ctr:not('on')").on("click",function(){return false;});
            };
        },

        banner2 : function(target,max){
            var liLength = $("li",target).length;
            var liWidth = $("li",target).width();
            var liOne = $(".gallery-box").find("li").width() + 10;
            var ul = $(".js-banner-wrap",target);
            var maxWidth = liLength * liWidth +250;
            var ulWidth = liLength * liWidth;
            var prev = $(".btn-toggle2.prev a",target);
            var next = $(".btn-toggle2.next a",target);
            var input = $("input:hidden",target);
            $(".js-banner-inner",target).width(670);
            $(".js-banner-wrap",target).width(maxWidth);
            $(".js-banner-wrap>li").eq(1-1).addClass('on');

            if (liLength > max){
                $(next).addClass("on").attr("status",liLength+2);
            }
            var nextGo = function(){
                var li_Lst = $(".js-banner-wrap>li").filter('.on').index();

                var value = $(input).val() * 1;
                if ((max-liLength) != value) {
                    $(input).val(value - 1);
                    $(prev).addClass("on").attr("status",-1);
                    $(ul).stop(true,true).animate({"left":"-="+liOne},200);

                    $(".js-banner-wrap>li").eq(li_Lst).removeClass('on');
                    $(".js-banner-wrap>li").eq(li_Lst+1).addClass('on');
                }
                if ((max-liLength+1) == value) {
                    $(".btn-toggle2.next a",target).removeClass("on").removeAttr("status");
                }
            };
            var prevGo = function(){
                var li_Lst = $(".js-banner-wrap>li").filter('.on').index();

                var value = $(input).val() * 1;
                if (value < 0) {
                    $(input).val(value + 1);
                    $(next).addClass("on").attr("status",liLength+2);
                    $(ul).stop(true,true).animate({"left":"+="+liOne},200);

                    $(".js-banner-wrap>li").eq(li_Lst).removeClass('on');
                    $(".js-banner-wrap>li").eq(li_Lst-1).addClass('on');
                }
                if (value == -1){
                    $(".btn-toggle2.prev a",target).removeClass("on").removeAttr("status");
                }
            };

            //버튼클릭함수 실행(최초1회 실행)
            this.btnClickEvent = function(){
                $(".btn-toggle2.next a",target).on("click",function(){nextGo();});
                $(".btn-toggle2.prev a",target).on("click",function(){prevGo();});
            };
        },


        /* ==================================================================
            탭 배너 함수 (배너 1개 노출시 사용)
        ================================================================== */
        bannerTabFunc : function(){
            var target = $('.js-banner-tab');

            target.each(function(n){
                var cmm = 0; //배너갯수에 따른 변수
                var timerID; //타이머 함수 담을 변수
                var bannerRolling = false; //재생.정지 구분 변수(기본 정지)
                var _this = $(this).find('li');
                _this.each(function(n){
                    $(this).find('h5, h3').removeClass('on');
                    $(this).find('div.js-banner-con').css('z-index',0);
                    if(n == 0){
                        $(this).find('h5, h3').addClass('on');
                        $(this).find('div.js-banner-con').css('z-index',1);
                    }
                    $(this).find('h5, h3').mouseover(function(){
                        _this.each(function(n){
                            $(this).find('h5, h3').removeClass('on');
                            $(this).find('div.js-banner-con').css('z-index',0);
                        });
                        $(this).addClass('on');
                        $(this).next('div.js-banner-con').css('z-index',1);
                        cmm = n;
                    });
                    $(this).find('.js-banner-con a').focus(function(){
                        _this.each(function(n){
                            $(this).find('h5, h3').removeClass('on');
                            $(this).find('div.js-banner-con').css('z-index',0);
                        });
                        $(this).parent('div.js-banner-con').prev('h5, h3').addClass('on');
                        $(this).parent('div.js-banner-con').css('z-index',1);
                        cmm = n;
                    });
                });

                //재생버튼 함수
                $(this).find('.control-btns .play').click(function(){
                    bannerRolling = true;
                    timerID = setInterval(function(){bannerTabStartRooling();},3000);
                    $(this).hide();
                    $(this).parents('.control-btns').find('.stop').show().focus();
                })
                //정지버튼 함수
                $(this).find('.control-btns .stop').click(function(){
                    bannerRolling = false;
                    clearInterval(timerID);
                    $(this).hide();
                    $(this).parents('.control-btns').find('.play').show().focus();
                })
                //이전버튼 함수
                $(this).find('.control-btns .prev').click(function(){
                    $(this).parents('.control-btns').find('.play').show();
                    $(this).parents('.control-btns').find('.stop').hide();
                    bannerRolling = false;
                    clearInterval(timerID);

                    cmm--;
                    if(cmm < '0'){
                        cmm = '2';
                    }

                    _this.eq(cmm).find('h5, h3').trigger('mouseover');
                })
                //다음버튼 함수
                $(this).find('.control-btns .next').click(function(){
                    $(this).parents('.control-btns').find('.play').show();
                    $(this).parents('.control-btns').find('.stop').hide();
                    bannerRolling = false;
                    clearInterval(timerID);

                    cmm++;
                    if(cmm >= '3'){
                        cmm = '0';
                    }

                    _this.eq(cmm).find('h5, h3').trigger('mouseover');
                })

                //자동재생 함수
                var bannerTabStartRooling = function(){
                    cmm++;
                    if(cmm >= '3'){
                        cmm = '0';
                    }
                    _this.eq(cmm).find('h5, h3').trigger('mouseover');
                }
            });
        },


        /* ==================================================================
            input placeholder
        ================================================================== */
        placeholder : function(){
            var input = $('.js-placeholder').next('input');
            var label = $('.js-placeholder');
            input.on({
                focus : function(){
                    $(this).prev('.js-placeholder').css('visibility', 'hidden');
                },
                blur : function(){
                    if ($(this).val() == '' && $(this).html() == '') {
                        $(this).prev('.js-placeholder').css('visibility', 'visible');
                    }
                    else {
                        $(this).prev('.js-placeholder').css('visibility', 'hidden');
                    }
                },
                change : function(){
                    if ($(this).val() == '' && $(this).html() == '') {
                        $(this).prev('.js-placeholder').css('visibility', 'visible');
                    }
                    else {
                        $(this).prev('.js-placeholder').css('visibility', 'hidden');
                    }
                }
            }).blur();
            label.on('click', function(){
                $(this).css('visibility', 'hidden');
                $(this).next('input').focus();
            })
        },

        /* ==================================================================
        GNB
    ================================================================== */

        gnbAction : function(){
            var autoWidth = 0;
            var allWidth = $('.suball ul.dep1').width();
            $('.suball ul.dep1').find('li').each(function(i) {
                autoWidth += $(this, i).outerWidth(true);
            });

            var allPad = Math.round((allWidth - autoWidth) / 2);
            $('.suball ul.dep1').css({
                'padding-left':allPad
            });

            var dep1 = $('div.suball').find('>ul.dep1>li');
            var dep2 = $('div.suball').find('ul.dep2', dep1);
            var dep3 = $('div.suball').find('ul.dep3>li', dep2);
            var dep4 = $('div.suball').find('ul.dep4>li', dep3);

            var ieVersion = $.browser.version;
            if (ieVersion == 7.0)
            {
                //1depth 메뉴
                dep1.find('>a').on('mouseover focusin', function(){
                    var idx = $(this).parent('li').index();
                    $('div.gnbbox').eq(idx).width('400px');
                    $('div.gnbbox').find('ul.dep3, ul.dep4').hide();
                    dep1.removeClass('on');
                    $('#gnbNav').addClass('open');
                    dep2.find('li').removeClass('on');
                    $(this).parent('li').addClass('on');
                    $('div.gnbbox').hide();
                    $('div.gnbbox').eq(idx).show();
                    $('div.gnbbox').eq(idx).find('ul.dep2>li:first').addClass('on');
                    $('div.gnbbox').eq(idx).find('ul.dep2>li:first').find('>ul.dep3').show();
                    $('div.sub-right').show();
                    $('div.banner').show();
                    $('div.suball').addClass('open');

                    var dep2Ul = $('div.gnbbox').eq(idx).find('>ul.dep2').outerHeight();
                    var dep3Ul = $('div.gnbbox').eq(idx).find('>ul.dep2').find('>li:first-child').find('>ul.dep3').outerHeight();

                    if (dep2Ul >= dep3Ul){
                        dep3Ul = dep2Ul;
                    }else {
                        dep3Ul = dep3Ul;
                    }

                    $('div.gnbbox').eq(idx).css('height', dep3Ul + 'px');

                    if ($('div.gnbbox').eq(idx).find('ul.dep2>li:first').find('>ul.dep3').length < 1)
                    {
                        $('div.gnbbox').eq(idx).find('ul.dep2>li:first').removeClass('on');
                        $('div.gnbbox').eq(idx).width('200px');
                    }
                });

                /*
                dep1.find('>a').on('focusout', function(){
                    var idx = $(this).parent('li').index();
                    $('div.gnbbox').eq(idx).find('>ul.dep2>li:first').find('>a').focus();
                });
                */

                //GNB영역 tab/tab+shift키 적용
                dep1.find('>a').on('keydown', function(e){
                    var keyCode = e.keyCode || e.which;
                    if(keyCode == 9) {
                        if(e.shiftKey) {
                            //백키적용
                        } else {
                            //해당서브메뉴로 포커싱
                            var idx = $(this).parent('li').index();
                            $('div.gnbbox').eq(idx).find('>ul.dep2>li:first').find('>a').focus();
                        }
                    }
                });

                $('div.gnb').on('mouseleave', function(){
                    $(this).find('div.sub-right').hide();
                    $(this).find('div.banner').hide();
                    $(this).find('div.gnbbox').hide();
                    $('div.suball').removeClass('open');
                    $(this).find('ul').find('li').removeClass('on');
                });

                //GNB영역 키보드 포커스 아웃 처리
                $('#gnbNav .sub-right li:last-child a:last-child').on('focusout', function(){
                    $('div.gnbbox').hide();
                    $('div.sub-right').hide();
                    $('div.banner').hide();
                });
                $('#pathNav .path-area a').on('focusin', function(){
                    $('div.gnbbox').hide();
                    $('div.sub-right').hide();
                    $('div.banner').hide();
                });

                //2depth 메뉴
                dep2.find('>li>a').on('mouseenter focus' , function(){
                    dep2.find('>li').removeClass('on');
                    $(this).parents('div.gnbbox').width('400px');
                    $(this).parent().addClass('on');
                    $(this).parent().siblings('li').find('>ul.dep3').hide();
                    $(this).next('ul.dep3').show();
                    $(this).next('ul.dep3').find('li').removeClass('on');

                    var thisIdx = $(this).parent().index();
                    var subPd = thisIdx * $(this).parent().outerHeight();
                    $(this).next('ul.dep3').css('padding-top', subPd + 35);

                    var dep2Ul = $(this).parents('ul.dep2').outerHeight();
                    var dep3Ul = $(this).next('ul.dep3').outerHeight();

                    if (dep2Ul >= dep3Ul){
                        dep3Ul = dep2Ul;
                    }else {
                        dep3Ul = dep3Ul;
                    }

                    $(this).parents('div.gnbbox').css('height', dep3Ul + 'px');

                    if ($(this).next('ul.dep3').length < 1)
                    {
                        $(this).parents('div.gnbbox').width('200px');
                    }
                });

                dep2.find('li:last').find('a').on('focusout', function(){
                    var idx = parseInt($(this).parents('div.gnbbox').index()) - 1;
                    $('div.suball').find('.dep1').find('li').eq(idx).next('li').find('a').focus();
                });

                function winOpen(){
                    window.open("/bhp/jsp/sml/html/BHPSML100IDXV1AM.jsp", "myWin", "width=1000, height=600");
                    var a = 1;
                }

                dep2.find('>li>a.popFocus').on('click', function(){
                    winOpen();
                    $(this).unbind('focusout');
                });

                $('div.gnbbox:last ul.dep2 li:last').find('a').on('focusout', function(){
                    $(this).parents('div.gnbbox').hide();
                    $('.banner').find('li:first').find('a').focus();
                });

                //3depth 메뉴
                dep3.find('>a').on('mouseenter focus', function(){
                    $(this).parent().siblings('li').removeClass('on');
                    $(this).parent().addClass('on');
                    $(this).parents('div.gnbbox').width('600px');
                    dep3.find('ul.dep4').hide();
                    $(this).next().show();

                    var prtIdx = $(this).parent().parent().parent().index();
                    var thisIdx = $(this).parent().index();
                    var subPd = prtIdx * $(this).parent().outerHeight();
                    var subPd2 = thisIdx * $(this).parent().outerHeight();
                    $(this).next('ul.dep4').css('padding-top', subPd + subPd2 + 35);

                    var dep2Ul = $(this).parents('ul.dep2').outerHeight();
                    var dep3Ul = $(this).parents('ul.dep3').outerHeight();
                    var dep4Ul = $(this).next('ul.dep4').outerHeight();

                    if (dep2Ul >= dep3Ul){
                        dep3Ul = dep2Ul;
                    }else {
                        dep3Ul = dep3Ul;
                    }

                    if (dep3Ul >= dep4Ul){
                        dep4Ul = dep3Ul;
                    }else {
                        dep4Ul = dep4Ul;
                    }


                    $(this).parents('div.gnbbox').css('height', dep4Ul + 'px');

                    if ($(this).next('ul.dep4').length < 1)
                    {
                        $(this).parents('div.gnbbox').width('400px');
                    }
                });

                $('.sub-right').find('a.myset').on('blur', function(){
                    $('div.gnbbox').hide();
                    $(this).parents('div.sub-right').hide();
                    $('div.banner').hide();
                    $('.suball').find('>ul').css('height', '40px');
                    $('.suball').find('>ul>li').removeClass('on');
                });
            } else {
                //1depth 메뉴
                dep1.find('>a').on('mouseenter focus', function(){
                    var idx = $(this).parent('li').index();
                    $('div.gnbbox').eq(idx).width('400px');
                    $('div.suball>ul>li').removeClass('on');
                    $('#gnbNav').addClass('open');
                    $(this).parent().addClass('on');
                    $('div.gnbbox').hide();
                    $('div.gnbbox').find('ul.dep3, ul.dep4').hide();
                    $('div.gnbbox').eq(idx).show();
                    dep2.find('li').removeClass('on');
                    dep3.removeClass('on');
                    $('div.gnbbox').eq(idx).find('ul.dep2 li:first').addClass('on');
                    $('div.gnbbox').eq(idx).find('ul.dep2 li:first').find('>ul.dep3').show();
                    $('div.sub-right').show();
                    $('div.banner').show();

                    var dep2Ul = $('div.gnbbox').eq(idx).find('ul.dep2').outerHeight();
                    var dep3Ul = $('div.gnbbox').eq(idx).find('ul.dep2 li:first').find('>ul.dep3').outerHeight();
                    var subRight = $('div.sub-right').height();

                    if (dep2Ul >= dep3Ul){
                        dep3Ul = dep2Ul;
                    }else {
                        dep3Ul = dep3Ul;
                    }

                    $('div.gnbbox').eq(idx).stop().animate({'height': dep3Ul + 'px'}, 200);

                    if ($('div.gnbbox').eq(idx).find('ul.dep2>li:first').find('>ul.dep3').length < 1)
                    {
                        $('div.gnbbox').eq(idx).find('ul.dep2>li:first').removeClass('on');
                        $('div.gnbbox').eq(idx).width('200px');
                    }
                });

                /*
                dep1.find('>a').on('focusout', function(){
                    var idx = $(this).parent('li').index();
                    $('div.gnbbox').eq(idx).find('>ul.dep2>li:first').find('>a').focus();
                });
                */

                //GNB영역 tab/tab+shift키 적용
                dep1.find('>a').on('keydown', function(e){
                    var keyCode = e.keyCode || e.which;
                    if(keyCode == 9) {
                        if(e.shiftKey) {
                            //백키적용
                        } else {
                            //해당서브메뉴로 포커싱
                            var idx = $(this).parent('li').index();
                            $('div.gnbbox').eq(idx).find('>ul.dep2>li:first').find('>a').focus();
                        }
                    }
                });

                $('div.gnb').on('mouseleave', function(){
                    $(this).find('ul.dep1>li').removeClass('on');
                    $(this).parents('#gnbNav').removeClass('open');
                    $(this).find('div.gnbbox').hide();
                    $(this).find('div.sub-right').hide();
                    $(this).find('div.banner').hide();
                });

                //GNB영역 키보드 포커스 아웃 처리
                $('#gnbNav .sub-right li:last-child a:last-child').on('focusout', function(){
                    $('div.gnbbox').hide();
                    $('div.sub-right').hide();
                    $('div.banner').hide();
                });
                $('#pathNav .path-area a').on('focusin', function(){
                    $('div.gnbbox').hide();
                    $('div.sub-right').hide();
                    $('div.banner').hide();
                });

                //2depth 메뉴
                dep2.find('>li>a').on('mouseenter focus' , function(){
                    dep2.find('>li').removeClass('on');
                    $(this).parent().addClass('on');
                    $(this).parents('div.gnbbox').width('400px');
                    $(this).parent().siblings('li').find('>ul.dep3').hide();
                    $(this).next('ul.dep3').show();
                    $(this).next('ul.dep3').find('li').removeClass('on');

                    var thisIdx = $(this).parent().index();
                    var subPd = thisIdx * $(this).parent().outerHeight();
                    $(this).next('ul.dep3').css('padding-top', subPd + 35);

                    var dep2Ul = $(this).parents('ul.dep2').outerHeight();
                    var dep3Ul = $(this).next('ul.dep3').outerHeight();
                    var subRight = $('div.sub-right').outerHeight();

                    if (dep2Ul >= dep3Ul){
                        dep3Ul = dep2Ul;
                    }else {
                        dep3Ul = dep3Ul;
                    }

                    $(this).parents('div.gnbbox').stop().animate({'height': dep3Ul + 'px'}, 200);

                    if ($(this).next('ul.dep3').length < 1)
                    {
                        $(this).parents('div.gnbbox').width('200px');
                    }
                });

                dep2.find('li:last').find('a').on('focusout', function(){
                    var idx = parseInt($(this).parents('div.gnbbox').index()) - 1;
                    $('div.suball').find('.dep1').find('li').eq(idx).next('li').find('a').focus();
                });

                function winOpen(){
                    window.open("/bhp/jsp/sml/html/BHPSML100IDXV1AM.jsp", "myWin", "width=1000, height=600");
                    var a = 1;
                }

                dep2.find('>li>a.popFocus').on('click', function(){
                    winOpen();
                    $(this).unbind('focusout');
                });

                $('div.gnbbox:last ul.dep2 li:last').find('a').on('focusout', function(){
                    $(this).parents('div.gnbbox').hide();
                    $('.banner').find('li:first').find('a').focus();
                });

                //3depth 메뉴
                dep3.find('>a').on('mouseenter focus', function(){
                    $(this).parent().siblings('li').removeClass('on');
                    $(this).parent().addClass('on');
                    $(this).parents('div.gnbbox').width('600px');
                    dep3.find('ul.dep4').hide();
                    $(this).next().show();

                    var prtIdx = $(this).parent().parent().parent().index();
                    var thisIdx = $(this).parent().index();
                    var subPd = prtIdx * $(this).parent().outerHeight();
                    var subPd2 = thisIdx * $(this).parent().outerHeight();
                    $(this).next('ul.dep4').css('padding-top', subPd + subPd2 + 35);

                    var dep2Ul = $(this).parents('ul.dep2').outerHeight();
                    var dep3Ul = $(this).parents('ul.dep3').outerHeight();
                    var dep4Ul = $(this).next('ul.dep4').outerHeight();
                    var subRight = $('div.sub-right').outerHeight();

                    if (dep2Ul >= dep3Ul){
                        dep3Ul = dep2Ul;
                    }else {
                        dep3Ul = dep3Ul;
                    }

                    if (dep3Ul >= dep4Ul){
                        dep4Ul = dep3Ul;
                    }else {
                        dep4Ul = dep4Ul;
                    }

                    $(this).parents('div.gnbbox').stop().animate({'height': dep4Ul + 'px'}, 200);

                    if ($(this).next('ul.dep4').length < 1)
                    {
                        $(this).parents('div.gnbbox').width('400px');
                    }

                });

                dep4.find('>a').on('mouseenter focus', function(){
                    dep4.removeClass('on');
                    $(this).parent().addClass('on');
                });

                $('.sub-right').find('a.myset').on('blur', function(){
                    $('div.gnbbox').hide();
                    $(this).parents('div.sub-right').hide();
                    $('div.banner').hide();
                    $('.suball').css('height', '40px');
                    $('.suball').find('>ul>li').removeClass('on');
                });
            }
        },

        /* ==================================================================
            GNB 베너
        ================================================================== */
        gnbBanner : function(){
            $('.roll-banner').each(function(){
                var element1 = $(this).find('li');
                var element2 = $(this).find('li');
                var n1 = $(element1).length;
                var n2 = $(element2).length;
                var r1 = Math.floor(Math.random() * n1);
                var r2 = Math.floor(Math.random() * n2);
                $(element1).hide();
                $(element2).hide();
                $(element1[r1]).show();
                $(element2[r2]).show();
            });
        },

        /* ==================================================================
            전체메뉴
        ================================================================== */
        allmenuAction : function(){
            var dep1 = $('ul.all-dep2>li').find('ul.all-dep3');
            var dep2 = $('ul.all-dep4', dep1);

            //1depth 메뉴
            dep1.find('>li>a').on('click', function(){

                if($(this).next('ul.all-dep4').css('display') != 'block'){

                    dep2.parents().siblings().children('ul.all-dep4').slideUp('fast', function(){
                        $(this).siblings('a').removeClass('on');
                    });
                    $(this).next('ul.all-dep4').slideDown('fast', function(){
                        $(this).siblings('a').addClass('on');
                        $(this).siblings('a.buNone').removeClass('on');
                    });

                }else{
                    $(this).next('ul.all-dep4').slideUp(500);
                    $(this).removeClass('on');
                }
            });
        },

        /* ==================================================================
            LNB
        ================================================================== */
        lnbAction : function(){
            var dep1 = $('div.lnb').find('ul.dep1');
            var dep2 = $('div.lnb').find('ul.dep2', dep1);
            var dep3 = $('div.lnb').find('ul.dep3', dep2);

            //1depth 메뉴
            dep1.find('>li>a').on('click', function(){
                if($(this).next('ul.dep2').css('display') != 'block'){
                    $(this).parent().siblings().children('ul.dep2').slideUp('fast', function(){
                        $(this).parent('li').removeClass('on');
                    });
                    $(this).next('ul.dep2').slideDown('fast', function(){
                        $(this).parent('li').addClass('on');
                    });
                }else{
                    //$(this).next('div.dep2').hide();
                    $('ul.dep2>li').removeClass('on');
                }
            });
            //2depth 메뉴
            dep2.find('>li>a').on('click', function(){
                if($(this).next('ul.dep3').css('display') != 'block'){
                    $(this).parent().siblings().children('ul.dep3').slideUp('fast', function(){
                        $(this).parent('li').removeClass('on');
                    });
                    $(this).next('ul.dep3').slideDown('fast', function(){
                        $(this).parent('li').addClass('on');
                    });
                }else{
                    //$(this).next('div.dep2').hide();
                    $('ul.dep3>li').removeClass('on');
                }
            });

        },

        /* ==================================================================
            링크 레이어 보이기
        ================================================================== */
        moreLayerToggle : function(){
            /*$('.js-more-wrap').find('.js-more-nav').on('click', function(){
                $('.js-more-link').not($(this).siblings('.js-more-link')).hide();
                if($(this).siblings('.js-more-link').css('display') != 'block'){
                    $(this).siblings('.js-more-link').show();
                }else{
                    $(this).siblings('.js-more-link').hide();
                }
            });

            $('.js-more-wrap').find('a').on('blur', function(){
                var _this = $(this).parents('.js-more-wrap');
                setTimeout(function(){
                    if(_this.find('a:focus').length == 0){
                        _this.find('.js-more-link').hide();
                    }
                },0)
            });*/
            $('.js-more-wrap').find('.js-more-nav').on('mouseenter', function(){
                $(this).siblings('.js-more-link').show();
            });
            $('.js-more-wrap').on('mouseleave', function(){
                $(this).find('.js-more-link').hide();
            });
            $('.js-more-wrap').find('.js-more-nav').on('focus', function(){
                $(this).siblings('.js-more-link').show();
            });

            $('.js-more-wrap').find('a').on('blur', function(){
                var _this = $(this).parents('.js-more-wrap');
                setTimeout(function(){
                    if(_this.find('a:focus').length == 0){
                        _this.find('.js-more-link').hide();
                    }
                },0)
            });
        },

        /* ==================================================================
        기간설정함수
        ================================================================== */
        getCalculatedDate : function(iYear, iMonth, iDay, seperator){
            var gdCurDate = new Date() ;//현재 날짜 객체를 얻어옴.

            //현재 날짜에 날짜 계산.
            gdCurDate.setYear( gdCurDate.getFullYear() + iYear );
            gdCurDate.setMonth( gdCurDate.getMonth() + iMonth );
            gdCurDate.setDate( gdCurDate.getDate() + iDay );

            //실제 사용할 연, 월, 일 변수 받기.
            var giYear = gdCurDate.getFullYear();
            var giMonth = gdCurDate.getMonth()+1;
            var giDay = gdCurDate.getDate();

            //월, 일의 자릿수를 2자리로 맞춘다.
            giMonth = "0" + giMonth;
            giMonth = giMonth.substring(giMonth.length-2,giMonth.length);
            giDay   = "0" + giDay;
            giDay   = giDay.substring(giDay.length-2,giDay.length);

            //display 형태 맞추기.
            return giYear + seperator + giMonth + seperator +  giDay;
        },

        /* ==================================================================
        기간설정함수
        ================================================================== */
        adjustDate : function(y,m,d,s){
            $("#from").val(bsUI.getCalculatedDate(y,m,d,s))
            $("#to").val(bsUI.getCalculatedDate(0,0,0,s))
        },

        /* ==================================================================
            화면설정
        ================================================================== */
        layoutView : function(){
            $('#pathNav').find('a.left-no').on('click', function(){
                $(this).addClass('on');
                $('a.left-yes').removeClass('on');
                //$('.path-sec').addClass('on');
                //$('.path-sec>a').addClass('onPath');
                $('#content').addClass('view-chg');
                $('#lnbNav').stop();
                $('#lnbNav').animate({
                    'margin-left' : '-161px', opacity : 0
                }, {
                    duration : 500 ,complete : function(){
                        $(this).hide();
                    }
                });

                $('#contentWrap').animate({
                    'margin-left' : '-161px', width : 1000
                }, 500);

                // 화면확장시 링크
                /*$('.path-sec.on>a.onPath').click(function(){
                    $('.gnbbox').css('width', '200px');
                    $('div.suball').show();
                    $('div.suball').find('div.gnbbox').show();

                    var dep2Ht = $(this).siblings().find('ul.dep2').outerHeight();
                    var subRight = $('div.sub-right').outerHeight();

                    $('div.gnbbox').find('>ul').each(function() {
                        var h = dep2Ht;
                        if (h >= subRight){
                            subRight = h;
                        }else{
                            subRight = subRight;
                        }

                    });
                    gnbMove();

                    function gnbMove(){
                        if ( dep2Ht < 260) {
                            $('.suball, .gnbbox, .gnbbox, .gnb .banner li').stop().animate({'height': '260px'}, 200);
                        } else {
                            if (dep2Ht < subRight)
                            {
                                $('.suball, .gnbbox, .gnbbox, .gnb .banner li').stop().animate({'height': subRight + 'px'}, 200);
                            } else{
                                $('.suball, .gnbbox, .gnbbox, .gnb .banner li').stop().animate({'height': dep2Ht + 'px'}, 200);
                            }
                        }
                    }
                });
*/
                /*var browserCheck = new ini.util.DeviceUtil();
                if(!($('.ini_GridComponent') == undefined)){
                    var gridEvent = new ini.component.grid.event.GridEventManager();
                    gridEvent.lnbHide();
                }*/
                // 2014.08.11 공통 박형신
                // 공통 그리드 사이즈 추가
                try {
                    incLastCellWidth(200);
                } catch (e) {}
                // 공통 그리드 사이즈 추가 끝
            });

            $('#pathNav').find('a.left-yes').on('click', function(){
                $(this).addClass('on');
                $('a.left-no').removeClass('on');
                $('.path-sec').removeClass('on');
                $('.path-sec').children('div').hide();
                $('.path-sec>a').removeClass('onPath');
                $('#content').removeClass('view-chg');
                $('#lnbNav').animate({
                    'margin-left' : '0', opacity : 100
                },{
                    duration : 500 ,complete : function(){
                        $(this).show();
                    }
                });

                $('#contentWrap').animate({
                    'margin-left' : '0', width : 800
                }, 500);

                $('.path-sec>a').click(function() {
                    $(this).next('div.path-nav').hide();
                });

                //var browserCheck = new ini.util.DeviceUtil();
                /*if(!($('.ini_GridComponent') == undefined)){
                    var gridEvent = new ini.component.grid.event.GridEventManager();
                    gridEvent.lnbHide();
                }*/

                // 2014.08.11 공통 박형신
                // 공통 그리드 사이즈 추가
                try{
                    decLastCellWidth(200);
                }catch(e){}
                // 공통 그리드 사이즈 추가 끝
            });

        },


        /* ==================================================================
            패밀리 사이트
        ================================================================== */
        familysite : function(){
            $('#footer').find('div.relation>a').on('click', function(){
                $('div.relation>div').show();
                $('div.relation').addClass('on');
            });

            $('#footer').find('div.relation>div>a.close').on('click', function(){
                $('div.relation>div').hide();
                $('div.relation').removeClass('on');
            });

            $('#footer').find('div.family>a').on('click', function(){
                $('div.family>div').show();
                $('div.family').addClass('on');
            });

            $('#footer').find('div.family>a').focus(function(){
                $('div.relation>div').hide();
                $('div.relation').removeClass('on');
            });

            $('#footer').find('div.relation>a').focus(function(){
                $('div.family>div').hide();
                $('div.family').removeClass('on');
            });

            $('.award li a').focus(function(){
                $('div.family>div').hide();
                $('div.family').removeClass('on');
            });

            $('.faq-btn a').focus(function(){
                $('div.relation>div').hide();
                $('div.relation').removeClass('on');
            });

            $('#footer').find('div.family>div>a.close').on('click', function(){
                $('div.family>div').hide();
                $('div.family').removeClass('on');
            });
        },

        /* ==================================================================
            이용안내
        ================================================================== */
        useGuide : function(){
            $('div.acc1 a.btn').toggle(function() {
                if ($(this).siblings('ul.txt-type1').css('display', 'block'))
                {
                    $(this).siblings('ul.txt-type1').hide();
                    $(this).siblings('em').hide();
                    $(this).parents('div.acc1').removeClass('acc1-on');
                    $(this).parents('div.acc1').children('p').show();
                    $(this).html('이용가이드 열림');
                }
            }, function(){
                if ($(this).siblings('ul.txt-type1').css('display', 'none'))
                {
                    $(this).siblings('ul.txt-type1').show();
                    $(this).siblings('em').show();
                    $(this).parents('div.acc1').children('p').hide();
                    $(this).parents('div.acc1').addClass('acc1-on');
                    $(this).html('이용가이드 닫힘');
                }
            });
        },

        /* ==================================================================
            토글버튼
        ================================================================== */

        btnToggle : function(){
            $('div.accordion2 ').find('a.btn').click(function() {
                if ($(this).parents('div.accordion2').find('div.accordion-con').css('display')==('block'))
                {
                    $(this).parents('div.accordion2').find('div.accordion-con').hide();
                    $(this).parents('div.acc2').removeClass('acc2-on');
                    $(this).html('상세보기 열림');
                }else{
                    $(this).parents('div.accordion2').find('div.accordion-con').show();
                    $(this).parents('div.acc2').addClass('acc2-on');
                    $(this).html('상세보기 닫힘');
                }
            });
        },

        /* ==================================================================
            table 도움말
        ================================================================== */
        helpGuide : function(){
            $('div.btn-info>span').bind('mouseover focus', function(){
                $(this).parents('div.btn-info').find('.layerpop-2').show();
            });
            $('div.btn-info span').on('mouseleave blur mousedown', function(){
                $(this).parents('div.btn-info').find('.layerpop-2').hide();
            });

            // 더보기 버튼
            //$('.doMoreSubmit').each(function(){
            //  $(this).parent().css('background','none repeat scroll 0% 0% transparent');
            //});
        },

        /* ==================================================================
            금융상품 리스트 정렬
        ================================================================== */
        acc_HT : function() {
            //금융상품몰
            $('.goods-register').each(function(){
                var ulHt = $(this).find('ul:first-child').height();
                $(this).find('ul').height(ulHt);
            });

            $('.item-type-list .item-btn').each(function(){
                var $itemH = $(this).outerHeight()/2;
                $(this).css('margin-top','-'+$itemH+'px');
            });

            $('.item-type-list .tag').each(function(){
                var $itemH = $(this).outerHeight()/2;
                $(this).css('margin-top','-'+$itemH+'px');
            });
        },

        /* ==================================================================
        문서로딩시 실행함수
        ================================================================== */
        init : function(){
            _Class.gnbAction(); //GNB 함수 (GMB 액션관려 전반적인 기능 (GNB 롤오버, GNB에 포함된 Layer 높이별 움직임등.) )
            _Class.allmenuAction(); // 전체메뉴 함수 (GNB내에 펼쳐지기 클릭시 구현됨)
            _Class.lnbAction(); //LNB 함수 (LNB Depth 별 토글기능)
            _Class.moreLayerToggle(); //탑.푸터 더보기레이어 함수 == ?????
            _Class.placeholder(); //input placeholder 함수 == ?????
            _Class.tab(); //탭메뉴 (컨텐츠 탭 전체 (한 화면구성된 경우, 페이지별 분리된 경우)
            _Class.accordion(); //아코디언 목록 (컨텐츠 펼침, 닫침 예)전계좌조회)
            _Class.layoutView(); // 레이아웃 변경 (레이아웃 버튼 클릭시 사이즈 변경 예)화면설정)
            _Class.familysite(); // 패밀리사이트 (하단 패밀리사이트 펼침메뉴 예)BS금융네트워크, family site)
            _Class.useGuide(); //이용안내 열림 닫힘
            _Class.btnToggle(); // 토글버튼
            _Class.helpGuide(); //table 도움말
            _Class.gnbBanner(); // GNB 베너
            _Class.acc_HT(); //금융상품 리스트정렬
        },
        reload : function(){
            _Class.tab(); //탭메뉴 (컨텐츠 탭 전체 (한 화면구성된 경우, 페이지별 분리된 경우)
            _Class.accordion(); //아코디언 목록 (컨텐츠 펼침, 닫침 예)전계좌조회)
            _Class.useGuide(); //이용안내 열림 닫힘
            _Class.btnToggle(); // 토글버튼
            _Class.helpGuide(); //table 도움말
            _Class.gnbBanner(); // GNB 베너
            _Class.acc_HT(); //금융상품 리스트정렬
        }
    }
    return _Class;
})());

$(document).ready(function(){
    bsUI.init();

    //상단 로그인/인증센터레이어 출력
    $('.call-layer > a').on('mouseenter focusin',function(){
        var $idMyBox = $(this).attr('id');
        $('.btn-in-type').hide();
        $('#layer-'+$idMyBox).show();
        $('#layer-'+$idMyBox + 'li:first-child a').focus();
    });
    /*
        $('#login-call').focusout(function(){
            $('#layer-login-call ul li a:first').focus();
        });

        $('#layer-login-call ul li a:last').focusout(function(){
            $('#certificate-call').focus();
        });
    */
    $('#topsch01').focusin(function(){
        $('.btn-in-type').hide();
    });

    $('.mouse-zone').hover(function(){

    },function(){
        $('.btn-in-type').hide();
    });

    /* 통합검색 정렬 */
    $('.float-r a').on('click',function(){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    });

    /* 이용가이드 단계별 링크 */
    $('.goLink a').on('click',function(){
        $(this).parent().siblings().find('a').removeClass('active');
        $(this).addClass('active');
    });

    $('.goTop').on('click',function(){
        $('.goLink a').removeClass('active');
        $('.goLink > li:first-child a').addClass('active');
    });


    //faq tab
    var $groupW = $('#faqGroup').width(),
        $listW = $groupW/6,
        $listPer = (($listW/$groupW)*100)+'%';
    $('#faqGroup > li').css('width',$listPer);
    $('.boxcon').hide();
    $('.boxcon:first').show();
    $('#faqGroup > li > a').on('click',function(){
        var $boxId = $(this).parent().attr('id');
        $('.boxcon').hide();
        $('#cont'+$boxId).show();
        $('#faqGroup li').removeClass('boxOn');
        $(this).parent().addClass('boxOn');
    });

    //customer center
    var $csCheck = $(".check-action");
    $csCheck.each(function(){
        $(this).on('click',function(){
            var $checkId = $(this).attr('id');
            if($(this).is(":checked") == true){
                $('#'+$checkId+'-form').find('input,select').removeAttr('disabled');
            }else{
                $('#'+$checkId+'-form').find('input,select').attr('disabled','disabled');
            };
        });
    });


    // 퀵메뉴  ---  하단 퀵메뉴 클릭 이벤트
    var ieVersion = $.browser.version;
    if (ieVersion == 7.0){
        $('#quickNav h2 a').click(function(){
            if ($(this).parent().siblings('.qmenu-area').css('height')=='32px')
            {
                $(this).parent().siblings('.qmenu-area').stop().css('height', 162 + 'px');
                $('.qmenu-area>ul>li').find('.quick-con').eq(0).show();
                $('.qmenu-area>ul li').removeClass('on');
                $('.qmenu-area>ul li').find('.quick-con').eq(0).parent().addClass('on');
                $('.qmenu-area>ul li').find('.quick-con').eq(0).parent().children('a').append('<img src="/resource/img/bg/bg_quick_on3.png" alt="" />');
                $(this).html('<img src="/resource/img/btn/btn_quick_on.png" alt="QUICKMENU 닫기" />');
            } else {
                $(this).parent().siblings('.qmenu-area').stop().css('height', 32 + 'px');
                $('.qmenu-area>ul li').find('div.quick-con').hide();
                $('.qmenu-area>ul li').removeClass('on');
                $('.qmenu-area>ul>li>a').find('img').remove();
                $(this).html('<img src="/resource/img/btn/btn_quick.png" alt="QUICKMENU 열기" />');
            }
        });

        $('.qmenu-area').height('32px');
        $('.qmenu-area ul li').children('a').click(function(){
            if ($(this).next('div').length < 1)
            {
                $('.qmenu-area>ul>li>a').find('img').remove();
                //$(this).append('<img src="/resource/img/bg/bg_quick_on3.png" alt="" />');
                $(this).parents().parents('.qmenu-area').stop().animate({height : '32px'}, 500);
            } else {
                $(this).parents().parents('.qmenu-area').stop().animate({height : '162px'}, 500);
                $(this).siblings('div').show();
                $('.qmenu-area>ul>li>a').find('img').remove();
                $(this).append('<img src="/resource/img/bg/bg_quick_on3.png" alt="" />');
                $('#quickNav h2 a').html('<img src="/resource/img/btn/btn_quick_on.png" alt="QUICKMENU 닫기" />');
                $(this).parents('li').addClass('on');
            }

            $(this).parents('li').siblings().children('div.quick-con').hide();
            $(this).parents('li').siblings().removeClass('on');
        });
    } else {
        $('#quickNav h2').click(function(){
            if ($(this).siblings('.qmenu-area').css('height')=='32px')
            {
                $(this).siblings('.qmenu-area').stop().animate({height : '162px'}, 500);
                $('.qmenu-area>ul>li').find('.quick-con').eq(0).show();
                $('.qmenu-area>ul li').removeClass('on');
                $('.qmenu-area>ul li').find('.quick-con').eq(0).parent().addClass('on');
                $('.qmenu-area>ul li').find('.quick-con').eq(0).parent().children('a').append('<img src="/resource/img/bg/bg_quick_on3.png" alt="" />');
                $(this).children('a').html('<img src="/resource/img/btn/btn_quick_on.png" alt="QUICKMENU 닫기" />');
            } else {
                $(this).siblings('.qmenu-area').stop().animate({height : '32px'}, 500);
                $('.qmenu-area>ul li').find('div.quick-con').hide();
                $('.qmenu-area>ul li').removeClass('on');
                $('.qmenu-area>ul>li>a').find('img').remove();
                $(this).children('a').html('<img src="/resource/img/btn/btn_quick.png" alt="QUICKMENU 열기" />');
            }
        });

        $('.qmenu-area').height('32px');
        $('.qmenu-area ul li').children('a').click(function(){
            if ($(this).next('div').length < 1)
            {
                $('.qmenu-area>ul>li>a').find('img').remove();
                //$(this).append('<img src="/resource/img/bg/bg_quick_on3.png" alt="" />');
                $(this).parents().parents('.qmenu-area').stop().animate({height : '32px'}, 500);
            } else {
                $(this).parents().parents('.qmenu-area').stop().animate({height : '162px'}, 500);
                $(this).siblings('div').show();
                $('.qmenu-area>ul>li>a').find('img').remove();
                $(this).append('<img src="/resource/img/bg/bg_quick_on3.png" alt="" />');
                $('#quickNav h2 a').html('<img src="/resource/img/btn/btn_quick_on.png" alt="QUICKMENU 닫기" />');
                $(this).parents('li').addClass('on');
            }

            $(this).parents('li').siblings().children('div.quick-con').hide();
            $(this).parents('li').siblings().removeClass('on');
        });
    }

    /*
    $('#quickNav').mouseleave(function(){
        $(this).find('.quick-con').hide();
        $('.qmenu-area').animate({height : '32px'}, 500);
        $('.qmenu-area>ul li').removeClass('on');
        $(this).children('h2').children('a').html('<img src="/resource/img/btn/btn_quick.png" alt="QUICKMENU 열기" />');
        $('.qmenu-area>ul li a img').remove();
    });
    */

    $('.quick-view').find('div.qbox').mouseover(function(){
        $(this).addClass('on');
    }, function(){
        $(this).removeClass('on');
    });

    // 전체서비스
    $('.nav-site>li').eq(3).find('>a').mouseover(function(){
        if ($('div.all-service').css('display')==('none'))
        {
            $(this).next('div.all-service').show();
            var img = $('img', this).attr("src");
            $(this).find('img').attr('src', img.replace('.gif', '_on.gif'));
            $(this).find('img').attr('alt', '전체서비스 닫기');
        }
    });

    $('.nav-site>li').eq(3).find('>a').focus(function(){
        if ($('div.all-service').css('display')==('none'))
        {
            $(this).next('div.all-service').show();
            var img = $('img', this).attr("src");
            $(this).find('img').attr('src', img.replace('.gif', '_on.gif'));
            $(this).find('img').attr('alt', '전체서비스 닫기');
        }
    });

    $('.nav-site>li').eq(3).mouseleave(function(){
        $(this).children('div.all-service').hide();
        var img = $('img', $(this).find('>a')).attr("src");
        $(this).find('>a').find('img').attr('src', img.replace('_on.gif', '.gif'));
        $(this).find('>a').find('img').attr('alt', '전체서비스 열기');
    });

    $('div.all-service div').find('a').eq(3).blur(function(){
        var allmenu = $(this).parents().parents('div.all-service').siblings('a');
        $(this).parents().parents('div.all-service').hide();
        var img = $('img', allmenu).attr("src");
        allmenu.find('img').attr('src', img.replace('_on.gif', '.gif'));
        allmenu.find('img').attr('alt', '전체서비스 열기');
    });

    $('.nav-site>li').eq(2).find('a').focus(function(){
        $('.all-service').hide();
        var img = $('img', $('.nav-site>li').eq(3).find('a')).attr("src");
        $('.nav-site>li').eq(3).find('>a').find('img').attr('src', img.replace('_on.gif', '.gif'));
        $('.nav-site>li').eq(3).find('>a').find('img').attr('alt', '전체서비스 열기');
    });

//외국어사이트 설정

    $('div.lang-area>a').mouseover(function(){
        if ($(this).next().css('display')==('none'))
        {
            $(this).next().show();
            var img = $('img', this).attr("src");
            $(this).find('img').attr({src : img.replace('.gif', '_on.gif'), alt : '외국어 서비스 닫기'});
        }
    });

    $('.lang-area>a').focus(function(){
        if ($(this).next().css('display')==('none'))
        {
            $(this).next().show();
            var img = $('img', this).attr("src");
            $(this).find('img').attr({src : img.replace('.gif', '_on.gif'), alt : '외국어 서비스 닫기'});
        }
    });

    $('.lang-area').mouseleave(function(){
        $(this).find('div.lang-service').hide();
        var img = $('img', this).attr("src");
        $(this).find('>a').find('img').attr({src : img.replace('_on.gif', '.gif'), alt : '외국어 서비스열기'});
    });

    $('div.lang-service').find('li:last>a').blur(function(){
        var langSvc = $('div.lang-area').find('>a');
        $(this).parents('div.lang-service').hide();
        var img = $('img', langSvc).attr("src");
        $('div.lang-area').find('>a').find('img').attr({src : img.replace('_on.gif', '.gif'), alt : '외국어 서비스열기'});
    });

// 스킨설정
    $('.skin-set').click(function(){
        $(this).next('div.skinbox').show();
    });

    $('.skin-close').click(function(){
        $(this).parents('div.skinbox').hide();
    });

    $('.skinbox>div>ul li a').click(function(){
        $('.skinbox>div>ul li').removeClass('on');
        $(this).parents('li').addClass('on');
    });

// table th 간격 조절
    $('table.tbl-type2 thead').each(function(){

        if ($(this).children('tr').length > 1 || $(this).find('br').length > 0)
        {
            $(this).addClass('pd');
        }

    });

// 라디오버튼 제어
    $(':radio[name="rd"]').each(function(){
        var radioChk =  $(':radio[name="rd"]:checked').val();
        var radioChk2 =  $(':radio[name="rd01"]:checked').val();

        $(':radio[name="rd"]').eq(0).attr("checked", true);
        $('.tbl-type1').find('.rdset01').hide();
        $('.schSet'+radioChk).show();
        $('.schSet'+radioChk).find(':radio[name="rd01"]').eq(0).attr("checked", true);
        $('.tbl-type1').find('.rdset01').find('.rdset02').hide();
        $('.tbl-type1').find('.rdset01').find('.rdset02').eq(0).show();
        $(':radio[name="rd"]').click(function(){
            var radioChk3 =  $(':radio[name="rd"]:checked').val();
            $('.tbl-type1').find('.rdset01').hide();
            $('.schSet'+radioChk3).show();
            $('.schSet'+radioChk3).find('.rdset02').hide();
            $('.schSet'+radioChk3).find('.rdset02').eq(0).show();
            $('.schSet'+radioChk3).find(':radio[name="rd01"]').eq(0).attr("checked", true);
        });

        if ($(':radio[name="rd"]').is(":checked") == true)
        {
            $(':radio[name="rd01"]').click(function(){
                var radioChk4=  $(':radio[name="rd01"]:checked').val();
                $(this).siblings('.rdset02').hide();
                $(this).siblings('.subSet'+radioChk4).show();
            });
        }
    });

    //잔액조회
    $('.balance-f').hide();
    $('.balance-m').on('click',function(){
        $('.balance-f').show();
    });



    /*금상몰 상세조건 검색*/
    $('#zoneArea').hide();
    $('#zdetail_btn').toggle(slideDown,slideUp);

    function slideDown(){
        $('#zoneArea').addClass('open').slideDown();
        $(this).attr('class','btn-pack btn-type-15u');
        $(this).attr('title','닫기');
    }

    function slideUp(){
        $('#zoneArea').removeClass('open').slideUp();
        $(this).attr('class','btn-pack btn-type-15');
        $(this).attr('title','열기');
    }

    /*해외지점 */
    $('#ftab li').on('click',function(){
        var $this = $(this),
            $tImg = $this.find('img').attr('src');
        $('#ftab li.select').find('img').attr('src',$('#ftab li.select').find('img').attr('src').replace(/^(.+)_on(\.[a-z]+)$/,"$1$2"));
        $("#ftab li").removeClass('select');
        $(this).addClass('select');
        $("img",this).attr("src",$("img",this).attr("src").replace(/^(.+)_on(\.[a-z]+)$/,"$1$2"));
        $("img",this).attr("src",$("img",this).attr("src").replace(/^(.+)(\.[a-z]+)$/,"$1_on$2"));
        $("#ftab li").siblings().find('span').remove();
        $(this).append('<span>선택</span>');
        myID = this.id.split("_")[1];
        $(".food-box>div").hide();
        $("#showbox_" + myID).show();
    });
    $("#tab_1").trigger("click");
    $('#htab li').on('click',function(){
        var $this = $(this),
            $tImg = $this.find('img').attr('src');
        $('#htab li.select').find('img').attr('src',$('#htab li.select').find('img').attr('src').replace(/^(.+)_on(\.[a-z]+)$/,"$1$2"));
        $("#htab li").removeClass('select');
        $(this).addClass('select');
        $("img",this).attr("src",$("img",this).attr("src").replace(/^(.+)_on(\.[a-z]+)$/,"$1$2"));
        $("img",this).attr("src",$("img",this).attr("src").replace(/^(.+)(\.[a-z]+)$/,"$1_on$2"));
        $("#htab li").siblings().find('span').remove();
        $(this).append('<span>선택</span>');
        myID = this.id.split("_")[1];
        $(".history-box>div").hide();
        $("#showbox1_" + myID).show();
    });
    $("#htab_1").trigger("click");

    $('#rtab li').on('click',function(){
        var $this = $(this),
            $tImg = $this.find('img').attr('src');
        $('#rtab li.select').find('img').attr('src',$('#rtab li.select').find('img').attr('src').replace(/^(.+)_on(\.[a-z]+)$/,"$1$2"));
        $("#rtab li").removeClass('select');
        $(this).addClass('select');
        $("img",this).attr("src",$("img",this).attr("src").replace(/^(.+)_on(\.[a-z]+)$/,"$1$2"));
        $("img",this).attr("src",$("img",this).attr("src").replace(/^(.+)(\.[a-z]+)$/,"$1_on$2"));
        $("#rtab li").siblings().find('span').remove();
        $(this).append('<span>선택</span>');
        myID = this.id.split("_")[1];
        $(".tour-box>div").hide();
        $("#showbox2_" + myID).show();
    });
    $("#rtab_1").trigger("click");

    $('#chtab li').on('click',function(){

        var $this = $(this),
            $chAttr = $(this).find('a').attr('href'),
            $tImg = $this.find('img').attr('src');
        $tImgA = $this.find('img').attr('alt');

        $('#chtab li.select').find('img').attr('src',$('#chtab li.select').find('img').attr('src').replace(/^(.+)_on(\.[a-z]+)$/,"$1$2"));
        $('#chtab li').removeClass('select');
        $(this).addClass('select');
        $("img",this).attr("src",$("img",this).attr("src").replace(/^(.+)_on(\.[a-z]+)$/,"$1$2"));
        $("img",this).attr("src",$("img",this).attr("src").replace(/^(.+)(\.[a-z]+)$/,"$1_on$2"));
        $('#chtab li').siblings().find('span').remove();
        $(this).append('<span>선택</span>');
        $('#paperbox').find('img').attr('src',$chAttr).attr('alt',$tImgA);
        return false;
    });

    $('.ci-char-list li').on('click',function(eo){
        eo.preventDefault();
        var $this = $(this),
            $ciHref = $(this).find('a').attr('href'),
            $ciAlt = $(this).find('img').attr('alt');
        $('.ci-char-list li.select').find('img').attr('src',$('.ci-char-list li.select').find('img').attr('src').replace(/^(.+)_on(\.[a-z]+)$/,"$1$2"));
        $('.ci-char-list li').removeClass('select');
        $(this).addClass('select');
        $("img",this).attr("src",$("img",this).attr("src").replace(/^(.+)_on(\.[a-z]+)$/,"$1$2"));
        $("img",this).attr("src",$("img",this).attr("src").replace(/^(.+)(\.[a-z]+)$/,"$1_on$2"));
        $('#cicharBox').find('img').attr('src',$ciHref).attr('alt',$ciAlt);
    });
});

function openAccount(popid) {
    var $tPop = $('#'+popid);
    $('.layerpop-2').hide();
    $tPop.show();
    $tPop.find('a.layer-close').click(function(){
        $tPop.hide();
        $(this).parent().parent().find('a[href*=openAccount]').focus();
    });
};