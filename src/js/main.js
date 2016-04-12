if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Main
 * ===================================*/
define([
		"PPDevice",
		"engine/Camera",
		"MobileBox",
		"PlayerController"
    ]
	, function (PPDevice, Camera, MobileBox, PlayerController)
    {
	    var canvas = document.getElementById("glcanvas");

	    // GLOBAL
	    window.device = new PPDevice(canvas);
	    window.camera = new Camera();
	    window.defaultTexture = new Image();
	    window.groundTexture = new Image();


	    var wrapper = document.getElementById("canvas-wrapper");
	    canvas.width = wrapper.clientWidth;
	    canvas.height = wrapper.clientHeight;

	    // GUI
	    /*var gui = new dat.GUI();
	    var f1 = gui.addFolder('Post-processing');
	    f1.add(device, "asciify");
	    f1.addColor(device, "asciiTint");
	    f1.add(device, "crt");
	    f1.open();
	    gui.close();*/


	    /*for (var x = -2; x < 3; ++x)
	    for (var y = -2; y < 3; ++y)
	    for (var z = -2; z < 3; ++z)
	    {
		    var box = new Box(x * 2.0, y * 2.0, z * 2.0, 1.0, 1.0, 1.0);
		    box.load();
		    device.addGameObject(box);
	    }*/

		// CRAPPY IMAGE PRELOAD
	    defaultTexture.onload = function() {
		groundTexture.onload = function() {

		    device.load();
		    camera.set(45.0, device.width / device.height, 0.1, 100.0);
		    camera.setViewport(0.0, 0.0, device.width, device.height);
		    var m = mat4.create();
		    mat4.translate(m, m, [0.0, 0.0, 0.0]);
		    mat4.invert(m, m);
		    camera.setViewMatrix(m);

		    var box = new MobileBox([0.0, 0.5, 0.0], 1.0, [0.0, 0.0, 1.0, 1.0]);
		    box.load();
		    device.addGameObject(box);

		    var playerController = new PlayerController();
		    playerController.setTarget(box);
		    device.addGameObject(playerController);
		    device.start();

	    };
	    };
	    defaultTexture.src = "images/white16x16.png";
	    groundTexture.src = "images/ground.png";
	});