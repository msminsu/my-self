
var KNBUI = KNBUI || {};
/**
 * by MOON KYUNG TAE
 * version - 1.0
 * module name : horizontalBox
 */
(function($){
    var pluginName = 'horizontalBox';

    function Plugin(node, param){
        this.options = $.extend({}, this.defaults, param);
        this.wrapper = node;
        this.scroller = node.children().eq(0);
        this.detect = {
            bounceTime:400,
            directionX:'',
            distanceX:0,
            startTime:0,
            endTime:0,
            enabled:false,
            flickCount:0,
            flickSize:0,
            flickList:[],
            flickEnabled:false,
            flickPositionNumber:null,
            hasHorizontalScroll:false,
            isInflick:false,
            isScrolling:false,
            isInTransition:false,
            isMobile:false,
            itemLength:0,
            itemLeftPositon:[],
            itemRightPositon:[],
            maxScrollX:0,
            naviTarget:null,
            pointX:0,
            pointY:0,
            snapId:0,
            startX:0,
            scrollerWidth:0,
            wrapperOffset:null,
            wrapperWidth:0,
            x:0
        };

        this._init();
    }

    Plugin.prototype = {
        defaults:{
            autoPlay:false,
            control:false,
            callback:null,
            flick:false,
            flickPanelName:'.flick-panel',
            indicator:false,
            indicatorType:'dot',
            item:'',
            loop:true,
            momentum:true,
            navi:'',
            playSpeed:8000,
            start:0,
            startX:0,
            snap:false,
            ui:'scroll'
        },

        _utils:(function(){
            var _vendor = (function(){
                var vendors = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'];

                for(var i = 0, max = vendors.length; i < max; i++){
                    if(vendors[i] in document.createElement('div').style){
                        return vendors[i].substr(0, vendors[i].length - 9);
                    }
                }
                return false;
            })();

            var _isMobile = (function(){
                function isAndroid(){
                    return navigator.userAgent.match(/Android/i);
                }

                function isBlackBerry(){
                    return navigator.userAgent.match(/BlackBerry/i);
                }

                function isiOS(){
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                }

                function isOpera(){
                    return navigator.userAgent.match(/Opera Mini/i);
                }

                function isWindows(){
                    return navigator.userAgent.match(/IEMobile/i);
                }

                function isMobile(){
                    return (isAndroid() || isiOS() || isBlackBerry() || isOpera() || isWindows());
                }

                return isMobile();
            }());

            function _prefixStyle(style){
                if(_vendor === false){
                    return false;
                }
                if(_vendor === ''){
                    return style;
                }
                return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
            }

            function _addEvent(element, type, fn, scope){
                element.on(type, function(e){
                    fn.call(scope, e);
                });
            }

            function _removeEvent(element, type){
                element.off(type);
            }

            function _offset(element){
                var left = -element.offsetLeft,
                    top = -element.offsetTop;

                while(element = element.offsetParent){
                    left -= element.offsetLeft;
                    top -= element.offsetTop;
                }

                return {
                    left:left,
                    top:top
                };
            }

            function _momentum(current, start, time, lowerMargin, wrapperSize){
                var distance = current - start,
                    speed = Math.abs(distance) / time,
                    destination,
                    duration,
                    deceleration = 0.006;

                destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
                duration = (speed / deceleration) * 2.5;

                if(destination < lowerMargin){
                    destination = lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) );
                    distance = Math.abs(destination - current);
                    duration = (distance / speed) * 2.5;
                }else if(destination > 0){
                    destination = wrapperSize / 2.5 * ( speed / 8 );
                    distance = Math.abs(current) + destination;
                    duration = (distance / speed) * 2.5;
                }

                return {
                    destination:Math.round(destination),
                    duration:duration
                };
            }

            function _flickMapList(current, max){
                var left,
                    right,
                    leftprev,
                    rightnext;

                left = (current == 0) ? max - 1 : current - 1;
                right = (current == max - 1) ? 0 : current + 1;
                leftprev = ((left - 1) < 0) ? max - 1 : left - 1;
                rightnext = (right + 1 > max - 1) ? 0 : right + 1;

                return {
                    current:current,
                    left:left,
                    right:right,
                    leftprev:leftprev,
                    rightnext:rightnext
                }
            }

            function _scrollMoveValue(left, max){
                left = left || 0;

                if(left > 0){
                    left = 0;
                }

                if(left < max){
                    left = max;
                }

                return left;
            }

            return {
                _isMobile:_isMobile,
                _transform:_prefixStyle('transform'),
                _addEvent:_addEvent,
                _removeEvent:_removeEvent,
                _style:{
                    transform:_prefixStyle('transform'),
                    transitionTimingFunction:_prefixStyle('transitionTimingFunction'),
                    transitionDuration:_prefixStyle('transitionDuration'),
                    transitionDelay:_prefixStyle('transitionDelay'),
                    transformOrigin:_prefixStyle('transformOrigin')
                },
                _offset:_offset,
                _momentum:_momentum,
                _flickMapList:_flickMapList,
                _scrollMoveValue:_scrollMoveValue,
                _getTime:Date.now || function getTime(){
                    return new Date().getTime();
                },
                _isBadAndroid:/Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion))
            }
        }()),

        _init:function(){
            this.detect.isMobile = this._utils._isMobile;
            this._setEvents();
            this._setScroll();
            this._refresh();
            this._startPosition();

            if(this.options.ui == 'flick' || this.options.ui == 'card'){
                this._initFlick(this);
            }
        },

        _setEvents:function(){
            this._utils._addEvent($(window), 'orientationchange', this._resize, this);
            this._utils._addEvent($(window), 'resize', this._resize, this);
            this._utils._addEvent(this.scroller, 'transitionend', this._transitionEnd, this);
            this._utils._addEvent(this.scroller, 'webkitTransitionEnd', this._transitionEnd, this);
            this._utils._addEvent(this.scroller, 'oTransitionEnd', this._transitionEnd, this);
            this._utils._addEvent(this.scroller, 'MSTransitionEnd', this._transitionEnd, this);

            if(!this.detect.isMobile){
                this._utils._addEvent(this.wrapper, 'mousedown', this._start, this);
                this._utils._addEvent($(window), 'mousemove', this._move, this);
                this._utils._addEvent($(window), 'mousecancel', this._end, this);
                this._utils._addEvent($(window), 'mouseup', this._end, this);
                return;
            }

            this._utils._addEvent(this.wrapper, 'touchstart', this._start, this);
            this._utils._addEvent(this.wrapper, 'touchmove', this._move, this);
            this._utils._addEvent(this.wrapper, 'touchcancel', this._end, this);
            this._utils._addEvent(this.wrapper, 'touchend', this._end, this);
        },

        _setScroll:function(){
            var i,
                items = this.scroller.find(this.options.item),
                left = 0,
                right = 0,
                selector = this.options.item.split(' '),
                parentWidth = 0;

            this.detect.itemLength = this.detect.itemLength = items.length;

            for(i = 0; i < this.detect.itemLength; i++){
                this.detect.scrollerWidth += $(items[i]).outerWidth();
                this.detect.scrollerWidth += parseInt($(items[i]).css('margin-right'));
                this.detect.scrollerWidth += parseInt($(items[i]).css('margin-left'));

                left = left + $(items[i]).prev().outerWidth();
                left = parseInt($(items[i]).prev().css('margin-left')) == 'NaN' ? left + parseInt($(items[i]).prev().css('margin-left')) : left;
                left = parseInt($(items[i]).prev().css('margin-right')) == 'NaN' ? left + parseInt($(items[i]).prev().css('margin-left')) : left;
                right = left + $(items[i]).outerWidth() + parseInt($(items[i]).prev().css('margin-left')) + parseInt($(items[i]).prev().css('margin-right'));
                this.detect.itemLeftPositon.push(-left);
                this.detect.itemRightPositon.push(-right);
            }

            if(selector.length > 1){
                for(i = 0; i < selector.length - 1; i++){
                    parentWidth += parseInt(this.scroller.find(">" + selector[i]).css('padding-left'));
                    parentWidth += parseInt(this.scroller.find(">" + selector[i]).css('padding-right'));
                    parentWidth += parseInt(this.scroller.find(">" + selector[i]).css('margin-right'));
                    parentWidth += parseInt(this.scroller.find(">" + selector[i]).css('margin-right'));
                    parentWidth += parseInt(this.scroller.find(">" + selector[i]).css('border-right-width'));
                    parentWidth += parseInt(this.scroller.find(">" + selector[i]).css('border-left-width'));
                }
            }

            this.detect.scrollerWidth += parentWidth;
            if(this.options.ui != 'flick' && this.options.ui != 'card'){
                this.scroller.css({
                    'width':(this.detect.scrollerWidth)
                });

            }
        },

        _refresh:function(){
            this.detect.wrapperWidth = this.wrapper[0].clientWidth;
            this.detect.flickSize = this.detect.wrapperWidth;
            this.detect.scrollerWidth = this.scroller[0].offsetWidth;
            this.detect.maxScrollX = this.detect.wrapperWidth - this.detect.scrollerWidth;
            this.detect.endTime = 0;
            this.detect.wrapperOffset = this._utils._offset(this.wrapper[0]);
            this.detect.hasHorizontalScroll = this.detect.maxScrollX < 0;
        },

        _startPosition:function(selector){
            if(!this.detect.hasHorizontalScroll){
                return;
            }

            selector = selector || 'selected';

            var selectedItemIndex = -1;

            this.scroller.find(this.options.item).each(function(index){
                if($(this).hasClass(selector)){
                    selectedItemIndex = index;
                }
            });

            this.options.startX = this._utils._scrollMoveValue(this.detect.itemRightPositon[selectedItemIndex - 2], this.detect.maxScrollX);

            //console.log(this.options.startX);

            this._scrollTo(this.scroller, this.options.startX, 0);
        },

        _resetPosition:function(time){
            time = time || 0;

            var x,
                scrollTarget;

            scrollTarget = (this.options.ui == "flick" || this.options.ui == "card") ? this.scroller.find('>' + this.options.flickPanelName) : this.scroller;

            x = this.detect.x > 0 ? 0 : this.detect.x < this.detect.maxScrollX > 0 ? this.detect.maxScrollX : this.detect.x;

            if(x == this.detect.x){
                return false;
            }
            this._scrollTo(scrollTarget, x, time);

            return true;
        },

        _stop:function(){
            this.detect.isInTransition = false;

            var pos,
                x,
                scrollTarget = (this.options.ui == "flick" || this.options.ui == "card" ) ? this.scroller.find('>' + this.options.flickPanelName) : this.scroller;

            pos = this._getComputedPosition(scrollTarget[0]);
            x = Math.round(pos.x);

            if(!(this.options.ui == "flick") || !(this.options.ui == "card") && this._utils._isBadAndroid){
                var time = this.scroller.css(this._utils._style.transitionDuration, '0.001s');
            }

            this._scrollTo(scrollTarget, x, time);
        },

        _start:function(e){
            e.stopPropagation();

            if((this.options.ui == "scroll") && !this.detect.hasHorizontalScroll){
                this.detect.enabled = false;
                return;
            }

            if((this.options.ui == "flick" || this.options.ui == 'card') && this.detect.isInflick){
                return;
            }

            this.detect.startTime = this._utils._getTime();
            this.detect.isScrolling = false;
            this.detect.enabled = true;

            if(this.detect.isInTransition){
                this._stop();
            }

            var point = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;

            this.detect.distanceX = 0;
            this.detect.distanceY = 0;
            this.detect.startX = this.detect.x;
            this.detect.pointX = point.pageX;
            this.detect.pointY = point.pageY;
        },

        _move:function(e){
            e.stopPropagation();

            if((this.detect.isMobile && e.originalEvent.touches.length > 1) || !this.detect.enabled || !this.detect.hasHorizontalScroll && !(this.options.ui == "flick" || this.options.ui == "card")){
                return;
            }

            this.scroller.css({'pointer-events':'none'});

            var point = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;

            var deltaX = point.pageX - this.detect.pointX,
                deltaY = point.pageY - this.detect.pointY,
                timestamp = this._utils._getTime(),
                newX,
                absDistX,
                absDistY;

            this.detect.pointX = point.pageX;
            this.detect.pointY = point.pageY;

            this.detect.distanceX += deltaX;
            this.detect.distanceY += deltaY;

            absDistX = Math.abs(this.detect.distanceX);
            absDistY = Math.abs(this.detect.distanceY);

            this.detect.isScrolling = !!( this.detect.isScrolling || absDistX < absDistY );

            if(!this.detect.isScrolling){
                e.preventDefault();
            }else{
                return;
            }

            newX = this.detect.x + deltaX;
            this.detect.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;

            newX = (this.options.ui != "flick" && this.options.ui != 'card') ? newX > 0 || newX < this.detect.maxScrollX ? this.detect.x + deltaX / 3 : newX : newX;

            if(timestamp - this.detect.endTime > 300 && absDistX < 10){
                return;
            }

            if(this.options.ui == 'flick' || this.options.ui == 'card'){
                this._translate(this.scroller.find('>' + this.options.flickPanelName), newX);
                return;
            }

            this._translate(this.scroller, newX);
        },

        _end:function(e){
            e.stopPropagation();

            if(!this.detect.hasHorizontalScroll && !(this.options.ui == 'flick') && !(this.options.ui == 'card')){
                return;
            }

            this.scroller.css({'pointer-events':'auto'});
            this.detect.enabled = false;
            this.detect.isInTransition = false;
            this.detect.endTime = this._utils._getTime();

            var momentumX,
                duration = this.detect.endTime - this.detect.startTime,
                newX = Math.round(this.detect.x);

            this.detect.distX = Math.abs(newX - this.detect.startX);

            if(this.options.ui == "flick" || this.options.ui == 'card'){
                this._flick(newX - this.detect.startX);
                return;
            }

            if(this._resetPosition(this.detect.bounceTime)){
                return;
            }

            if((this.detect.distanceX != 0) && duration < 200){
                if(this.options.momentum){
                    var scope = this;
                    var delay = this.detect.isMobile ? 50 : 200;
                    momentumX = this._utils._momentum(this.detect.x, this.detect.startX, duration, this.detect.maxScrollX, this.detect.wrapperWidth);

                    this.detect.isInTransition = true;

                    this._transitionTime(this.scroller, momentumX.duration);
                    this._translate(this.scroller, momentumX.destination);

                    if(this.options.snap){
                        this._snap('round');
                    }

                    function resetPosition(){
                        scope._resetPosition(scope.detect.bounceTime);
                    }

                    setTimeout(resetPosition, momentumX.duration + delay);

                }else{
                    if(this.options.snap){
                        var query = this.detect.directionX == 1 ? 'ceil' : 'floor';
                        this._snap(query);
                        this._resetPosition(this.detect.bounceTime);
                    }
                }
            }else{

                if(this.options.snap){
                    this._snap('round');
                    this._resetPosition(this.detect.bounceTime);
                }
            }
        },

        _snap:function(query){
            var itemWidth = this.scroller.find(this.options.item)[0].offsetWidth,
                x = Math[query](Math.abs(this.detect.x / itemWidth)) * itemWidth;
            this.detect.snapId = Math.round(Math.abs(this.detect.x / itemWidth));
            this._scrollTo(this.scroller, -x, this.detect.bounceTime / 2);
        },

        _initFlick:function(num, updateItem){
            if(this.options.start != 0){
                this.detect.flickCount = this.options.start;
            }
            this._updateFlickList();
            this._appendFlickData(this.detect.flickCount);
            this._setFlickPosition();

            if(this.detect.flickList.length == 1){
                return;
            }

            if(this.options.indicator){
                this._setFlickControl();
            }

            if(this.options.navi){
                this._naviMove(this.detect.flickCount);
                this._initNavi();
            }

            if(this.options.autoPlay){
                this._autoPlay(this.options.playSpeed);
            }

        },

        _updateFlickList:function(num, updateItem){
            var scope = this;

            if(this.detect.flickList.length == 0){

                scope.scroller.children().each(function(){
                    scope.detect.flickList.push($(this).children());
                    $(this).detach();
                });
                return;
            }

            if(updateItem.length > 0){
                scope.detect.flickList[num] = updateItem;
            }
        },

        _appendFlickData:function(num){
            var contents,
                className = this.options.flickPanelName.substr(1);

            if(this.options.ui == 'card'){

                if(!this.detect.flickEnabled){
                    this.detect.flickEnabled = true;

                    contents = '<div class="' + className + ' current"></div>';
                    contents += '<div class="' + className + ' right"></div>';
                    contents += '<div class="' + className + ' rightnext"></div>';
                    contents += '<div class="' + className + ' left"></div>';
                    contents += '<div class="' + className + ' leftprev"></div>';

                    this.scroller.append(contents);
                    this.detect.flickPositionNumber = this._utils._flickMapList(num, this.detect.flickList.length);

                }else{
                    this._updateFlickList(this.detect.flickPositionNumber.current, this.scroller.find('>.current').children());
                    this.scroller.find(">.current." + className).children().detach();
                    this.scroller.find(">.left." + className).children().remove();
                    this.scroller.find(">.leftprev." + className).children().remove();
                    this.scroller.find(">.right." + className).children().remove();
                    this.scroller.find(">.rightnext." + className).children().remove();

                    this.detect.flickPositionNumber = this._utils._flickMapList(num, this.detect.flickList.length);
                }
                $(this.scroller.find('>.current')).append(this.detect.flickList[this.detect.flickPositionNumber.current]);
                $(this.scroller.find('>.left')).append(this.detect.flickList[this.detect.flickPositionNumber.left].clone());
                $(this.scroller.find('>.leftprev')).append(this.detect.flickList[this.detect.flickPositionNumber.leftprev].clone());
                $(this.scroller.find('>.right')).append(this.detect.flickList[this.detect.flickPositionNumber.right].clone());
                $(this.scroller.find('>.rightnext')).append(this.detect.flickList[this.detect.flickPositionNumber.rightnext].clone());

                return;
            }

            if(!this.detect.flickEnabled){
                this.detect.flickEnabled = true;
                contents = '<div class="' + className + ' current"></div>';
                contents += '<div class="' + className + ' right"></div>';
                contents += '<div class="' + className + ' left"></div>';
                this.scroller.append(contents);
                this.detect.flickPositionNumber = this._utils._flickMapList(num, this.detect.flickList.length);
            }else{
                this._updateFlickList(this.detect.flickPositionNumber.current, this.scroller.find('> .current').children());
                this.scroller.find(">.current." + className).children().detach();
                this.scroller.find(">.left." + className).children().remove();
                this.scroller.find(">.right." + className).children().remove();
                this.detect.flickPositionNumber = this._utils._flickMapList(num, this.detect.flickList.length);
            }

            if(this.options.loop){
                $(this.scroller.find('> .current')).append(this.detect.flickList[this.detect.flickPositionNumber.current]);
                $(this.scroller.find('> .left')).append(this.detect.flickList[this.detect.flickPositionNumber.left].clone());
                $(this.scroller.find('> .right')).append(this.detect.flickList[this.detect.flickPositionNumber.right].clone());
            }else{
                if(this.detect.flickPositionNumber.current == 0){
                    this.scroller.find('> .current').append(this.detect.flickList[this.detect.flickPositionNumber.current]);
                    this.scroller.find('> .right').append(this.detect.flickList[this.detect.flickPositionNumber.right].clone());
                    this.scroller.find(">." + className + '.left').remove();
                    return;
                }
                if(this.detect.flickPositionNumber.current == this.detect.flickList.length - 1){
                    this.scroller.find('> .current').append(this.detect.flickList[this.detect.flickPositionNumber.current]);
                    this.scroller.find('> .left').append(this.detect.flickList[this.detect.flickPositionNumber.left].clone());
                    this.scroller.find(">." + className + '.right').remove();
                    return;
                }
                if(this.scroller.find('> .left').length < 1){
                    this.scroller.append('<div class="' + className + ' left"></div>');
                }
                if(this.scroller.find('> .right').length < 1){
                    this.scroller.append('<div class="' + className + ' right"></div>');
                }
                this.scroller.find('> .current').append(this.detect.flickList[this.detect.flickPositionNumber.current]);
                this.scroller.find('> .left').append(this.detect.flickList[this.detect.flickPositionNumber.left].clone());
                this.scroller.find('> .right').append(this.detect.flickList[this.detect.flickPositionNumber.right].clone());
            }
        },

        _setFlickPosition:function(){
            if(this.options.ui == 'card'){
                var cardWidth = this.scroller.find('> .current').outerWidth();

                this.scroller.find('> .current').css({
                    'left':'50%',
                    'margin-left':-(cardWidth / 2)
                });

                this.scroller.find('> .right').css({
                    'left':'50%',
                    'margin-left':cardWidth / 2
                });
                this.scroller.find('> .rightnext').css({
                    'left':'50%',
                    'margin-left':(cardWidth / 2) + cardWidth
                });

                this.scroller.find('> .left').css({
                    'left':'50%',
                    'margin-left':-(cardWidth + (cardWidth / 2))
                });

                this.scroller.find('> .leftprev').css({
                    'left':'50%',
                    'margin-left':-(cardWidth + (cardWidth / 2) + cardWidth)
                });
                return;
            }

            this.scroller.find('> .current').css('left', '0');
            this.scroller.find('> .right').css('left', +this.detect.flickSize + 'px');
            this.scroller.find('> .left').css('left', -this.detect.flickSize + 'px');
        },

        _flick:function(distX){
            var scope = this,
                direction,
                check = 50,
                count,
                speed = 300;

            if(!this.options.loop){
                if((this.detect.flickCount == 0) && ((distX == 'left') || distX > check)){
                    this._resetPosition(this.detect.bounceTime);
                    return;
                }
                if(this.detect.flickCount == (this.detect.flickList.length - 1) && ( (distX == 'right') || distX < -check)){
                    this._resetPosition(this.detect.bounceTime);
                    return;
                }
            }

            if(distX == 'left' || distX > check){
                direction = (this.options.ui == 'card') ? this.scroller.find('.current').outerWidth() : this.detect.wrapperWidth;
                count = +1;

            }else if(distX == 'right' || distX < -check){
                direction = (this.options.ui == 'card') ? -this.scroller.find('.current').outerWidth() : -this.detect.wrapperWidth;
                count = -1;
            }else if(!this.detect.isInflick){
                this._resetPosition(this.detect.bounceTime);
                return;
            }

            if(this.detect.isInflick){
                return;
            }

            this.detect.isInflick = true;

            this._scrollTo(this.scroller.find('>' + this.options.flickPanelName), direction, speed);

            this.detect.flickCount = this.detect.flickCount - count;
            this.detect.flickCount = this.detect.flickCount < 0 ? this.detect.flickCount = this.detect.flickList.length - 1 : this.detect.flickCount > this.detect.flickList.length - 1 ? this.detect.flickCount = 0 : this.detect.flickCount;

            if(this.options.navi){
                this._naviMove(this.detect.flickCount);
            }

            if(this.options.indicator){
                this._indicator(this.detect.flickCount);
            }

            function func(){
                scope._flickCallback();
            }

            setTimeout(func, speed);
        },

        _flickCallback:function(){
            this.detect.isInflick = false;
            this._appendFlickData(this.detect.flickCount);
            this._transitionTime(this.scroller.find('>' + this.options.flickPanelName));
            this._translate(this.scroller.find('>' + this.options.flickPanelName), 0);
            this._setFlickPosition();

            if(this.options.callback){
                this.options.callback();
            }
        },

        _setFlickControl:function(){
            var length = this.detect.flickList.length,
                indicator = '',
                button = '',
                html = '';

            if(this.options.indicatorType == 'dot'){
                for(var i = 0; i < length; i++){
                    indicator = indicator + '<li>' + (i + 1) + '</li>'
                }
                html = '<div class="indicator"><ul>' + indicator + '</ul></div>';
            }

            if(this.options.indicatorType == 'number'){
                html = '<div class="indicator"><span class="cur">' + (this.detect.flickCount + 1) + '</span> / <span class="all">' + length + '</span></div>';
            }

            this.wrapper.append(html);

            if(this.options.indicator){
                this._indicator(this.detect.flickCount);
            }

            if(this.options.control){
                var scope = this;

                button += '<button type="button" class="prev">prev</button>';
                button += '<button type="button" class="next">next</button>';
                this.wrapper.find('> .indicator').prepend(button);

                this.wrapper.find('.prev').on('click', function(){
                    scope._flick('left');
                });

                this.wrapper.find('.next').on('click', function(){
                    scope._flick('right');
                });
            }
        },

        _autoPlay:function(speed){
            var scope = this,
                play;

            function interval(){
                scope._flick('right');
            }

            play = setInterval(interval, speed);

            if(this.detect.isMobile){
                this.wrapper.on('touchstart', function(){
                    clearInterval(play);
                });

                this.wrapper.on('touchend', function(){
                    play = setInterval(interval, speed);
                });
            }else{
                this.wrapper.hover(function(){
                    clearInterval(play);
                }, function(){
                    play = setInterval(interval, speed);
                });
            }
        },

        _initNavi:function(){
            var scope = this;
            var wrapper = $(this.options.navi.wrapper),
                scroller = wrapper.children().eq(0),
                data = wrapper.data()[pluginName];

            data.detect.naviTarget = this;

            scroller.find(data.options.item).find('a').on('click', function(e){
                e.preventDefault();
                var buttonID = $(this)[0].hash.split("#")[1];
                var index = 0;

                for(var i = 0; i < scope.detect.flickList.length; i++){
                    if(scope.detect.flickList[i][0].id == buttonID){
                        index = i;
                    }
                }
                scope.detect.flickCount = index;
                scope._appendFlickData.call(scope, scope.detect.flickCount);
                $(this).parent().addClass('selected').add().siblings().removeClass('selected');
                data._startPosition();
                scope._indicator(scope.detect.flickCount);
            });
        },

        _naviMove:function(num){
            num = num || 0;

            var wrapper = $(this.options.navi.wrapper),
                scroller = wrapper.children().eq(0),
                target = wrapper.find(this.options.navi.onTarget),
                x,
                scope = this,
                time = 300,
                data = wrapper.data()[pluginName];

            $(target.selector + '.selected').removeClass('selected');
            target.eq(num).addClass('selected');

            x = this._utils._scrollMoveValue(data.detect.itemRightPositon[num - 2], data.detect.maxScrollX);

            if(!data.detect.hasHorizontalScroll){
                return;
            }

            this._transitionTimingFunction(scroller);
            this._transitionTime(scroller, time);
            this._translate(scroller, x);

            function func(){
                scope._transitionTime(scroller);
            }

            setTimeout(func, 300);
        },

        _indicator:function(num){

            var indicator = this.wrapper.find('>.indicator');

            if(this.options.indicatorType == 'number'){
                indicator.find('.cur').html(this.detect.flickCount + 1);
                return;
            }

            indicator.find('ul li.on').removeClass('on');
            indicator.find('ul li').eq(num).addClass('on');
        },

        _scrollTo:function(target, x, time, func){
            func = func || 'cubic-bezier(0.1, 0.54, 0.4, 1)';
            this.detect.isInTransition = time > 0;
            this._transitionTimingFunction(target, func);
            this._transitionTime(target, time);
            this._translate(target, x);
        },

        _transitionTime:function(target, time){
            time = time || 0;
            target.css(this._utils._style.transitionDuration, time + "ms");
        },

        _transitionTimingFunction:function(target, easing){
            target.css(this._utils._style.transitionTimingFunction, easing);
        },

        _translate:function(target, x){
            target.css(this._utils._style.transform, 'translate3d(' + x + 'px, 0, 0)');
            this.detect.x = x;
        },

        _transitionEnd:function(){
            var moveTarget = (this.options.ui == "flick" || this.options.ui == "card") ? this.scroller.find('>' + this.options.flickPanelName) : this.scroller;
            this._transitionTime(moveTarget);
            this.detect.isInTransition = false;
        },

        _getComputedPosition:function(target){
            var matrix = window.getComputedStyle(target, null),
                x,
                y;
            matrix = matrix[this._utils._style.transform].split(')')[0].split(', ');
            x = +(matrix[12] || matrix[4]);
            y = +(matrix[13] || matrix[5]);
            return {
                x:x,
                y:y
            };
        },

        _resize:function(){
            this._refresh();

            if(this.options.ui == "flick" || this.options.ui == "card"){
                this._setFlickPosition(this.detect.flickCount);
            }

            if(!this.detect.hasHorizontalScroll){
                this._scrollTo(this.scroller, 0, 0);
            }else{
                if(this.options.navi){
                    this._naviMove(this.detect.flickCount);
                    return;
                }
                this._startPosition();
            }
        }
    };

    $.fn[pluginName] = function(param){
        return this.each(function(){
            var $this = $(this);
            var data = $this.data(pluginName);
            if(!data){
                $(this).data(pluginName, new Plugin($this, param));
            }
        });
    };

    $.fn[pluginName].constructor = Plugin;
}(window.jQuery));

(function($){
    var util = {
        addEvent:function(element, type, fn, scope){
            element.on(type, function(e){
                fn.call(scope, e);
            });
        }
    };

    function divide(obj, item){
        var length = obj.attr('data-size');
        item = item || 'li';
        if(!!length){
            obj.find(item).css({
                width:(100 / length) + '%'
            })
        }else{
            obj.find(item).css({
                width:(100 / obj.find(item).size()) + '%'
            })
        }
    }

    function SwitchButton(obj, options){
        options = options || {};
        this.options = $.extend({}, this.defaults, options);
        util.addEvent(obj, 'click.mobile.switchButton', this.switchAction, this);
        this._init(obj, {g:options.switchGroup, b:options.switchBtn});
    }

    SwitchButton.prototype = {
        defaults:{
            switchBtn:null,
            switchGroup:null,
            toggle:true,
            callback:null
        },
        _init:function(obj, expand){
            if(obj.attr('data-toggle') == 'false'){
                this.options.toggle = false;
            }
            if(obj.attr('data-switch')){
                this.options.switchBtn = '[data-switch="' + obj.attr('data-switch') + '"]';
                this.options.switchGroup = $('[data-switch-name="' + obj.attr('data-switch') + '"]');
            }else{
                this.options.switchBtn = expand.b;
                this.options.switchGroup = expand.g;
            }
            if(obj.attr('data-checked') == 'checked'){
                obj.trigger('click');
            }
        },
        switchAllOff:function(){
            $(this.options.switchBtn).removeClass('active');
            this.options.switchGroup.removeClass('active');
        },
        switchOn:function(target){
            $(target).addClass('active');
            $(target.hash).addClass('active');
        },
        switchOff:function(target){
            $(target).removeClass('active');
            $(target.hash).removeClass('active');
        },
        switchAction:function(e){
            e.preventDefault();
            if($(e.target).hasClass('active') && !this.options.toggle){
                return;
            }
            if($(e.target).hasClass('active')){
                this.switchOff(e.target);
            }else{
                this.switchAllOff(e.target);
                this.switchOn(e.target);
            }
            if(this.options.callback){
                this.options.callback();
            }
        }
    };
    SwitchButton.prototype.constructor = SwitchButton;

    $(document).on('click', '.text-box .toggle-02', function(){
        $(this).toggleClass('active');
        $(this).closest('.text-box').find('.text').toggleClass('active')
    });

    $(document).ready(function(){
        $('[class*="input-type-text"]').each(function(){
            var input = $(this).find('input[type="text"]');
            input.after('<button class="del">입력초기화</button>');

            input.on('input', function(){
                if($.trim(input.val()).length > 0){
                    $(this).parent().addClass('active');
                }else{
                    $(this).parent().removeClass('active');
                }
            });
        });
        $(document).on('click', '.del', function(){
            $(this).prev('input').val('');
            $(this).parent().removeClass('active')
        });

        //range init
        $('.input-type-range').each(function(){
            var input = $(this).find('input');
            $(this).append('<i class="bar"></i>');
            $(this).append('<i class="min"><span class="sr-only">최소값:</span>' + input.attr('data-text-min') + '</i>');
            $(this).append('<i class="middle"><span class="sr-only">중간값:</span>' + input.attr('data-text-middle') + '</i>');
            $(this).append('<i class="max"><span class="sr-only">최대값:</span>' + input.attr('data-text-max') + '</i>');

            $(document).on('input', 'input[type="range"]', function(){
                $(this).closest('.input-type-range').find('.bar').css({
                    width:($(this).val() / $(this).attr('max') * 100) + '%'
                });

                $($('[data-range="' + $(this).attr('data-for') + '"]')).val($(this).val());
            });

            if(input.val() > 0){
                input.trigger('input');
            }
        });

        //reset tab link width
        $('[class*="tab-link"]').each(function(){
            divide($(this));
        });

        //flag
        $(document).on('change', '[data-flag]', function(){
            $(this).attr('data-flag', $(this).val());
        });

        //tab
        $(document).on('click', '.tab a', function(e){
            e.preventDefault();
            $(this).parent().parent().find('li').removeClass('active');
            $(this).parent().addClass('active');
        });

        //switch button;
        $('[data-switch]').each(function(){
            new SwitchButton($(this));
        });

        //gnb
        $('.btn-depth-01').each(function(){
            new SwitchButton($(this), {
                switchBtn:'.btn-depth-01',
                switchGroup:$('.depth-02'),
                toggle:false
            });
        });
        $('.btn-depth-02').each(function(){
            new SwitchButton($(this), {
                switchBtn:'.btn-depth-02',
                switchGroup:$('.btn-depth-02').next(),
                toggle:true
            });
        });

        //event tab
        $('.tab-type-02').each(function(){
            $(this).find('ul').removeClass().addClass("length-" + $(this).find("li").size());
        });


        new SwitchButton($('.page-navi-opener'), {
            switchBtn:'.page-navi-opener',
            switchGroup:$('#page-navi'),
            toggle:true,
            callback:function(){
                $('body, html').toggleClass('page-navi-open');
                $('#page-navi').focus();
            }
        });

        $(document).on('click', '.gnb-opener', function(e){
            e.preventDefault();
            $('body, html').addClass('gnb-open');
            $('#gnb').addClass('open');
        });
        $(document).on('click', '.btn-close-gnb', function(e){
            e.preventDefault();
            $('#gnb').removeClass('open');
        });

        $('#gnb').on('transitionend', function(){
            if(!$('#gnb').hasClass('open')){
                $('body, html').removeClass('gnb-open');
            }
        });

        $('[class*="gallery-"]').horizontalBox({
            item:'.flick-panel',
            ui:'flick',
            indicator:true
        });

        $('[class*="main-visual-"]').horizontalBox({
            item:'.flick-panel',
            ui:'flick',
            indicator:true,
            control:true
        });

        $('.ecrm-slide').horizontalBox({
            item:'.flick-panel',
            ui:'flick',
            indicator:true,
            control:false
        });

        //pro-card 금융상품몰 카드
        $(document).on('click', '.pro-card dl dt', function(e){
            e.preventDefault();
            $(this).toggleClass('on');
        });
    });
}(window.jQuery));

/**
 * 사랑나눔 모바일
 */
KNBUI.bld = (function($){
    function objLayout(){
        var source,
            $container,
            template;

        function appendItem(item){
            $container.append(item).masonry('appended', item);

            item.imagesLoaded(function(){
                $container.masonry();
            });
        }

        function more(data){
            for(var i = 0, max = data.length; i < max; i++){
                appendItem($(template(data[i])));
            }
        }

        $(document).ready(function(){
            if($('.mgall-list').size() < 1){
                return;
            }

            source = $("#obj-template").html();
            template = Handlebars.compile(source);
            $container = $('.mgall-list').masonry({
                columnWidth:'.columnWidth',
                itemSelector:'.mgall-list .obj',
                percentPosition:true
            });
        });

        return {
            more:more
        }
    }

    $(document).ready(function(){
        $('.contents-navi').horizontalBox({
            item:'ul li'
        });

        $('.scroll-navi').horizontalBox({
            item:'ul li'
        });
    });

    return {
        objLayout:objLayout()
    }
}(window.jQuery));