if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Transform
 * ===================================*/
define([
	]
	, function ()
	{
		function Transform() {
			this._position = [0,0,0];
			this._rotation = [0,0,0];
			this._scale = [1,1,1];
			this._matrix = mat4.create();
			this._regenMatrix = false;
		}

		Transform.prototype.getPosition = function()
		{
			return [this._matrix[12], this._matrix[13], this._matrix[14]];
		};

		Transform.prototype.setPosition = function(x, y, z)
		{
			this._matrix[12] = x;
			this._matrix[13] = y;
			this._matrix[14] = z;
		};

		/*Transform.prototype.getRotation = function()
		{
			return vec3.clone(this._rotation);
		};

		Transform.prototype.setRotation = function(x, y, z)
		{
			this._rotation[0] = x;
			this._rotation[1] = y;
			this._rotation[2] = z;
			this._regenMatrix = true;
		};

		Transform.prototype.getScale = function()
		{
			return vec3.clone(this._scale);
		};

		Transform.prototype.setScale = function(x, y, z)
		{
			this._scale[0] = x;
			this._scale[1] = y;
			this._scale[2] = z;
			this._regenMatrix = true;
		};*/

		Transform.prototype.getMatrix = function()
		{
			return mat4.clone(this._matrix);
		};

		Transform.prototype.setMatrix = function(value)
		{
			mat4.copy(this._matrix, value);
		};

		Object.defineProperty(Transform.prototype, "front", {
			get: function() { var m = this.getMatrix(); return [-m[8], -m[9], -m[10]]; }
		});

		Object.defineProperty(Transform.prototype, "back", {
			get: function() { var m = this.getMatrix(); return [m[8], m[9], m[10]]; }
		});

		Object.defineProperty(Transform.prototype, "up", {
			get: function() { var m = this.getMatrix(); return [m[4], m[5], m[6]]; }
		});

		Object.defineProperty(Transform.prototype, "down", {
			get: function() { var m = this.getMatrix(); return [-m[4], -m[5], -m[6]]; }
		});

		Object.defineProperty(Transform.prototype, "right", {
			get: function() { var m = this.getMatrix(); return [m[0], m[1], m[2]]; }
		});

		Object.defineProperty(Transform.prototype, "left", {
			get: function() { var m = this.getMatrix(); return [-m[0], -m[1], -m[2]]; }
		});

		Transform.prototype._position = null;
		Transform.prototype._rotation = null;
		Transform.prototype._scale = null;
		Transform.prototype._matrix = null;
		Transform.prototype._regenMatrix = true;

		return Transform;
	});