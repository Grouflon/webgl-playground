if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Main
 * ===================================*/
define([
		"engine/Device",
		"engine/Shader",
		"engine/ShaderProgram",
		"engine/Camera",
		"engine/utils/FileUtils",

		"TestObject"
    ]
	, function (Device, Shader, ShaderProgram, Camera, FileUtils, TestObject)
    {
	    // DEVICE
	    var canvas = document.getElementById("glcanvas");
	    var device = new Device(canvas);
	    window.device = device;
	    var gl = device.renderer.gl;

	    // SHADERS
	    var defaultVs = null;
	    FileUtils.loadFile("shaders/basic.vs", false, function(response)
	    {
			defaultVs = new Shader(gl, Shader.VERTEX_SHADER, response);
	    });

	    var defaultFs = null;
	    FileUtils.loadFile("shaders/basic.fs", false, function(response)
	    {
		    defaultFs = new Shader(gl, Shader.FRAGMENT_SHADER, response);
	    });
	    defaultVs.load();
	    defaultFs.load();
	    var defaultShaderProgram = new ShaderProgram(gl, defaultVs, defaultFs);
	    defaultShaderProgram.load();
	    window.defaultShaderPogram = defaultShaderProgram;

	    // CAMERA
		var defaultCamera = new Camera();
	    defaultCamera.setViewport(0, 0, canvas.width, canvas.height);
	    defaultCamera.set(45, canvas.width / canvas.height, 0.1, 100.0);
	    var view = mat4.create();
	    mat4.translate(view, view, [0, 0, 7.0]);
	    mat4.invert(view, view);
	    defaultCamera.setViewMatrix(view);
	    window.defaultCamera = defaultCamera;

		// IMAGES
	    var crateImage = new Image();
	    crateImage.loaded = false;
	    crateImage.onload = function() {

		    var testObject = new TestObject;
		    testObject.load();
		    device.addGameObject(testObject);
		    device.start();

	    };
	    crateImage.src = "images/crate.gif";
	    window.crateImage = crateImage;
	});