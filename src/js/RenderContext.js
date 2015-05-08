if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Render Context
 * ===================================*/
define([
	]
	, function ()
	{
		function RenderContext(gl, mode, vertices, colors) {
			if (vertices.length / this._vertexSize != colors.length / this._colorSize)
				throw "Invalid render context";
			else {
				this._mode = mode;
				this._vertices = [].concat(vertices);
				this._colors = [].concat(colors);

				this._vertexBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);

				this._colorBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._colors), gl.STATIC_DRAW);
			}
		}

		Object.defineProperty(RenderContext.prototype, "vertexBuffer", {
			get: function() { return this._vertexBuffer; }
		});
		Object.defineProperty(RenderContext.prototype, "colorBuffer", {
			get: function() { return this._colorBuffer; }
		});
		Object.defineProperty(RenderContext.prototype, "size", {
			get: function() { return this._vertices.length / this._vertexSize; }
		});
		Object.defineProperty(RenderContext.prototype, "vertexSize", {
			get: function() { return this._vertexSize; }
		});
		Object.defineProperty(RenderContext.prototype, "colorSize", {
			get: function() { return this._colorSize; }
		});
		Object.defineProperty(RenderContext.prototype, "mode", {
			get: function() { return this._mode; }
		});

		RenderContext.prototype._vertexSize = 3;
		RenderContext.prototype._colorSize = 4;
		RenderContext.prototype._vertices = null;
		RenderContext.prototype._colors = null;
		RenderContext.prototype._mode = null;
		RenderContext.prototype._vertexBuffer = null;
		RenderContext.prototype._colorBuffer = null;

		return RenderContext;
	});