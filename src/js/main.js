if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Main
 * ===================================*/
define([
		"Renderer.js"
    ]
	, function (Renderer)
    {
	    Renderer.init(document.getElementById("glcanvas"));
	});