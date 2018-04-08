/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, plugins:true, Modul_widget:true */

"use strict";

function depends_pinpad(){
	 $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/pinpad.css" type="text/css" />');
}

var Modul_pinpad = function(){

	function init_attr(elem){
		elem.initData('device', ' ');
	    elem.initData('get-pin', 'pin');
	    elem.initData("get", "state");
	    elem.initData("width", "300px");
	    elem.initData("height", "450px");
	    elem.initData("icon", "fa-key");
	    elem.initData("set", "");

	    //customitable colors
	    elem.initData("locked-color", "#c60000");
	    elem.initData("unlocked-color", "#56e20b");
	    elem.initData("button-color", "white");
	    elem.initData("bg-color", "#565656");
	    elem.initData("shadow-color", "rgba(0,0,0,.3)");
	    elem.initData("pin-off-color", "grey");
	    elem.initData("pin-on-color", "#cccccc");
	    elem.initData("text-unlocked", "Unlocked");
	    elem.initData("text-locked", "Locked");
	    elem.initData("locked-time", "10");
	    elem.initData("tries", "5");
	    elem.initData("btn-size", "70px");
	    elem.initData("font-size", "40px");
	    elem.initData("spacing", "10px");
	    elem.initData("text-blocked", "Locked for: ");


	    // subscripe my readings for updating
	    me.addReading(elem, 'get-pin');
	    me.addReading(elem, "get");
	}

	function init_ui(elem){
		var pad = $("<div></div>", {
			id: "pinpad",
		}).css({
			background: elem.data("bg-color"),
			boxShadow: "4px 4px 8px "+ elem.data("shadow-color") +"",
			width: elem.data("width"),
			height: elem.data("height")
		}).appendTo(elem);

		var input = $("<div></div>", {
			id: "input-pinpad",
		}).appendTo(pad);

		var message = $("<p></p>", {
			id: "pinpad-text",
		}).appendTo(pad);

		var btns = $("<div></div>", {
			id: "pinpad-btns",
		}).appendTo(pad);

		for (var i = 1; i < 10; i++){
			var nums = $("<div>"+ i +"</div>", {
				id: i,
			}).attr({
				class: "number-pinpad num-click",
			
			}).appendTo(btns);
		}
		//creating last Line
		var back = $("<div></div>", {
			id: "back",
		}).attr({
			class: "fa fa-angle-left number-pinpad",
		}).appendTo(btns);

		var zero = $("<div>0</div>", {
			id: "zero",
		}).attr({
			class: "number-pinpad num-click",
		}).appendTo(btns);

		var key = $("<div></div>", {
			id: "key-pinpad",
		}).attr({
			class: "fa "+ elem.data("icon") +" number-pinpad",
		}).appendTo(btns);
	}

	function init_events(elem){
		function updateDot(elem, pin){
        	$("#input-pinpad").html(pin);
        }

		var falseCounter = 0;
		function startTimer(){
			$(".number-pinpad, .num-click").css({
				"pointer-events": "none"
			});
			var counter = elem.data("locked-time");
			var timer = setInterval(function(){
				counter --;
				if(counter >= 0){
					$("#pinpad-text").html(elem.data("text-blocked")+ counter+"s");
				}

				if (counter <= 0){
					$("#pinpad-text").html(elem.data("text-locked"));
					$(".number-pinpad").css({
						"pointer-events": "auto"
					});
					falseCounter = 0;
					clearInterval(timer);
				}
			}, 1000);
		}
		//click events
		var insertedPin = ""
		var counter = 0;
		$(".num-click").on("click", function(){
			var num = $(this).index() + 1;
			if (num === 11){
				num = 0;
			}
			insertedPin += num;
			counter++;
			if (elem.hasClass("show-pin")){
				updateDot(elem, insertedPin);
			}
			else{
				$(".dots-pinpad:nth-child("+ counter +")").css({
					"background": elem.data("pin-on-color"),
					"transition": "all .5s cubic-bezier(0,1,.5,1)",
					"transform": "scale(1)"
				});
			}
			if (counter === elem.getReading("get-pin").val.length){
				if(insertedPin === elem.getReading("get-pin").val){
					falseCounter = 0;
					ftui.setFhemStatus("set "+ elem.data("device") +" "+ elem.data("set") +" off");
					$("#pinpad-text").css({
						"color": elem.data("unlocked-color")
					});
				}
				else{
					falseCounter += 1;
					$("#input-pinpad").addClass("shake-false-pin");
					setTimeout(function(){
						$("#input-pinpad").removeClass("shake-false-pin");
					}, 500);
					if (falseCounter == elem.data("tries")) {
						startTimer();
					}
				}
				insertedPin = "";
				if(elem.hasClass("show-pin")){
					setTimeout(function(){
						$("#input-pinpad").html("");
					}, 500);
				}
				counter = 0;
				setTimeout(function(){
					$(".dots-pinpad").css({
						"background": elem.data("pin-off-color"),
						"transition": "all .5s cubic-bezier(0,1,.5,1)",
						"transform": "scale(.7)"
					});
				}, 500);
			}
		});
		$("#back").on("click", function(){
            insertedPin = insertedPin.substring(0, insertedPin.length -1);
            if(elem.hasClass("show-pin")){
            	updateDot(elem, insertedPin);
            }
            else{
            	$(".dots-pinpad:nth-child("+ counter +")").css({
					"background": elem.data("pin-off-color"),
					"transition": "all .5s cubic-bezier(0,1,.5,1)",
					"transform": "scale(.7)"
				});
            }
			counter--;
			if (counter <= 0){
				counter = 0;
			}
        });
	}

	function init_styling(elem){
		var slice = parseInt(elem.data("btn-size")) * (- 0.2) + "px";
		if (elem.hasClass("squared")){
			$("#key-pinpad, #back").css({
				"border-radius": "auto"
			});
			$(".number-pinpad").css({
				"border-radius": "auto"
			});
		}
		else {
			$("#key-pinpad, #back").css({
				"border-radius": elem.data("btn-size")
			});
			$(".number-pinpad").css({
				"border-radius": elem.data("btn-size")
			});
		}
		$("#key-pinpad, #back").css({
			"color": elem.data("button-color"),
			"border": "2px solid "+ elem.data("button-color") +"",
			"width": elem.data("btn-size"),
			"height": elem.data("btn-size"),
			"line-height": "150%",
			"font-size": elem.data("font-size")
		});
		$(".number-pinpad").css({
			"color": elem.data("button-color"),
			"border": "2px solid "+ elem.data("button-color") +"",
			"height": elem.data("btn-size"),
			"width": elem.data("btn-size"),
			"line-height": parseInt(elem.data("btn-size")) * (- 10),
			"font-size": elem.data("font-size")
		});
	}
	function init_dots(elem, length){
		// creating dots in pinpad
		if (elem.hasClass("show-pin")){
			$("#input-pinpad").css({
				"color": elem.data("button-color"),
				"line-height": elem.data("btn-size"),
				"font-size": elem.data("font-size"),
				"letter-spacing": elem.data("spacing")
			});
		}
		else{
			for(var j= 0; j < length; j++){
				var dots = $("<div></div>",{
					id: "dot" + j,
				}).attr({
					class: "dots-pinpad",
				}).css({
					"background": elem.data("pin-off-color")
				}).appendTo($("#input-pinpad"));
			}
		}
	}

	function update(dev, par) {

        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading("get");
                if (elem.hasClass("pop")){
                	if (value.val === "off"){
                		$("#pinpad").css({
                			"position": "absolute",
                			"transform": "translate(0, -100%)",
                			"opacity": "0"
                		});
                	}
                	if (value.val === "on"){
                		$("#pinpad").css({
                			"position": "relative",
                			"transform": "translate(0, 0%)",
                			"opacity": "1"
                		})
                	}
                }
                if(value.val === "off"){
                	$("#key-pinpad").on("click", function(){
						ftui.setFhemStatus("set "+ elem.data("device") +" "+ elem.data("set") +" on");
					});
                	$("#pinpad-text").css({
                		"color": elem.data("unlocked-color")
                	});
                	$("#pinpad-text").html(elem.data("text-unlocked"));
                }
                else{
                	$("#pinpad-text").css({
                		"color": elem.data("locked-color")
                	});
                	$("#pinpad-text").html(elem.data("text-locked"));
                }
                if (ftui.isValid(value)){
                	init_events(elem);
                	init_styling(elem);
                }
            });
            me.elements.filterDeviceReading('get-pin', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading("get-pin").val;
                var once = (function(){
               		var executed = false;
               		return function(){
               			if(!executed){
               				executed = true;
               				var length = elem.getReading("get-pin").val.length;
               				init_dots(elem, length);
                		}
                	};
                })();
                if (ftui.isValid(value)){
                	once();
                }
            });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'pinpad',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};
