if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Main
 * ===================================*/
define([
		"PPDevice",
		"TestObject"
    ]
	, function (PPDevice, TestObject)
    {
	    // DEVICE
	    var canvas = document.getElementById("glcanvas");
	    var device = new PPDevice(canvas);
	    window.device = device;

	    var wrapper = document.getElementById("canvas-wrapper");
	    canvas.width = wrapper.clientWidth;
	    canvas.height = wrapper.clientHeight;

		// CRAPPY IMAGE PRELOAD
	    var crateImage = new Image();
	    crateImage.onload = function() {
		    var asciiRampImage = new Image();
		    asciiRampImage.onload = function() {

			    device.load();
			    var testObject = new TestObject();
			    testObject.load();
			    device.addGameObject(testObject);
			    device.start();

		    };
		    asciiRampImage.src = "images/ascii_ramp.png";
		    window.asciiRampImage = asciiRampImage;
	    };
	    crateImage.src = "images/crate.gif";
	    window.crateImage = crateImage;



	});