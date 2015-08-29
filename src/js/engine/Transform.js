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
		}

		Transform.prototype.getPosition = function()
		{
			return vec3.clone(this._position);
		};

		Transform.prototype.setPosition = function(x, y, z)
		{
			this._position[0] = x;
			this._position[1] = y;
			this._position[2] = z;
			this._regenMatrix = true;
		};

		Transform.prototype.getRotation = function()
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
		};

		Transform.prototype.getMatrix = function()
		{
			if (this._regenMatrix)
			{
				mat4.identity(this._matrix);
				mat4.translate(this._matrix, this._matrix, this._position);
				mat4.rotateY(this._matrix, this._matrix, this._rotation[1]);
				mat4.rotateZ(this._matrix, this._matrix, this._rotation[2]);
				mat4.rotateX(this._matrix, this._matrix, this._rotation[0]);
				mat4.scale(this._matrix, this._matrix, this._scale);
				this._regenMatrix = false;
			}
			return mat4.clone(this._matrix);
		};

		Transform.prototype.setMatrix = function(value)
		{
			mat4.copy(this._matrix, value);
			this._regenMatrix = false;
		};

		Transform.prototype._position = null;
		Transform.prototype._rotation = null;
		Transform.prototype._scale = null;
		Transform.prototype._matrix = null;
		Transform.prototype._regenMatrix = true;

		return Transform;
	});