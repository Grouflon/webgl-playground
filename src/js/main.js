if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Main
 * ===================================*/
define([
		"PPDevice",
		"LandscapeController",
		"Observer"
    ]
	, function (PPDevice, LandscapeController, Observer)
    {
	    // DEVICE
	    var canvas = document.getElementById("glcanvas");
	    var device = new PPDevice(canvas);
	    window.device = device;

	    var wrapper = document.getElementById("canvas-wrapper");
	    canvas.width = wrapper.clientWidth;
	    canvas.height = wrapper.clientHeight;

	    // GUI
	    var gui = new dat.GUI();
	    gui.add(device, "asciify");
	    gui.add(device, "crt");

		// CRAPPY IMAGE PRELOAD
	    var crateImage = new Image();
	    crateImage.onload = function() {
		    var asciiRampImage = new Image();
		    asciiRampImage.onload = function() {

			    device.load();

			    var observer = new Observer(0.0, 0.0, 7.0);
			    observer.load();
			    device.addGameObject(observer);
			    window.observer = observer;

			    var lc = new LandscapeController();
			    lc.load();
			    device.addGameObject(lc);

			    device.start();

		    };
		    asciiRampImage.src = "images/ascii_ramp.png";
		    window.asciiRampImage = asciiRampImage;
	    };
	    crateImage.src = "images/crate.gif";
	    window.crateImage = crateImage;



	});