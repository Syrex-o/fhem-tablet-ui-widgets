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
	var startX, startY, endX, endY;
	function handleTouch(elem, reactor, change, startX, endX, startY, endY, cbL, cbR, cbU, cbD, target){
	  	var xDist = endX - startX;
	  	var yDist = endY - startY;
	  	if(endX - startX < 0 && xDist < -elem.data("swipeX")){
	  	   cbL(target, reactor, change, elem);
	  	}else if(endX - startX > 0 && xDist > elem.data("swipeX")){
	  	   cbR(target, reactor, change, elem);
	    }
	    if(endY - startY < 0 && yDist < -elem.data("swipeY")){
	    	cbU(target, reactor, change, elem);
	    }else if(endY - startY > 0 && yDist > elem.data("swipeY")){
	    	cbD(target, reactor, change, elem);
	    }
	}
	function validator(elem, x){
		if(x === true){
			if (elem.find("data-opendirX").context.dataset.opendirx){
		  		return elem.find("data-opendirX").context.dataset.opendirx;
		  	}
		  	else{
		  		return elem.data("opendirX");
		 	}
		}
		else{
			if (elem.find("data-opendirY").context.dataset.opendirx){
		  		return elem.find("data-opendirY").context.dataset.opendirx;
		  	}
		  	else{
		  		return elem.data("opendirY");
		 	}
		}
	}
	var left = function(target, reactor, change, elem){
		if (validator(elem, true) === "right"){
			if($(""+ reactor +"").hasClass(change)){
				target.trigger("click");
			}
			else{
				return;
			}
		}
		else{
			if($(""+ reactor +"").hasClass(change)){
				return;
			}
			else{
				target.trigger("click");
			}
		}
	}
	var right = function(target, reactor, change, elem){
		if(validator(elem, true) === "right"){
			if($(""+ reactor +"").hasClass(change)){
				return;
			}
			else{
				target.trigger("click");
			}
		}
		else{
			if($(""+ reactor +"").hasClass(change)){
				target.trigger("click");
			}
			else{
				return;
			}
		}
	}
	var up = function(target, reactor, change, elem){
	}
	var down = function(target, reactor, change, elem){
	}
	function init_attr(elem){
		elem.initData("device", "");
		elem.initData("get", "STATE");
		elem.initData("reactor", 'html');
		elem.initData("change", "slideout-open");
		elem.initData('target', '#slideout');
		elem.initData('opendirX', "right");
		elem.initData('opendirY', "up");
		elem.initData("swipeX", $(window).innerWidth()/2.5);
		elem.initData("swipeY", $(window).innerHeight()/4);
		elem.css({"display": "none"});

	 	me.addReading(elem, 'get');

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
