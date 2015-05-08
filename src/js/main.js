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
		"Utils"
    ]
	, function (Device, RenderContext, Renderer, Utils)
    {
	    var canvas = document.getElementById("glcanvas");

	    var device = new Device(canvas, "shader-fs", "shader-vs");

	    var rdr = device.renderer;
	    rdr.setMatrixMode(Renderer.MatrixMode.PROJECTION);
	    rdr.identity();
	    rdr.perspective(45, canvas.width / canvas.height, 0.1, 100.0);

	    var rTri = 0;
	    var rSquare = 0;
	    var lastTime = 0;

		var triangle = new RenderContext(device.renderer.gl, device.renderer.gl.TRIANGLES,
		[
			0.0,  1.0,  0.0,
			-1.0, -1.0,  0.0,
			1.0, -1.0,  0.0
		],
		[
			1.0, 0.0, 0.0, 1.0,
			0.0, 1.0, 0.0, 1.0,
			0.0, 0.0, 1.0, 1.0
		]);

	    var square = new RenderContext(device.renderer.gl, device.renderer.gl.TRIANGLE_STRIP,
		    [
			    1.0,  1.0,  0.0,
			    -1.0,  1.0,  0.0,
			    1.0, -1.0,  0.0,
			    -1.0, -1.0,  0.0
		    ],
		    [
			    0.5, 0.5, 1.0, 1.0,
			    0.5, 0.5, 1.0, 1.0,
			    0.5, 0.5, 1.0, 1.0,
			    0.5, 0.5, 1.0, 1.0
		    ]);

	    device.update = function()
	    {
		    var timeNow = new Date().getTime();
		    if (lastTime != 0) {
			    var elapsed = timeNow - lastTime;

			    rTri += (90 * elapsed) / 1000.0;
			    rSquare += (75 * elapsed) / 1000.0;
		    }
		    lastTime = timeNow;
	    };

	    device.draw = function()
	    {
		    rdr.setMatrixMode(Renderer.MatrixMode.MODELVIEW);
		    rdr.identity();
		    rdr.pushMatrix();
		    rdr.translate(-1.5, 0.0, -7.0);
		    rdr.rotate(Utils.degToRad(rTri), [0, 1, 0]);
		    rdr.draw(triangle);
		    rdr.popMatrix();
		    rdr.translate(1.5, 0.0, -7.0);
		    rdr.rotate(Utils.degToRad(rSquare), [1, 0, 0]);
		    mat4.translate(3.0, 0.0, 0.0);
		    rdr.draw(square);
	    };

	    device.start();
	});