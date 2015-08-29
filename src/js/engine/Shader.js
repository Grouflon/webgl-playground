if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Shader
 * ===================================*/
define([
	]
	, function ()
	{
		Shader.FRAGMENT_SHADER = 1;
		Shader.VERTEX_SHADER = 2;

		function Shader(gl, type, str) {
			this._gl = gl;
			switch (type)
			{
				case Shader.FRAGMENT_SHADER:
					this._type = gl.FRAGMENT_SHADER;
					break;
				case Shader.VERTEX_SHADER:
					this._type = gl.VERTEX_SHADER;
					break;
				default:
					console.error("Unknown shader type.");
					break;
			}
			this._str = str;
		}

		Shader.prototype.load = function()
		{
			var gl = this._gl;
			this._glShader = gl.createShader(this._type);
			gl.shaderSource(this._glShader, this._str);
			gl.compileShader(this._glShader);
			if (!gl.getShaderParameter(this._glShader, gl.COMPILE_STATUS))
			{
				console.error(gl.getShaderInfoLog(this._glShader));
				return false;
			}
			this._loaded = true;
			return true;
		};

		Shader.prototype.release = function()
		{
			this._gl.deleteShader(this._glShader);
			this._loaded = false;
		};

		Object.defineProperty(Shader.prototype, "type", {
			get: function() { return this._type; }
		});

		Object.defineProperty(Shader.prototype, "loaded", {
			get: function() { return this._loaded; }
		});

		Object.defineProperty(Shader.prototype, "glShader", {
			get: function() { return this._glShader; }
		});

		Shader.prototype._gl = null;
		Shader.prototype._type = 0;
		Shader.prototype._str = null;
		Shader.prototype._glShader = null;
		Shader.prototype._loaded = false;

		return Shader;
	});