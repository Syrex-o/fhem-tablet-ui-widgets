/* FTUI Plugin

*/

function depends_pinpad(){
	 $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/pinpad.css" type="text/css" />');
}

var Modul_pinpad = function(){

	function init(){

		me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
		me.elements.each(function (index) {

			var insertedPin ="";

			function createPad(elem){

				var pad = $("<div></div>");
				pad.attr("id", "pinpad");
				pad.css({
					"background": elem.data("bg-color"),
					"box-shadow": "4px 4px 8px "+ elem.data("shadow-color") +"",
					"width": elem.data("width"),
					"height": elem.data("height")
				});
				elem.append(pad);

				var input = $("<div></div>");
				input.attr("id", "input-pinpad");
				pad.append(input);

				var key = $("<div></div>");
				key.attr("id", "key-pinpad");
				key.attr("class", "fa "+ elem.data("icon") +"");
				key.css({
					"color": elem.data("button-color"),
					"border": "2px solid "+ elem.data("button-color") +"",
					"width": elem.data("btn-size"),
					"height": elem.data("btn-size"),
					"border-radius": elem.data("btn-size"),
					"line-height": elem.data("btn-size"),
					"font-size": elem.data("font-size")
				});
				pad.append(key);

				var btns = $("<div></div>");
				btns.attr("id", "pinpad-btns");
				pad.append(btns);

				

				// creating numbers on pinpad
				for (var i = 1; i < 10; i++){
					var div = $("<div>"+ i +"</div>");
					div.attr("id", i);
					div.attr("class", "number-pinpad");
					btns.append(div);
				}
				$(".number-pinpad").css({
					"color": elem.data("button-color"),
					"border": "2px solid "+ elem.data("button-color") +"",
					"height": elem.data("btn-size"),
					"width": elem.data("btn-size"),
					"border-radius": elem.data("btn-size"),
					"line-height": elem.data("btn-size"),
					"font-size": elem.data("font-size")
				});

				// creating dots in pinpad
				for(var j= 0; j < 4; j++){
					var dots = $("<div></div>");
					dots.attr("id", "dot" + j);
					dots.attr("class", "dots-pinpad");
					dots.css({
						"background": elem.data("pin-off-color")
					});
					input.append(dots);
				}
			}

            var elem = $(this);
            //basic settings (customizable)
            elem.initData('device', ' ');
            elem.initData('get-pin', 'pin');
            elem.initData("get", "state");
            elem.initData("width", "300px");
            elem.initData("height", "450px");
            elem.data("icon", "fa-key");
            elem.data("set", "");

            //customitable colors
            elem.data("locked-color", "#c60000");
            elem.data("unlocked-color", "#56e20b");
            elem.data("button-color", "white");
            elem.data("bg-color", "#565656");
            elem.data("shadow-color", "rgba(0,0,0,.3)");
            elem.data("pin-off-color", "grey");
            elem.data("pin-on-color", "#cccccc");
            elem.data("text-unlocked", "Unlocked");
            elem.data("text-locked", "Locked");
            elem.data("locked-time", "10");
            elem.data("tries", "5");
            elem.data("btn-size", "70px");
            elem.data("font-size", "40px");


            // subscripe my readings for updating
            me.addReading(elem, 'get-pin');
            me.addReading(elem, "get");

            // creating the pinpad
            createPad(elem);

            var message = $("<p></p>");
			message.attr("id", "pinpad-text");
			$("#pinpad").append(message);
			if (elem.getReading("get").val === "off"){
				message.css({
					"color": elem.data("unlocked-color")
				});
			}
			else{
				message.css({
					"color": elem.data("locked-color")
				});
			}

			var falseCounter = 0;
			function startTimer(){
				$(".number-pinpad").css({
					"pointer-events": "none"
				});
				var counter = elem.data("locked-time");
				var timer = setInterval(function(){
					counter --;
					if(counter >= 0){
						$("#pinpad-text").html("Locked for: "+ counter);
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

            //pinpad click events
            var counter = 0;
			$(".number-pinpad").on("click", function(){
				var num = $(this).index() + 1;
				insertedPin += num;
				counter++;
				if (counter === 1){
					$(".dots-pinpad:nth-child(1)").css({
						"background": elem.data("pin-on-color"),
						"transition": "all .5s cubic-bezier(0,1,.5,1)",
						"transform": "scale(1)"
					});
				}
				if (counter === 2){
					$(".dots-pinpad:nth-child(2)").css({
						"background": elem.data("pin-on-color"),
						"transition": "all .5s cubic-bezier(0,1,.5,1)",
						"transform": "scale(1)"
					});
				}
				if (counter === 3){
					$(".dots-pinpad:nth-child(3)").css({
						"background": elem.data("pin-on-color"),
						"transition": "all .5s cubic-bezier(0,1,.5,1)",
						"transform": "scale(1)"
					});
				}
				if (counter >= 4){
					$(".dots-pinpad:nth-child(4)").css({
						"background": elem.data("pin-on-color"),
						"transition": "all .5s cubic-bezier(0,1,.5,1)",
						"transform": "scale(1)"
					});
					if(insertedPin === elem.getReading("get-pin").val) {
						falseCounter = 0;
						ftui.setFhemStatus("set "+ elem.data("device") +" "+ elem.data("set") +" off");
						message.css({
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
        });
	}
	function update(dev, par) {
        // do updates from reading for content
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading('get').val;
                if(value === "off"){
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
                
            });

        me.elements.filterDeviceReading('get-pin', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading('get-pin').val;
            });

    }

	var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'pinpad',
        init: init,
        update: update,
    });

    return me;
};
