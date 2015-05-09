if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Main
 * ===================================*/
define([
		"Device",
		"RenderContext",
		"Renderer",
		"Utils",
		"Texture"
    ]
	, function (Device, RenderContext, Renderer, Utils, Texture)
    {
	    var canvas = document.getElementById("glcanvas");

	    var device = new Device(canvas, "shader-fs", "shader-vs");

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
	    img.src = "images/nehe.gif";

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
	    };

	});