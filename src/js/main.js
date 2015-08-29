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

	    // POST PROCESSING
		var postProcessingVs = null;
		FileUtils.loadFile("shaders/post_processing.vs", false, function(response)
		{
			postProcessingVs = new Shader(gl, Shader.VERTEX_SHADER, response);
		});

		var postProcessingFs = null;
		FileUtils.loadFile("shaders/post_processing.fs", false, function(response)
		{
			postProcessingFs = new Shader(gl, Shader.FRAGMENT_SHADER, response);
		});
		postProcessingVs.load();
		postProcessingFs.load();
		var ppShaderProgram = new ShaderProgram(gl, postProcessingVs, postProcessingFs);
		ppShaderProgram.load();
		var glPpShaderProgram = ppShaderProgram.glShaderProgram;
		gl.useProgram(glPpShaderProgram);
		gl.enableVertexAttribArray(gl.getAttribLocation(glPpShaderProgram, "aPosition"));
		var renderTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, renderTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		var frameBuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderTexture, 0);
	    var renderBuffer = gl.createRenderbuffer();
	    gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
	    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);
	    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
	    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	    var quadBuffer = gl.createBuffer();
		var quadVertices = [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1];
		gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVertices), gl.STATIC_DRAW);

		device.preDraw = function (gl) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
			gl.bindTexture(gl.TEXTURE_2D, renderTexture);
		};

		device.postDraw = function (gl) {
			gl.bindTexture(gl.TEXTURE_2D, renderTexture);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			device.renderer.clear();
			gl.useProgram(glPpShaderProgram);
			gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
			gl.vertexAttribPointer(gl.getAttribLocation(glPpShaderProgram, "aPosition"), 2, gl.FLOAT, false, 0, 0);
			gl.bindTexture(gl.TEXTURE_2D, renderTexture);
			gl.uniform1i(gl.getUniformLocation(glPpShaderProgram, "uSampler"), 0);
			gl.uniform2fv(gl.getUniformLocation(glPpShaderProgram, "uScreenSize"), [canvas.width, canvas.height]);
			gl.drawArrays(gl.TRIANGLES, 0, 6);
		};

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