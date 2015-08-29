if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Camera
 * ===================================*/
define([
		"engine/utils/MathUtils"
	]
	, function (MathUtils)
	{
		function Camera() {
			this._viewMatrix = mat4.create();
			this._projMatrix = mat4.create();
			mat4.identity(this._viewMatrix);
			this._viewport = { x:0, y:0, w:0, h:0 };
		}

		Camera.prototype.set = function(fov, ratio, zNear, zFar)
		{
			mat4.identity(this._projMatrix);
			mat4.perspective(this._projMatrix, MathUtils.degToRad(fov), ratio, zNear, zFar);
		};

		Camera.prototype.getViewport = function()
		{
			return {
				x: this._viewport.x,
				y: this._viewport.y,
				w: this._viewport.w,
				h: this._viewport.h
			};
		};

		Camera.prototype.setViewport = function(x, y, w, h)
		{
			this._viewport.x = x;
			this._viewport.y = y;
			this._viewport.w = w;
			this._viewport.h = h;
		};

		Camera.prototype.getViewMatrix = function() {
			return mat4.clone(this._viewMatrix);
		};

		Camera.prototype.setViewMatrix = function(value) {
			mat4.copy(this._viewMatrix, value);
		};

		Camera.prototype.getProjMatrix = function() {
			return mat4.clone(this._projMatrix);
		};

		Camera.prototype.setProjMatrix = function(value) {
			mat4.copy(this._projMatrix, value);
		};

		Camera.prototype._viewMatrix = null;
		Camera.prototype._projMatrix = null;
		Camera.prototype._viewport = null;

		return Camera;
	});