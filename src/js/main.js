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
	    FileUtils.loadFile("shaders/basic_vs.glsl", false, function(response)
	    {
			defaultVs = new Shader(gl, Shader.VERTEX_SHADER, response);
	    });

	    var defaultFs = null;
	    FileUtils.loadFile("shaders/basic_fs.glsl", false, function(response)
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
/*
	    var rdr = device.renderer;
	    rdr.setMatrixMode(Renderer.MatrixMode.PROJECTION);
	    rdr.identity();
	    rdr.perspective(45, canvas.width / canvas.height, 0.1, 100.0);

	    var rCube = 0;
	    var lastTime = 0;

	    var img = new Image();
	    var cube = null;
	    img.onload = function()
	    {
		    var texture = new Texture(device.renderer.gl, img);

		    cube = new RenderContext(device.renderer.gl, device.renderer.gl.TRIANGLES,
			    [
				    // FRONT
				    -1.0, -1.0, 1.0,
				    1.0, -1.0, 1.0,
				    1.0, 1.0, 1.0,
				    -1.0, 1.0, 1.0,

				    // BACK
				    -1.0, -1.0, -1.0,
				    1.0, -1.0, -1.0,
				    1.0, 1.0, -1.0,
				    -1.0, 1.0, -1.0,

				    // TOP
				    -1.0, 1.0, -1.0,
				    1.0, 1.0, -1.0,
				    1.0, 1.0, 1.0,
				    -1.0, 1.0, 1.0,

				    // BOTTOM
				    -1.0, -1.0, -1.0,
				    1.0, -1.0, -1.0,
				    1.0, -1.0, 1.0,
				    -1.0, -1.0, 1.0,

				    // RIGHT
				    1.0, -1.0, -1.0,
				    1.0, 1.0, -1.0,
				    1.0, 1.0, 1.0,
				    1.0, -1.0, 1.0,

				    // LEFT
				    -1.0, -1.0, -1.0,
				    -1.0, 1.0, -1.0,
				    -1.0, 1.0, 1.0,
				    -1.0, -1.0, 1.0
			    ],
			    [
				    1.0, 0.0, 0.0, 1.0,
				    1.0, 0.0, 0.0, 1.0,
				    1.0, 0.0, 0.0, 1.0,
				    1.0, 0.0, 0.0, 1.0,

				    1.0, 1.0, 0.0, 1.0,
				    1.0, 1.0, 0.0, 1.0,
				    1.0, 1.0, 0.0, 1.0,
				    1.0, 1.0, 0.0, 1.0,

				    0.0, 1.0, 0.0, 1.0,
				    0.0, 1.0, 0.0, 1.0,
				    0.0, 1.0, 0.0, 1.0,
				    0.0, 1.0, 0.0, 1.0,

				    1.0, 0.5, 0.5, 1.0,
				    1.0, 0.5, 0.5, 1.0,
				    1.0, 0.5, 0.5, 1.0,
				    1.0, 0.5, 0.5, 1.0,

				    1.0, 0.0, 1.0, 1.0,
				    1.0, 0.0, 1.0, 1.0,
				    1.0, 0.0, 1.0, 1.0,
				    1.0, 0.0, 1.0, 1.0,

				    0.0, 0.0, 1.0, 1.0,
				    0.0, 0.0, 1.0, 1.0,
				    0.0, 0.0, 1.0, 1.0,
				    0.0, 0.0, 1.0, 1.0
			    ],
			    [
				    0, 1, 2, 0, 2, 3,
				    4, 5, 6, 4, 6, 7,
				    8, 9, 10, 8, 10, 11,
				    12, 13, 14, 12, 14, 15,
				    16, 17, 18, 16, 18, 19,
				    20, 21, 22, 20, 22, 23
			    ],
			    texture,
			    [
				    // Front face
				    0.0, 0.0,
				    1.0, 0.0,
				    1.0, 1.0,
				    0.0, 1.0,

				    // Back face
				    1.0, 0.0,
				    1.0, 1.0,
				    0.0, 1.0,
				    0.0, 0.0,

				    // Top face
				    0.0, 1.0,
				    0.0, 0.0,
				    1.0, 0.0,
				    1.0, 1.0,

				    // Bottom face
				    1.0, 1.0,
				    0.0, 1.0,
				    0.0, 0.0,
				    1.0, 0.0,

				    // Right face
				    1.0, 0.0,
				    1.0, 1.0,
				    0.0, 1.0,
				    0.0, 0.0,

				    // Left face
				    0.0, 0.0,
				    1.0, 0.0,
				    1.0, 1.0,
				    0.0, 1.0
			    ]
		    );

		    device.start();
	    };
	    img.src = "images/crate.gif";

	    device.update = function()
	    {
		    var timeNow = new Date().getTime();
		    if (lastTime != 0) {
			    var elapsed = timeNow - lastTime;

			    rCube -= (75 * elapsed) / 1000.0;
		    }
		    lastTime = timeNow;
	    };

	    device.draw = function()
	    {
		    rdr.setMatrixMode(Renderer.MatrixMode.MODELVIEW);
		    rdr.identity();
		    rdr.translate(0.0, 0.0, -7.0);
		    rdr.rotate(Utils.degToRad(rCube), [1, 1, 1]);
		    mat4.translate(3.0, 0.0, 0.0);
		    rdr.draw(cube);
	    };*/

	});