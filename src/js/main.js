if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Main
 * ===================================*/
define([
    ]
	, function ()
    {
	    var gl;
		var canvas = document.getElementById("glcanvas");
	    initWebGL(canvas);

	    if (gl)
	    {
		    gl.clearColor(0.0, 0.0, 0.0, 1.1);
		    gl.enable(gl.DEPTH_TEST);
		    gl.depthFunc(gl.LEQUAL);
		    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	    }


	    function initWebGL(canvas) {
		    gl = null;

		    try
		    {
			    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		    }
		    catch(e) {}

		    if (!gl)
		    {
			    console.error("Impossible d'initialiser le WebGL. Il est possible que votre navigateur ne supporte pas cette fonctionnalité.");
		    }
	    }
	});