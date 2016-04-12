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
			this._position = vec3.create();
			this._rotation = quat.create();
			this._scale = [1.0, 1.0, 1.0];
			this._matrix = mat4.create();
			this._dirty = false;
		}

		Transform.prototype.getPosition = function()
		{
			return vec3.clone(this._position);
		};

		Transform.prototype.setPosition = function(position)
		{
			vec3.copy(this._position, position);
			this._dirty = true;
		};

		Transform.prototype.getRotation = function()
		{
			return quat.clone(this._rotation);
		};


		Transform.prototype.setRotation = function(rotation)
		{
			quat.copy(this._rotation, rotation);
			this._dirty = true;
		};

		Transform.prototype.getScale = function()
		{
			return vec3.clone(this._scale);
		};

		Transform.prototype.setScale = function(scale)
		{
			vec3.copy(this._scale, scale);
			this._dirty = true;
		};

		Transform.prototype.getMatrix = function()
		{
			if (this._dirty)
			{
				mat4.fromRotationTranslation(this._matrix, this._rotation, this._position);
				mat4.scale(this._matrix, this._matrix, this._scale);
				this._dirty = false;
			}
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
		Transform.prototype._dirty = true;

		return Transform;
	});