DraApp.CMenu=( function ($) {
    function CMenu(items) {
        this.wrapper=( $('.wrapper').get()[0]!==undefined)?  $('.wrapper') : $('body');
        this.container = (items.container !== undefined) ? $(items.container) : $(window);
        this.main = (items.main !== undefined) ? $(items.main) : null;
        this.mainSelector=(items.main !== undefined) ? items.main : null;
        this.subSelector = (items.sub !== undefined) ? items.sub : null;
        this.sub = (items.sub !== undefined) ? $(this.subSelector) : null;
        this.slidebar = (items.slidebar !== undefined) ? $(items.slidebar) : null;
        this.subbar = (items.subbar !== undefined) ? $(items.subbar) : null;
        this.navbar = (items.navbar !== undefined) ? $(items.navbar) : null;
        this.active = (items.active !== undefined) ? items.active : null;
        this.mobileCloseBtn = (items.mClose !== undefined) ? $( items.mClose ) : null;
        this.mobileContainer = (items.mobileContainer !== undefined) ? $( items.mobileContainer ) : null;
        this.mobileOpenBtn = (items.mOpen !== undefined) ? $( items.mOpen ) : null;
        this.addMotionMobileMenu=(items.addMotionMobileMenu !== undefined) ? $(items.addMotionMobileMenu) : null;

        this.menus = [];
        this.mainInfos = [];
        this.mIdx =-1;
        this.sIdx =-1;
        this.overMainIdx = 0;
        this.overSubIdx = 0;
        this.mobileCloseChk=false;
        this.evtObj = {};
        this.evtTarget=$(this.evtObj);
        this.MENU_OPEN_EVENT = 'menuOpenEvent';
        this.MENU_CLOSE_EVENT = 'menuCloseEvent';
        this.observerItems = [];

        this.modeDiff=new Utils.VersionDiff();

        if (items.isMobile !== undefined) {
            if (typeof items.isMobile === "boolean") {
                this.isMobile = items.isMobile;
            } else {
                this.isMobile = false;
            }
        } else {
            this.isMobile = false;
        }

    }

    CMenu.prototype.getMobile = function () {
        return this.isMobile;
    };
    CMenu.prototype.setMobile = function (value) {
        this.isMobile = (typeof value === "boolean") ? value : false;
        this.modeDiff.setState(this.isMobile);
    };
    CMenu.prototype.getMainIndex = function () {
        return this.mIdx;
    };
    CMenu.prototype.getSubIndex = function () {
        return this.sIdx;
    };

    CMenu.prototype.setPageIndexes = function (mainIdx, subIdx) {
        var that=this;
        if( this.getMobile()===false) {

            setIndexes.call(this, mainIdx, subIdx);

            this.overMainIdx = this.getMainIndex();
            this.overSubIdx = this.getSubIndex();
            //첫 등장시 모션~
            this.container.removeAttr('style');
            TweenLite.set(that.container, {opacity:0, marginTop: 20});
            TweenLite.to(that.container, 0.5, {marginTop:0, opacity:1, onComplete:function(){
                    activeMainMenus.call(that, that.getMainIndex() );
                    /* 메뉴 아웃시에도 활성화 하려면 주석 해제
                     activeSubContainer.call(this, this.getMainIndex());
                     activeSubMenus.call(this, this.getMainIndex(), this.getSubIndex());
                     */
                    activeSlideBar.call(that, that.getMainIndex() );
                    activeSubMenus.call(that, that.getMainIndex(), that.getSubIndex());
                }} );

        }else{
            TweenLite.to( this.container, 0.35, {opacity:1});
        }

    };

    function setIndexes(mIdx, sIdx) {
        this.mIdx = mIdx;
        this.sIdx = sIdx;
    }

    function max( arr ) {
        var mx=0;
        for( var i=0;i<arr.length;i++ ) {
            if( mx<arr[i] ){
                mx = arr[i];
            }
        }
        return mx;
    }

    function mainCloneInfo() {
        var that=this;

        //리사이즈시 새롭게 갱신되는 메인 엘리먼트 사이즈를 제대로 측정할 수 없기에 해당 엘리먼트를 복제해서 display:block / opacity:0 으로 설정하면 사이즈를 측정 할 수 있다.
        var mainContainerClone=that.container.clone();
        mainContainerClone.css({ top: -10000, display: 'block', opacity: 0,position:that.container.css('position'),top:0,left:0,width:that.container.css('width'),height:that.container.css('height')}).appendTo('body');
        var cloneMainList=mainContainerClone.find(this.mainSelector);

        cloneMainList.each(function (i, mItem) {
            var mpdLeft = that.main.eq(i).find('a').css('padding-left');
            var mpdRight = that.main.eq(i).find('a').css('padding-right');
            var mpdTop = that.main.eq(i).find('a').css('padding-top');
            var mpdBottom = that.main.eq(i).find('a').css('padding-bottom');
            var mFontSize = that.main.eq(i).find('a').css('font-size');
            var txtW=$(this).find('a').width();
            var mainWidth=$(this).width();
            $(this).css({paddingLeft:mpdLeft, paddingRight:mpdRight, paddingTop:mpdTop, paddingBottom:mpdBottom, fonSize:mFontSize, float:'left'});
            //console.log('txt width='+txtW, ':: main width='+mainWidth )

            that.mainInfos.push({width:txtW, outerWidth:$(this).outerWidth(), pdLeft:mpdLeft, pdRight:mpdRight });
        });

        mainContainerClone.remove();
    }

    CMenu.prototype.update = function () {
        var that = this;
        var mainLen = that.main.length;

        that.menus.length = 0;
        that.mainInfos.length=0;
        that.menus = [];
        that.mainInfos = [];
        //that.container.attr('style', '');

        mainCloneInfo.call(that);

        that.main.each(function (idx, item) {
            var subSelector = $(item).children(that.subSelector);
            //서브 메뉴가 존재하는지 유무 체크 변수
            var subChk = subSelector.get()[0];
            var mainW = that.mainInfos[idx].outerWidth;
            var mainGapX=parseInt( that.mainInfos[idx].pdLeft );
            var mainRealW=that.mainInfos[idx].width+parseInt( that.mainInfos[idx].pdLeft )+parseInt( that.mainInfos[idx].pdRight );
            var subTotalW = 0; // 데스크탑 서브 컨테이너에 각 메뉴 width 총 합을 구한값을 참조로 넣어둘 변수
            var subMaxW=0;
            var subTotalH=0; //모바일 서브 컨테이너에 각 메뉴 height 총 합을 구한값 참조

            that.menus.push({main: $(item), mainW: mainW, realW:mainRealW, active:false, sub: []});
            if (subChk !== undefined) {
                subSelector.removeClass('hide');
                var subItems = subSelector.children("li");
                //display:none 으로 된 엘리먼트는 사이즈를 측정할 수 없기에 해당 엘리먼트를 복제해서 display:block / opacity:0 으로 설정하면 사이즈를 측정 할 수 있다.
                // 컨테이너는 해당 화면에서 안보이게 top:-10000으로 설정해둔다.
                var cloneSub = subSelector.clone();
                cloneSub.css({ position: 'absolute', top: -10000, display: 'block', opacity: 0, overflow: 'hidden'}).appendTo('body');
                var cloneSubItems = cloneSub.children('li');

                var subItemWidthSet= [];
                //메뉴 복제를 통한 사이즈 측정을 한다.
                if( that.getMobile()===false) {
                    cloneSubItems.each(function (j, child) {
                        var childPaddingLeft=subItems.eq(j).css('padding-left');
                        var childPaddingRight=subItems.eq(j).css('padding-right');
                        var childMarginLeft=subItems.eq(j).css('margin-left');
                        var childFontSize=subItems.eq(j).find('a').css('font-size');
                        $(this).css({display: 'block', opacity: 0, float: 'left', padding:childPaddingLeft, marginLeft:childMarginLeft });
                        $(this).find('a').css({fontSize:childFontSize});

                        //subTotalW+= $(this).width()+parseInt( childPaddingLeft )+parseInt( childPaddingRight );
                        subItemWidthSet.push( $(this).width()+parseInt( childPaddingLeft )+parseInt( childPaddingRight ) )
                    });
                    //바로 아래에서 cloneSub 를 제거 하고 있기에 제거되기 전에 마진값 계산을 해둬야 한다.
                    var totalMargin = ( cloneSubItems.length - 1) *parseInt( subItems.eq(1).css('margin-left') );
                    cloneSub.remove();

                    //메인 메뉴 x좌표 시작점이 서브메뉴 x좌표이다.
                    //마지막 서브메뉴를 안쪽을 끌어당겨 보이게 하기 위해선 sub total width값에  main메뉴 width를 뺀 값이다.
                    // tw=서브메뉴 총길이 + 마진+ 추가 간격
                    //var tw=subTotalW+totalMargin+mainGapX;
                    var tw=max( subItemWidthSet )+20;
                    //var tx = (idx ===mainLen - 1) ?  ( tw-mainW+mainGapX*2 )*-1 : ( mainW/2-mainGapX )*-1;
                    var tx=( tw-mainRealW )/2*-1;
                    //console.log( mainW)

                    subSelector.css({left: tx, width:tw });
                    that.menus[idx].sub.push({cont: subSelector, item: subItems, left:tx, width:tw, active:false});
                }else{
                    cloneSubItems.each(function (j, child) {
                        var childPaddingTop=subItems.eq(j).find('a').css('padding-top');
                        var childPaddingBottom=subItems.eq(j).find('a').css('padding-bottom');
                        var childFontSize=subItems.eq(j).find('a').css('font-size');
                        $(this).css({display:'block', opacity: 0, paddingTop:childPaddingTop, paddingBottom:childPaddingBottom});
                        $(this).find('a').css({fontSize:childFontSize});
                        subTotalH+=$(this).height()+parseInt(childPaddingTop)+parseInt(childPaddingBottom);
                    });
                    that.menus[idx].sub.push({cont: subSelector, item: subItems, th:subTotalH+5, active:false});
                    cloneSub.remove();

                    subSelector.css({width:'100%'});
                    subSelector.addClass('hide');

                }
                subSelector.removeAttr('style');
                subItems.removeAttr('style');
            } else {
                //하위 서브메뉴가 없다면 false를 저장해두어 참조하게끔 한다.
                that.menus[idx].sub.push({cont: false});
            }
        });

        that.init();
        that.updateMainMenuWidth();

    };

    //메뉴 합 구하기 ~
    CMenu.prototype.updateMainMenuWidth = function () {

        //메인 메뉴 총 가로 사이즈 측정.
        var mainMenuTotalW = 0;
        var sideMenuW=0;
        //
        if (this.isMobile === false) {
            //this.menus 에 대한 세팅이 끝난후 해당 부분실행되어야 한다.
            if (Utils.isArray(this.menus)) {
                $.each(this.menus, function (idx, item) {
                    //메뉴 총합을 구한다.
                    mainMenuTotalW += item.realW;
                });
            }

            if( this.container[0]!==this.main.parent()[0]){
                this.main.parent().css({ width:mainMenuTotalW+12});
            }else{
                this.container.css({ width:mainMenuTotalW+10});
            }

        }else{
            if( this.container[0]!==this.main.parent()[0]){
                this.main.parent().css({ width:'auto'});
            }else{
                this.container.css({ width:'auto'});
            }
        }

    };

    CMenu.prototype.init = function () {
        var that = this;

        that.deskTopEventCleanup();
        that.deskTopCleanup();
        that.mobileEventCleanup();
        that.mobileMenuCleanup();

        resetMenus.call(that);

        console.log( 'getState=', this.modeDiff.getState() )

        if(that.getMobile()==true) {
            that.mobileInit();
        }else{
            that.desktopInit();
        }

        /*$.each( this.menus, function(i, item)  {
         console.log(i, item );
         });*/
    };

    //모바일에서 wrapper 엘리먼트 메뉴 등장시 고정.
    function updateContainerFixed( openCheck ) {
        if( openCheck===true ) {
            this.wrapper.css('position', 'fixed');
            this.wrapper.addClass('overflow');
        }else{
            this.wrapper.css('position', 'relative');
            this.wrapper.removeClass('overflow');
        }

    }

    /**
     * 데스크탑 버전 스케일 모션
     * @param isOpen
     */
    function menuScaleMotion( isOpen ) {
        var that=this;
        var len=that.menus.length;
        var tscale=0;

        if( isOpen ) {
            tscale=0;
            for( var i=len-1;i>=0;i--) {
                TweenLite.to( that.menus[i].main, 0.5, { delay: ( ( len- 1) - i )*0.05, scale:tscale } );
            }
        }else{
            tscale=1;
            for( var i=0;i<len;i++) {
                TweenLite.to( that.menus[i].main, 0.5, { delay:i*0.05, scale:tscale, onComplete:tweenEnd, onCompleteParams:[i] } );
            }
        }
        function tweenEnd(idx) {
            if( idx===len-1) {
                for( var k=0;k<len;k++) {
                    that.menus[k].main.removeAttr('style');
                }
            }
        }
    }

    /**
     * 모바일버전  모션
     * @param isOpen
     */
    function menuSlideMotion( isOpen ) {
        var that=this;
        var mergeMenu = [];

        if( this.addMotionMobileMenu!==null) {
            mergeMenu=that.menus.concat();
            mergeMenu.push({main:this.addMotionMobileMenu})
            //console.log( 'mergeMenu=', mergeMenu )
        }else{
            mergeMenu=that.menus;
        }
        var len=mergeMenu.length;

        var ty=( isOpen )? -50 : 0;
        var talpha=( isOpen )? 0 : 1;
        var visible = (isOpen) ? 'hidden' : 'visible';
        for( var i=0;i<len;i++) {
            TweenLite.set(mergeMenu[i].main, {visibility: 'visible'});
        }
        for( var i=0;i<len;i++) {
            TweenLite.to(mergeMenu[i].main, 0.3, {
                delay: i * 0.02,
                y: ty,
                alpha: talpha,
                onComplete: function (idx) {
                    TweenLite.set(mergeMenu[idx].main, {visibility: visible});
                    if( idx===len-1 ) {
                        if( !that.getMobile() ){
                            for( var k=0;k<len;k++) {
                                mergeMenu[k].main.removeAttr('style');
                            }
                        }
                    }
                },
                onCompleteParams: [i]
            });
        }

    }

    CMenu.prototype.changeMenuMotion=function( isOpen ) {
        menuScaleMotion.call( this, isOpen );
    };
    CMenu.prototype.slideMenuMotion=function( isOpen ) {
        var that=this;
        menuSlideMotion.call( that, isOpen );
    };

    CMenu.prototype.onMobileMainClick=function(e) {
        var that=this;
        var idx = $(e.currentTarget).index();
        activeMobileMainMenus.call(that, idx, e);
        this.menus[idx].active=!this.menus[idx].active;
    };

    CMenu.prototype.onMobileSubClick=function(e) {
        e.stopImmediatePropagation();
    };

    /**
     * 모바일 메뉴 열리고 닫힐때 시퀀스모션~
     * @param isOpen
     * @param speed
     */
    function menuSequenceMotion( isOpen, speed ){
        var that=this;
        var motionSpd=0.35;
        var delayTime=0;
        var talpha=1;
        var tx=0;
        var resetMenuSpd=speed || motionSpd;
        var resetBarSpd=speed || 0.5;
        var mergeMenu = [];
        //
        if( this.addMotionMobileMenu!==null) {
            mergeMenu=that.menus.slice(0);
            mergeMenu.push({main:this.addMotionMobileMenu})
            //console.log( 'mergeMenu=', mergeMenu )
        }else{
            mergeMenu=that.menus;
        }

        if( isOpen===true) {
            TweenLite.set(that.container, {height:Utils.getWindowHeight()});

            delayTime=0.05;
            talpha=1;
            tx=0;
            ty=0;
            for( var i= 0, len=mergeMenu.length;i<len;i++) {
                TweenLite.set( mergeMenu[i].main, {alpha: 0});
                TweenLite.to( mergeMenu[i].main, motionSpd, {
                    delay: i * delayTime,
                    alpha: talpha,
                    z: 0,
                    scaleX: 1,
                    scaleY: 1,
                    onComplete: openMotionEnd,
                    onCompleteParams:[ i ]
                });
            }
            function openMotionEnd( tIdx ) {
                mergeMenu[tIdx].main.attr('style', 'opacity:1')
            }
            TweenLite.to( this.navbar, 0.5, {height:Utils.getWindowHeight(), ease:Power2.easeOut, onComplete:function(){
                    updateContainerFixed.call(that, true);
                }});
        }else{

            updateContainerFixed.call(that, false);
            delayTime=0.05;
            talpha=0;
            tx=-20;
            ty=-40;
            for (var i = mergeMenu.length - 1, len = 0; i >= len; i--) {
                TweenLite.to(mergeMenu[i].main, resetMenuSpd, {
                    delay: ( ( mergeMenu.length - 1) - i ) * delayTime,
                    alpha: talpha,
                    z: 500,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    onComplete: closeMotionEnd,
                    onCompleteParams: [i]
                })
            }
            function closeMotionEnd(tIdx) {
                if( tIdx===0 ){
                    var timer = setTimeout(function () {
                        clearTimeout(timer);
                        for( var i=0;i<mergeMenu.length;i++) {
                            mergeMenu[i].main.attr('style', 'opacity:0');
                        }
                    }, 300);

                }
            }
            TweenLite.to( this.navbar, 0.5, { height:this.mobileNavBarH,  ease:Power2.easeIn, onComplete:function(){
                    TweenLite.set(that.container, {height:56});
                } });

        }
    }

    //모바일에서 메뉴 open/close
    function mobileMenuView( isOpen ) {
        var that=this;
        if( isOpen ){
            that.mobileContainer.removeClass('hide').addClass('menu-open');
        }else{
            that.mobileContainer.removeClass('menu-open');
        }
    }

    function mobileMenuEventAdapter() {
        if(this.mobileCloseChk===false){
            this.evtTarget.trigger(this.MENU_OPEN_EVENT );
            this.mobileCloseChk=true;
        }else{
            this.evtTarget.trigger(this.MENU_CLOSE_EVENT );
            this.mobileCloseChk=false;
        }
    }

    CMenu.prototype.onMenuToggleEvent=function(event, params) {
        //console.log( event.type )
        if(event.type===this.MENU_OPEN_EVENT){
            mobileOpenMenus.call(this);

        }else if( event.type===this.MENU_CLOSE_EVENT){
            mobileCloseMenus.call(this);

            console.log( this.observerItems )
            if( this.observerItems.length>0 ){
                for( var i= 0,len=this.observerItems.length;i<len;i++) {
                    this.observerItems[i].fn.call(this.observerItems[i].context);
                }
            }
        }
    };

    function mobileOpenMenus() {
        var that=this;
        mobileMenuView.call(this, true);
        that.mobileOpenBtn.addClass('open');
        activeMobileMainMenus.call(this, -1);

        /*$(window).on('scroll.menu', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        });*/
        //Utils.getMobileHeader(false, {flag:'active', target:'.nav-bar'});
        menuSequenceMotion.call(that, true);

    }

    function mobileCloseMenus() {
        var that=this;
        //this.mobileCloseChk=false;
        mobileMenuView.call(this, false);
        that.mobileOpenBtn.removeClass('open');
        //$(window).off('scroll.menu');
        //Utils.getMobileHeader(true, {flag:'active', target:'.nav-bar'});
        activeMobileMainMenus.call(this, -1);
        menuSequenceMotion.call(this, false);

    }
    //닫기시 외부 함수 저장 실행.
    CMenu.prototype.mCloseObserver=function(fn, context) {
        this.observerItems.push({fn:fn, context:context});
    };

    //모바일 이벤트 초기화
    CMenu.prototype.mobileEventInit=function() {
        var that=this;
        that.mobileOpenBtn.on('click.open-menu', $.proxy(that.onOpenBtnClick, that));
        //that.mobileCloseBtn.on('click.close-menu', $.proxy(that.onCloseBtnClick, that));
        that.evtTarget.on(that.MENU_OPEN_EVENT, $.proxy( that.onMenuToggleEvent, that) );
        that.evtTarget.on(that.MENU_CLOSE_EVENT, $.proxy( that.onMenuToggleEvent, that) );

        that.subItem = that.sub.find("li");
        that.main.on('click.main-menu', $.proxy(that.onMobileMainClick, that) );
        that.subItem.on('click.sub-menu', $.proxy(that.onMobileSubClick, that ));

        Utils.transition(that.mobileContainer, 'transform', 750, 'easeInOutCubic');
        Utils.transitionEnd(this.mobileContainer, function(e) {
            if( that.mobileCloseChk===false ) {
                $(this).addClass('hide');
            }
        });
        that.sub.on('transitionend webkitTransitionEnd oTransitionEnd msTransitionEnd', function(e) {
            var idx=$(this).parent().index();
            if( that.menus[idx].active===false ){
                $(this).addClass('hide');
            }
        });
    };

    CMenu.prototype.mobileInit=function() {
        var that=this;
        //초기에 메뉴 화면에서 없앰.
        that.mobileContainer.addClass('hide');
        mobileMenuView.call(this, false);
        that.main.parent().removeAttr('style');
        that.sub.addClass('hide');
        that.sub.removeAttr('style');
        that.mobileNavBarH=56;
        TweenLite.set( that.main, {alpha:0, z:500, scaleX: 1.3, scaleY: 1.3 } );
        if( !Utils.isEmpty(that.addMotionMobileMenu) ){
            TweenLite.set( that.addMotionMobileMenu, {alpha:0, z:500, scaleX: 1.3, scaleY: 1.3 } );
        }
        TweenLite.to( that.navbar, 0.5, {height:this.mobileNavBarH});
        that.mobileEventInit();
    };

    CMenu.prototype.mobileMenuCleanup=function() {
        //초기에 메뉴 화면에서 없앰.
        this.mobileContainer.removeClass('hide');
        this.mobileContainer.removeAttr('style');
        this.mobileCloseChk=false;
        updateContainerFixed.call(this, false);
        mobileMenuView.call(this, false);
        this.mobileOpenBtn.removeClass('open');
        this.main.removeAttr('style');
        this.sub.removeClass('hide');

        this.sub.removeAttr('style');
        this.navbar.removeAttr('style');
        if( !Utils.isEmpty(this.addMotionMobileMenu) ){
            this.addMotionMobileMenu.removeAttr('style');
        }

        //console.log( 'this.observerItems=', this.observerItems )
        if( this.observerItems.length>0 ){
            for( var i= 0,len=this.observerItems.length;i<len;i++) {
                this.observerItems[i].fn.call(this.observerItems[i].context);
            }
            this.observerItems = [];
        }

        //TweenLite.set( this.mobileCloseBtn, { opacity:0 } );
    };

    //모바일 이벤트 지우기.
    CMenu.prototype.mobileEventCleanup=function() {
        var that=this;
        that.mobileOpenBtn.off('click.open-menu', $.proxy(that.onOpenBtnClick, that));
        //that.mobileCloseBtn.off('click.close-menu', $.proxy(that.onCloseBtnClick, that));
        that.subItem = that.sub.find("li");
        that.main.off('click.main-menu', $.proxy(that.onMobileMainClick, that ));
        that.subItem.off('click.sub-menu', $.proxy(that.onMobileSubClick, that ));
        that.sub.off('transitionend webkitTransitionEnd oTransitionEnd msTransitionEnd');
        Utils.transitionEnd(this.mobileContainer, false );

        that.evtTarget.off(that.MENU_OPEN_EVENT, $.proxy( that.onMenuToggleEvent, that) );
        that.evtTarget.off(that.MENU_CLOSE_EVENT, $.proxy( that.onMenuToggleEvent, that) );
    };

    CMenu.prototype.onOpenBtnClick=function(e) {
        e.preventDefault();
        //console.log( '클릭 오픈')
        mobileMenuEventAdapter.call(this);
    };

    CMenu.prototype.onCloseBtnClick=function(e) {
        e.preventDefault();
    };

    CMenu.prototype.desktopInit=function() {
        var that=this;
        that.sub.attr('style', '');
        that.deskTopEventInit();
    };

    //데스크탑 이벤트 초기화
    CMenu.prototype.deskTopEventInit=function() {
        var that = this;
        that.subItem = that.sub.find("li");
        that.main.on("mouseenter.main-menu focusin", $.proxy(that.onMainOver, that ));
        that.main.on("mouseleave.main-menu focusout",$.proxy( that.onMainOut, that ));
        that.subItem.on("mouseenter.sub-menu focusin", $.proxy(that.onSubOver, that ));
        that.subItem.on("mouseleave.sub-menu focusout", $.proxy(that.onSubOut, that ));
    };

    //데스크탑 이벤트 제거.
    CMenu.prototype.deskTopEventCleanup=function() {
        var that = this;
        that.subItem = that.sub.find("li");
        that.main.off("mouseenter.main-menu focusin", $.proxy(that.onMainOver, that ));
        that.main.off("mouseleave.main-menu focusout",$.proxy( that.onMainOut, that ));
        that.subItem.off("mouseenter.sub-menu focusin", $.proxy(that.onSubOver, that ));
        that.subItem.off("mouseleave.sub-menu focusout", $.proxy(that.onSubOut, that ));
    };
    CMenu.prototype.deskTopCleanup=function() {
        this.main.removeAttr('style');

        for( var i=this.menus.length-1;i>=0;i--) {
            TweenLite.killTweensOf( this.menus[i].main );
        }
    };

    CMenu.prototype.onMainOver=function(e) {
        var that=this;
        var idx = $(e.currentTarget).index();
        that.overMainIdx = idx;
        activeMainMenus.call(that, idx);
        activeSubContainer.call(that, idx);
        activeSlideBar.call(that, idx);
    };

    CMenu.prototype.onMainOut=function(e) {
        var that=this;
        that.overMainIdx = -1;
        activeMainMenus.call(that, that.getMainIndex());
        activeSubContainer.call(that, -1);
        activeSlideBar.call(that, that.getMainIndex());
        //console.log( that.getMainIndex() )
    };

    CMenu.prototype.onSubOver=function(e) {
        var that=this;
        var idx = $(e.currentTarget).index();
        that.overSubIdx = idx;
        activeSubMenus.call(that, that.overMainIdx, that.overSubIdx);
    };

    CMenu.prototype.onSubOut=function(e) {
        var that=this;
        that.overSubIdx = -1;
        activeSubMenus.call(that, that.getMainIndex(), that.getSubIndex() );
    };


    function activeMobileMainMenus(idx, event) {
        var that=this;
        var mainMenus = that.menus;
        var mainMenusLen = mainMenus.length;
        for(var i=0, len=mainMenusLen;i<len;i++) {
            var subContainer = that.menus[i].sub[0].cont;
            var main = that.menus[i].main;

            if (i === idx) {

                if (that.menus[idx].active == false) {

                    //console.log( '클릭', that.menus[idx].active, idx, main, that.menus[idx].main.hasClass('active'))
                    that.menus[idx].main.addClass('active');

                    if (subContainer !== false) {
                        if( event !==undefined ){
                            event.preventDefault();
                        }
                        var activeSubGroup = that.menus[idx].sub[0].cont;
                        activeSubGroup.removeClass('hide').addClass('active');
                        var timer = setTimeout(function () {
                            clearTimeout(timer);
                            Utils.transition(activeSubGroup, { height: that.menus[idx].sub[0].th, opacity: 1}, 550, 'easeOutBack');
                        }, 100);
                    }

                } else {
                    that.menus[idx].main.removeClass('active');
                    if (subContainer !== false) {
                        if( event !==undefined ){
                            event.preventDefault();
                        }
                        subContainer.removeClass('active');
                        Utils.transition(subContainer, {height: 0, opacity: 0}, 300, 'easeOutBack');
                    }
                }

            } else {
                main.removeClass('active');
                if (subContainer !== false) {
                    subContainer.removeClass('active');
                    Utils.transition(subContainer, {height: 0, opacity: 0}, 300, 'easeOutBack');
                }
                that.menus[i].active = false;
            }
        }

        /*activeSubBar.call(that, false);
         activeContainer.call(that, false);*/
    }

    function resetMenus() {
        var that=this;
        var mainMenus = that.menus;
        var mainMenusLen = mainMenus.length;
        var i = 0;
        var j = 0;

        for( i=0, len=mainMenusLen;i<len;i++) {
            that.menus[i].main.removeClass('active');
            if (that.menus[i].sub !== undefined) {
                var subContainer = that.menus[i].sub[0].cont;
                if (subContainer !== false) {
                    subContainer.removeClass('active').attr('style', '');
                    for (j = 0; j < that.menus[i].sub[0].item.length; j++) {
                        $(that.menus[i].sub[0].item[j]).removeClass("active");
                    }
                }
            }
        }

        activeSubBar.call(that, false);
        activeContainer.call(that, false);
    }

    function activeMainMenus(id) {
        var that = this;
        var mainMenus = that.menus;
        var mainMenusLen = mainMenus.length;
        //activeSlideBar.call(that, id);
        for (var i = 0; i < mainMenusLen; i++) {
            var main = that.menus[i].main;
            if (id == i) {
                main.addClass('active');
            } else {
                main.removeClass('active');
            }
        }

        if(id>=0) {
            if( that.menus[id].sub!==undefined) {
                if (that.menus[id].sub[0].cont !== false) {
                    activeContainer.call(that, true);
                } else {
                    activeContainer.call(that, false);
                }
            }else{
                activeContainer.call(that, false);
            }
        }else{
            activeContainer.call(that, false);
        }

    }

    function activeSubContainer( id ){
        var that = this;
        var mainMenus = that.menus;
        var mainMenusLen = mainMenus.length;

        for (var i = 0; i < mainMenusLen; i++) {
            var subContainer = that.menus[i].sub[0].cont;
            if (id == i) {
                if (subContainer !== false) {
                    var tx=that.menus[i].sub[0].left;
                    var tw=that.menus[i].sub[0].width;
                    subContainer.addClass('active');
                    subContainer.css({left:tx, width:tw}).stop(true, false).animate({marginTop:0, opacity:1}, 350);
                }
            } else {
                if (subContainer !== false) {
                    subContainer.stop(true, false).animate({marginTop:-10, opacity:0}, 250, function() {
                        $(this).removeClass('active');
                    });
                }
            }
        }
        // subBarMove.call(that, id); //서브바 width 100%인 경우
    }

    function subBarMove( id ) {
        if(id>=0) {
            if( that.menus[id].sub!==undefined) {
                if (that.menus[id].sub[0].cont !== false) {
                    activeSubBar.call(that, true);
                } else {
                    activeSubBar.call(that, false);
                }
            }else{
                activeSubBar.call(that, false);
            }
        }else{
            activeSubBar.call(that, false);
        }
    }

    function activeContainer(activeChk) {
        var that = this;

        if (that.active !== null) {
            if (activeChk) {
                that.container.addClass(that.active);
            } else {
                that.container.removeClass(that.active);
            }
        } else {
            if (activeChk) {
                that.container.css({height: 142});
            } else {
                that.container.css({height: 70});
            }
        }
    }

    function activeSubMenus(mIdx, sIdx) {
        var that = this;
        var i = 0;
        var j = 0;
        for (i = 0; i < that.menus.length; i++) {
            if (mIdx === i) {
                if (that.menus[i].sub !== undefined) {
                    if (that.menus[i].sub[0].cont !== false) {
                        for (j = 0; j < that.menus[mIdx].sub[0].item.length; j++) {
                            var targetItem = $(that.menus[mIdx].sub[0].item[j]);
                            if (sIdx === j) {
                                targetItem.addClass("active");
                            } else {
                                targetItem.removeClass("active");
                            }
                        }
                    }
                }
            } else {
                if (that.menus[i].sub !== undefined) {
                    if (that.menus[i].sub[0].cont !== false) {
                        for (j = 0; j < that.menus[i].sub[0].item.length; j++) {
                            if (i !== mIdx) {
                                $(that.menus[i].sub[0].item[j]).removeClass("active");
                            }
                        }
                    }
                }
            }
        }
    }

    function activeSlideBar(id) {
        var that = this;
        if (emptyCheck.call(that, that.slidebar) === false) { return; }
        //
        var gap=40;
        var mainX =0
        var mainW =0

        if (id>=0) {
            mainX =that.menus[id].main.position().left+gap/2;
            mainW = that.menus[id].realW-gap;
        }else{
            mainX=-10;
            width=0;
        }
        that.slidebar.stop(true, false).animate({left: mainX, width: mainW}, 350)
    }

    function activeSubBar(chk) {
        var that = this;
        var bar = that.subbar;

        if (emptyCheck.call(that, that.subbar) === false) { return; }

        var th = (chk == true) ? 40 : 0;
        var spd=(chk===true)? 200 : 250;
        bar.stop(true, false).animate({height: th}, spd );
    }

    function emptyCheck(item) {
        return ( item !== null ) ? true : false;
    }

    return CMenu;
}(jQuery) );
/*end: gnb*/

DraApp.SideMenus=( function($) {
    function SideMenus( items ) {
        this.container = (items.container !== undefined) ? $(items.container) : $(window);
        this.langBtn=(items.langBtn!==undefined)? $(items.langBtn) : null;
        this.langBtnTxt=(items.langBtnTxt!==undefined)? $(items.langBtnTxt) : null;
        this.langMenus = (items.langMenus !== undefined) ? $(items.langMenus) : null;
        this.searchBtn = (items.searchBtn !== undefined) ? $(items.searchBtn) : null;
        this.searchField = (items.searchField !== undefined) ? $(items.searchField) : null;
        this.searchClose = (items.searchClose !== undefined) ? $(items.searchClose) : null;
        this.mobileSearchClose = (items.mobileSearchClose !== undefined) ? $(items.mobileSearchClose) : null;
        this.autoFieldContainer = (items.autoFieldContainer !== undefined) ? $(items.autoFieldContainer) : null;
        this.quickMenuCntSelector= (items.quickMenuContainer !== undefined) ? items.quickMenuContainer : null;
        this.quickMenuContainer = (this.quickMenuCntSelector!== undefined && this.quickMenuCntSelector!==null) ? $(this.quickMenuCntSelector) : null;
        this.quickItems = (items.quickItems !== undefined) ? items.quickItems : null;
        this.replaceQuickItems = [];
        this.GnbClass=(items.GnbClass !== undefined) ? items.GnbClass : null;
        this.inputField=null;

        this.quickItemTxtPropName = 'txt';
        this.quickItemLinkPropName = 'link';

        if( this.searchField!==null ){
            this.inputField=this.searchField.find('input');
        }
        this.gnbContainer=$('nav');
        this.langBtnToggle=false;
        this.langMenuFocusIn=false;
        this.langBtnFocusIn=false;
        this.isSearchOpen=false;


        if (items.isMobile !== undefined) {
            if (typeof items.isMobile === "boolean") {
                this.isMobile = items.isMobile;
            } else {
                this.isMobile = false;
            }
        } else {
            this.isMobile = false;
        }
    }

    /**
     *  dim 처리
     * @param toggleChk
     */
    function displayContainerToDim( toggleChk ) {
        if( toggleChk ) {
            this.gnbContainer.before('<div class="dim" class="dim">&nbsp;</div>');
            var dim = $('.dim');
            dim.fadeIn(300);
        }else{
            var dim = $('.dim');
            if(dim.get()[0]!==undefined || dim.get()[0]!==null) {
                dim.fadeOut(300, function(){
                    clearDim();
                });
            }
        }
    }

    /**
     * dim처리 된 엘리먼트 제거
     */
    function clearDim() {
        var timer=setTimeout(function() {
            var dim = $('.dim');
            if(dim.get()[0]!==undefined || dim.get()[0]!==null) {
                dim.off('click.dim');
                dim.remove();
            }
            clearTimeout(timer);
        }, 250);
    }
    /**
     * 이벤트 유무 체크
     * @param  {String}  target    jquery selector 문자열
     * @param  {String}  eventType 이벤트 문자열
     */
    function hasEvent( target, type) {
        var eventTarget = '';
        if(typeof target==='string'){
            eventTarget=$(target)[0];
        }else if(typeof target==='object'){
            eventTarget=target[0]
        }else{
            return
        }
        var events = $._data(eventTarget, 'events')[type];
        if (events) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 데스크탑버전 검색 창 열리고 닫힐때 모션
     * @param isActive
     */
    function searchMove( isActive ) {
        var that=this;
        if( isActive ) {
            var tw=( that.searchW-that.containerW)*-1;
            //CMenu 클래스 메소드를 호출~
            that.GnbClass.changeMenuMotion(true);
            TweenLite.set( that.searchField, {display:'block', opacity: 0} );
            TweenLite.to( that.searchField, 0.5, {delay:0.15, opacity:1, left: tw, width:that.searchW, onComplete:function(){
                    that.isSearchOpen=true;
                } } );
        }else{
            //CMenu 클래스 메소드를 호출~
            that.GnbClass.changeMenuMotion(false);
            TweenLite.to( that.searchField, 0.3, {left:that.disabledSearchW*-1, opacity:0, width:that.disabledSearchW, onComplete:function(){
                    that.searchField.css({display:'none'});
                    this.isSearchOpen=false;
                }} );
        }
    }

    /**
     * 언어 표시 메뉴 활성 / 비활성
     * @param chk
     */
    function langMenuActive( chk ) {
        var that=this;
        if( chk ) {
            that.langBtn.addClass('active');
            that.langMenus.stop().fadeIn();
        }else{
            that.langBtn.removeClass('active');
            that.langMenus.stop().fadeOut();
        }
    }

    function destoryItems( $children, className ) {
        $children.each( function(i, item) {
            if( $(item).hasClass( className ) ){
                $(item).remove();
            }
        });
    }
    function destoryItem( $target ) {
        if(  !Utils.isEmpty( $target ) ){
            $target.remove();
        }
    }

    /**
     * 모바일버전에서 검색 닫기 버튼 모션 ( 활성/비활성 )
     * @param isOpen
     */
    function mobileSearchCloseBtnMotion( isOpen ) {
        var that=this;
        var ty=0;
        var talpha=0;
        var closeBtnMotionObj={};
        var logoMotionObj={};

        that.mobileSearchClose.show();
        TweenLite.set( that.mobileSearchClose, {opacity:0, y:100} );
        if( isOpen ){
            closeBtnMotionObj={y:0, alpha: 1, visibility: 'visible', ease: Power2.easeInOut}
            logoMotionObj={y:-100, alpha:0,  ease: Power2.easeInOut, onComplete:function(){
                    $('h1>a').css('visibility', 'hidden');
                }}
        }else{
            $('h1>a').css('visibility', 'visible');
            closeBtnMotionObj={y:100, alpha:0,  ease: Power2.easeInOut}
            logoMotionObj={y:0, alpha:1,  ease: Power2.easeInOut, onComplete:function(){
                    that.mobileSearchClose.css('visibility', 'hidden');
                    that.mobileSearchClose.hide();
                }}
        }

        TweenLite.to(that.mobileSearchClose, 0.5, closeBtnMotionObj);
        TweenLite.to($('h1>a'), 0.5, logoMotionObj );
    }

    SideMenus.prototype.getMobile = function () {
        return this.isMobile;
    };
    SideMenus.prototype.setMobile = function (value) {
        this.isMobile = (typeof value === "boolean") ? value : false;
    };

    SideMenus.prototype.update=function() {
        this.containerW=this.container.outerWidth();
        this.searchW=900;
        this.disabledSearchW=200;
        this.init();
    };
    SideMenus.prototype.init = function () {
        var that = this;
        //reset, cleanup
        that.sideMenuEventCleanup();
        that.sideMenuCleanup();

        that.sideMenuInit();

        if(that.getMobile()===true) {
            that.sideMenuMobileEventInit();
        }else{
            that.sideMenuDesktopEventInit();
            var langBtnW=that.langBtn.parent().outerWidth();
            var langMenuW=this.langMenus.outerWidth();
            this.langMenus.css({left:( langBtnW-langMenuW )/2 });
        }
    };

    SideMenus.prototype.sideMenuInit=function() {

        this.langBtnToggle=true;
        langMenuActive.call(this, false);

        $('h1>a').removeAttr('style');
        this.mobileSearchClose.removeAttr('style');

        //서치바 css스타일을 초기화
        this.searchField.removeAttr('style');

        //데스크탑일 경우에만 아래와 같이 초기화
        if( !this.getMobile() ){
            this.searchField.css({left:this.disabledSearchW*-1, width:this.disabledSearchW});
        }
    };

    SideMenus.prototype.addQuickLink=function( txtValue, linkValue ) {
        var fieldStr=this.createQuickLinkTag( txtValue, linkValue );
        this.quickMenuContainer.append( fieldStr );
        var quickItems=this.quickMenuContainer.find('.guick-menu-item');
        quickItems.last().css({opacity:1});
    };

    SideMenus.prototype.quickLinkItemInit=function( isInit ) {
        var that=this;
        //초기에 설정한 빠른 링크 값으로 초기화
        if( isInit ){
            //초기 상태라면 데이터를 초기입력데이터로 전환.
            this.setQuickItems(this.quickItems);
        }

        //기본 설정되어 있는 빠른링크메뉴 제거.
        this.destroyQuickMenu();

        var quickValueStr = '';
        for( var i=0;i<this.getQuickItems().length;i++) {
            quickValueStr+=this.createQuickLinkTag( this.getQuickItems()[i][this.getQuickItemTxtPropName()],this.getQuickItems()[i][this.getQuickItemLinkPropName()] );
        }
        if( Utils.isEmpty( this.quickMenuContainer ) ){
            this.autoFieldContainer.prepend('<div class="result-item quick-menu-container"><p class="tit">빠른 링크</p></div>');
            this.quickMenuContainer=$(this.quickMenuCntSelector);
        }
        this.quickMenuContainer.append( quickValueStr );

        this.quickMenuContainer.show();
    };

    SideMenus.prototype.createQuickLink=function( isInit ) {
        var that=this;

        this.quickLinkItemInit(isInit);

        TweenLite.to(this.autoFieldContainer, 0.3, {opacity:1, onComplete:function(){
                if( !Utils.isEmpty( that.quickMenuContainer) ){
                    var quickLinkMenus= that.quickMenuContainer.find('.guick-menu-item');
                    var len = quickLinkMenus.length;
                    for (var i = 0; i < len; i++) {
                        TweenLite.set( quickLinkMenus.eq(i), {opacity:0, x: -50});
                        TweenLite.to( quickLinkMenus.eq(i), 0.5, {delay: i * 0.1, opacity: 1, x: 0});
                    }
                }
            }});
    };

    SideMenus.prototype.createMobileQuickLink=function( isInit ) {
        var that=this;

        this.quickLinkItemInit(isInit);

        TweenLite.to(this.autoFieldContainer, 0.3, {opacity:1, onComplete:function(){
                if( !Utils.isEmpty( that.quickMenuContainer) ){
                    var quickLinkMenus= that.quickMenuContainer.find('.guick-menu-item');
                    var len = quickLinkMenus.length;
                    for (var i = 0; i < len; i++) {
                        TweenLite.set( quickLinkMenus.eq(i), {opacity:0, y: 50});
                        TweenLite.to( quickLinkMenus.eq(i), 0.5, {delay: i * 0.1, opacity: 1, y: 0});
                    }
                }
            }});
    };
    //this.quickItemTxtPropName
    //this.quickItemLinkPropName
    SideMenus.prototype.getQuickItemTxtPropName=function() {
        return this.quickItemTxtPropName;
    };
    SideMenus.prototype.setQuickItemTxtPropName=function( value ) {
        this.quickItemTxtPropName=value;
    };
    SideMenus.prototype.getQuickItemLinkPropName=function() {
        return this.quickItemLinkPropName;
    };
    SideMenus.prototype.setQuickItemLinkPropName=function( value ) {
        this.quickItemLinkPropName=value;
    };
    SideMenus.prototype.getQuickItems=function() {
        return this.replaceQuickItems;
    };
    SideMenus.prototype.setQuickItems=function( data ) {
        this.replaceQuickItems=data;
    };


    /**
     * 빠른링크메뉴 재설정.
     * @param quickMenuData - 빠른링크메뉴데이터
     * @param txtPropName - 텍스트값으로 지정할 데이터 속성명
     * @param linkPropName - 링크값으로 지정할 데이터 속성명
     */
    SideMenus.prototype.setQuickLinkMenu=function( quickMenuData, txtPropName, linkPropName ) {
        //데이터가 없다면 종료
        if(Utils.isEmpty(quickMenuData) ){ return }
        //데이터가 array or object 가 아니면 종료
        if( !Utils.isArray( quickMenuData ) || !Utils.isObject( quickMenuData ) ){ return }

        //기본 설정되어 있는 빠른링크메뉴 제거.
        this.destroyQuickMenu();

        //데이터 복사
        var data = quickMenuData.slice(0);
        this.setQuickItems(data);
        this.setQuickItemTxtPropName(txtPropName);
        this.setQuickItemLinkPropName(linkPropName);

        //데이터 갱신을 알리며 재생성.
        this.createQuickLink(false);
    };

    SideMenus.prototype.createQuickLinkTag=function( txtValue, linkValue ) {
        return '<div class="guick-menu-item"><a href="'+linkValue+'" class="txt">'+txtValue+'</a></div>';
    };

    SideMenus.prototype.destroyQuickMenu=function() {

        destoryItem.call(this, this.quickMenuContainer );
        this.quickMenuContainer=null;

    };

    SideMenus.prototype.sideMenuMobileEventInit=function() {
        var that=this;
        if( that.langBtn !==null) {
            that.langBtn.on('click.langBtn',  $.proxy(that.langBtnClick, that));
        }
        if( that.autoFieldContainer !==null ){
            if( that.inputField!==null ) {
                that.inputField.on('focusin.mobile-quick', $.proxy(that.onMobileSearchQuickLink, that) );
            }
        }
        that.mobileSearchClose.on('click.mobile-srch-close', $.proxy(that.onMobileSearchCloseClick, that));
        that.langMenuMobileEventInit();
    };
    SideMenus.prototype.sideMenuDesktopEventInit=function() {
        var that=this;
        if( that.searchBtn!==null) {
            that.searchBtn.on('click.search', $.proxy(that.onSearchMenuClick, that) );
        }
        if( that.searchClose!==null ) {
            that.searchClose.on('click.close-search', $.proxy(that.onSearchCloseBtnClick, that) );
        }
        if( that.langBtn !==null) {
            that.langBtn.on('click.langBtn',  $.proxy(that.langBtnClick, that))
            that.langBtn.on('blur.langBtn',  $.proxy(that.langBtnBlur, that) )
        }
        if( that.autoFieldContainer !==null ){
            if( that.inputField!==null ) {
                that.inputField.on('focusin.desktop-quick', $.proxy(that.onDesktopSearchQuickLink, that) );
            }
        }

        that.langMenuDesktopEventInit();
    };


    //모바일버전 빠른링크 focus event
    SideMenus.prototype.onMobileSearchQuickLink=function(e) {
        var that=this;
        that.GnbClass.slideMenuMotion(true);

        this.autoFieldContainer.show();
        this.createMobileQuickLink(true);

        mobileSearchCloseBtnMotion.call(this, true);
    };
    //데스크탑버전 빠른링크 focus event
    SideMenus.prototype.onDesktopSearchQuickLink=function(e) {
        var that=this;
        //this.isSearchOpen 정의는 searchMove함수에 정의되어 있다. 빠른링크모션이 완료후에 검색필드가 활성화 되었는지 isSearchOpen변수가 참조한다.
        if( Utils.isEmpty(this.quickMenuContainer) ){
            this.autoFieldContainer.show();
            this.createQuickLink(true);
            displayContainerToDim.call(this, true);
            this.dimedControl();
        }
    };

    SideMenus.prototype.dimedControl=function() {
        var that=this;

        var dim = $('.dim');
        dim.on('click.dim', function(e){
            that.clearSearchField();
            displayContainerToDim.call(that, false);
        });
    };

    SideMenus.prototype.clearSearchField=function(){
        var that=this;

        TweenLite.to(that.autoFieldContainer, 0.3, {opacity:0, onComplete:function(){
                TweenLite.set(that.autoFieldContainer, {display: 'none'});

                //검색필드 포커스가 벗어날때 빠른 링크메뉴 제거~
                that.destroyQuickMenu();
            }});

        //검색필드 포커스가 벗어날때 검색창 비활성
        this.searchInputFieldInit();
        if( this.getMobile() ){
            this.GnbClass.slideMenuMotion(false);
        }else{
            searchMove.call(this, false);
        }
    }

    SideMenus.prototype.activeQuickMenu=function() {
        this.createQuickLink(true);
    };

    SideMenus.prototype.searchInputFieldInit=function() {
        var that=this;
        var inputField=that.searchField.find('input');
        inputField.val('');
    };
    SideMenus.prototype.onSearchMenuClick=function(e) {
        e.preventDefault();

        searchMove.call(this, true);
        var inputField=this.searchField.find('input');
        inputField.focus();
    };

    SideMenus.prototype.onMobileSearchCloseClick=function() {
        var that=this;
        that.clearSearchField();
        mobileSearchCloseBtnMotion.call(this, false);
    };

    SideMenus.prototype.onSearchCloseBtnClick=function(e) {
        var that=this;
        that.clearSearchField();
        displayContainerToDim.call(that, false);
    };
    SideMenus.prototype.sideMenuCleanup=function() {
        var that=this;
        //this.clearSearchField();
        if( !this.getMobile() ){
            this.GnbClass.slideMenuMotion(false);
        }
        that.autoFieldContainer.css({display: 'none', opacity:0});
        //검색필드 포커스가 벗어날때 빠른 링크메뉴 제거~
        that.destroyQuickMenu();

        //검색필드 포커스가 벗어날때 검색창 비활성
        this.searchInputFieldInit();

        displayContainerToDim.call(that, false);
        //mobileSearchCloseBtnMotion.call(this, false);

        TweenLite.killTweensOf( that.searchField );
    };
    SideMenus.prototype.sideMenuEventCleanup=function() {
        var that=this;
        that.searchBtn.off("click.search", $.proxy(that.onSearchCloseBtnClick, that ));
        that.searchClose.off('click.close-search', $.proxy(that.onSearchCloseBtnClick, that) );
        that.mobileSearchClose.off('click.mobile-srch-close', $.proxy(that.onMobileSearchCloseClick, that));


        that.langBtn.off('click.langBtn',  $.proxy(that.langBtnClick, that) );
        that.langBtn.off('blur.langBtn',  $.proxy(that.langBtnBlur, that) );

        var langMenus=this.langMenus.children();
        langMenus.off('click.lang-menus', $.proxy(that.langMenusClick, that));
        langMenus.off('focusin.lang-menus', $.proxy(that.langMenusFocusIn, that));
        langMenus.off('focusout.lang-menus', $.proxy(that.langMenusFocusOut, that));

        if( that.autoFieldContainer !==null ){
            if( that.inputField!==null ) {
                that.inputField.off('focusin.desktop-quick', $.proxy(that.onDesktopSearchQuickLink, that) );
                that.inputField.off('focusin.mobile-quick', $.proxy(that.onMobileSearchQuickLink, that) );
            }
        }
    };
    SideMenus.prototype.langBtnBlur=function(e) {
        e.preventDefault();
        langMenuActive.call(this, false);
        this.langBtnToggle=true;
    };
    SideMenus.prototype.langBtnClick=function(e) {
        e.preventDefault();
        var that=this;
        if( that.langBtnToggle===true ){
            langMenuActive.call(that, true);
            that.langBtnToggle=false;
        }else{
            langMenuActive.call(that, false);
            that.langBtnToggle=true;
        }
    };
    SideMenus.prototype.langMenuMobileEventInit=function() {
        var that=this;
        var menus=this.langMenus.children();
        menus.on('click.lang-menus', $.proxy(that.langMenusClick, that));
    };

    SideMenus.prototype.langMenuDesktopEventInit=function() {
        var that=this;
        var menus=this.langMenus.children();
        menus.on('click.lang-menus', $.proxy(that.langMenusClick, that));
        menus.on('focusin.lang-menus', $.proxy(that.langMenusFocusIn, that));
        menus.on('focusout.lang-menus', $.proxy(that.langMenusFocusOut, that));
    };
    SideMenus.prototype.langMenusFocusIn=function(e) {
        //e.preventDefault();
        var that=this;
        langMenuActive.call(that, true);
        that.langBtnToggle=true;
    };
    SideMenus.prototype.langMenusFocusOut=function(e) {
        //e.preventDefault();
        var menus=this.langMenus.children();
        langMenuActive.call(this, false);
        this.langBtnToggle=true;
    };
    SideMenus.prototype.langMenusClick=function(e) {
        //e.preventDefault();
        var that=this;
        var target=$(e.currentTarget);
        this.setlangBtnValue( target.index() );

        langMenuActive.call(that, that.langBtnToggle);
        that.langBtnToggle=true;
    };
    SideMenus.prototype.setlangBtnValue=function( idx ) {
        var that=this;
        var menus=that.langMenus.children();
        var textValue=menus.eq(idx).find('.txt').attr('data-text');
        if( textValue!==undefined ) {
            this.langBtnTxt.text(textValue);
        }
    };

    return SideMenus;
}(jQuery))







