/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, plugins:true, Modul_widget:true */

"use strict";

function depends_swipeevent(){
	return [ftui.config.basedir + "lib/jquery-ui.min.js"];
}

var Modul_swipeevent = function(){
	var startX
	var startY
	var endX
	var endY
	var treshold = 250;
	function handleTouch(elem, reactor, change, startX, endX, startY, endY, cbL, cbR, cbU, cbD, target){
	  	var xDist = endX - startX;
	  	var yDist = endY - startY;
	  	if(endX - startX < 0 && xDist < -elem.data("swipeX")){
	  	   cbL(target, reactor, change);
	  	}else if(endX - startX > 0 && xDist > elem.data("swipeX")){
	  	   cbR(target, reactor, change);
	    }
	    if(endY - startY < 0 && yDist < -elem.data("swipeY")){
	    	cbU(target, reactor, change);
	    }else{
	    	cbD(target, reactor, change);
	    }
	}
	var left = function(target, reactor, change){
		if($(""+ reactor +"").hasClass(change)){
			target.trigger("click");
		}
		else{
			return;
		}
	}
	var right = function(target, reactor, change){
		if($(""+ reactor +"").hasClass(change)){
			return;
		}
		else{
			target.trigger("click");
		}
	}
	var up = function(target, reactor, change){
	}
	var down = function(target, reactor, change){
	}

	function init_attr(elem){
		elem.initData("device", "");
		elem.initData("get", "STATE");
		elem.initData("reactor", 'html');
		elem.initData("change", "slideout-open");
		elem.initData('target', '#slideout');
		elem.initData("swipeX", $(window).innerWidth()/2.5);
		elem.initData("swipeY", $(window).innerHeight()/4);
		elem.css({"display": "none"});

	 	me.addReading(elem, 'get');
	 	me.addReading(elem, "target");

	 	window.addEventListener('touchstart', function(event){
	    	startX = event.touches[0].clientX;
	    	startY = event.touches[0].clientY;
	  	});
	   	window.addEventListener('touchend', function(event){
	   		endX = event.changedTouches[0].clientX;
	   		endY = event.changedTouches[0].clientY;
	   		var target = $(""+ elem.data("target") +"");
	   		var reactor = elem.data("reactor");
	   		var change = elem.data("change");
	   		handleTouch(elem, reactor, change, startX, endX, startY, endY, left, right, up, down, target);
	 	});
	}

	function update(dev, par) {
		me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.data('get');
                console.log(value);
            });
        me.elements.filterDeviceReading('target', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.data('target');
                console.log(value);
            });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'swipeevent',
        init_attr: init_attr,
        update: update,
    });

    return me;
};
