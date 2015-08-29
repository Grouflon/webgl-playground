if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Shader Program
 * ===================================*/
define([
	]
	, function ()
	{

		function ShaderProgram(gl, vertexShader, fragmentShader) {
			this._gl = gl;
			this._vertexShader = vertexShader.glShader;
			this._fragmentShader = fragmentShader.glShader;
		}

		ShaderProgram.prototype.load = function()
		{
			var gl = this._gl;
			this._glShaderProgram = gl.createProgram();
			gl.attachShader(this._glShaderProgram, this._vertexShader);
			gl.attachShader(this._glShaderProgram, this._fragmentShader);
			gl.linkProgram(this._glShaderProgram);

			if (!gl.getProgramParameter(this._glShaderProgram, gl.LINK_STATUS)) {
				console.error(gl.getProgramInfoLog(this._glShaderProgram));
				return false;
			}

			/*gl.validateProgram(this._glShaderProgram);
			if (!gl.getProgramParameter(this._glShaderProgram, gl.VALIDATE_STATUS))
			{
				console.error(gl.getProgramInfoLog(this._glShaderProgram));
				return false;
			}*/

			return true;
		};

		ShaderProgram.prototype.release = function()
		{
			this._gl.deleteProgram(this._glShaderProgram);
			return false;
		};

		Object.defineProperty(ShaderProgram.prototype, "loaded", {
			get: function() { return this._loaded; }
		});

		Object.defineProperty(ShaderProgram.prototype, "glShaderProgram", {
			get: function() { return this._glShaderProgram; }
		});

		ShaderProgram.prototype._gl = null;
		ShaderProgram.prototype._vertexShader = null;
		ShaderProgram.prototype._fragmentShader = null;
		ShaderProgram.prototype._glShaderProgram = null;
		ShaderProgram.prototype._loaded = false;

		return ShaderProgram;
	});