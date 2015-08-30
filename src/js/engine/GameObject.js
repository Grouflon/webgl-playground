if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * GameObject
 * ===================================*/
define([
		"engine/Transform"
	]
	, function (Transform)
	{
		function GameObject() {
			this._transform = new Transform;
		}

		GameObject.prototype.load = function()
		{
			var gl = device.renderer.gl;

		};

		GameObject.prototype.release = function()
		{

		};

		GameObject.prototype.update = function(dt)
		{

		};

		GameObject.prototype.draw = function(gl)
		{
		};

		Object.defineProperty(GameObject.prototype, "transform", {
			get: function() { return this._transform; }
		});

		GameObject.prototype._transform = null;

		return GameObject;
	});