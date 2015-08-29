if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * MathUtils
 * ===================================*/
define([
	]
	, function ()
	{
		return {
			degToRad: function(degrees) {
				return degrees * Math.PI / 180;
			},

			radToDeg: function(radians) {
				return radians * 180 / Math.PI;
			}
		};
	});