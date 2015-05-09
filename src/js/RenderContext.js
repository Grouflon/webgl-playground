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
		function RenderContext(gl, mode, vertices, colors, indexes, texture, textureCoords) {
			this._mode = mode;
			this._vertices = [].concat(vertices);
			this._colors = [].concat(colors);
			this._indexes = [].concat(indexes);

			this._vertexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);

			this._colorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._colors), gl.STATIC_DRAW);

			this._indexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indexes), gl.STATIC_DRAW);

			if (texture && textureCoords)
			{
				this._textureCoords = [].concat(textureCoords);
				this._texture = texture;
				this._textureCoordBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, this._textureCoordBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._textureCoords), gl.STATIC_DRAW);
			}
		}

		Object.defineProperty(RenderContext.prototype, "vertexBuffer", {
			get: function() { return this._vertexBuffer; }
		});
		Object.defineProperty(RenderContext.prototype, "colorBuffer", {
			get: function() { return this._colorBuffer; }
		});
		Object.defineProperty(RenderContext.prototype, "textureCoordBuffer", {
			get: function() { return this._textureCoordBuffer; }
		});
		Object.defineProperty(RenderContext.prototype, "indexBuffer", {
			get: function() { return this._indexBuffer; }
		});
		Object.defineProperty(RenderContext.prototype, "size", {
			get: function() { return this._indexes.length; }
		});
		Object.defineProperty(RenderContext.prototype, "vertexSize", {
			get: function() { return this._vertexSize; }
		});
		Object.defineProperty(RenderContext.prototype, "colorSize", {
			get: function() { return this._colorSize; }
		});
		Object.defineProperty(RenderContext.prototype, "textureCoordSize", {
			get: function() { return this._textureCoordSize; }
		});
		Object.defineProperty(RenderContext.prototype, "texture", {
			get: function() { return this._texture; }
		});
		Object.defineProperty(RenderContext.prototype, "mode", {
			get: function() { return this._mode; }
		});

		RenderContext.prototype._vertexSize = 3;
		RenderContext.prototype._colorSize = 4;
		RenderContext.prototype._textureCoordSize = 2;
		RenderContext.prototype._vertices = null;
		RenderContext.prototype._colors = null;
		RenderContext.prototype._indexes = null;
		RenderContext.prototype._textureCoords = null;
		RenderContext.prototype._mode = null;
		RenderContext.prototype._texture = null;
		RenderContext.prototype._vertexBuffer = null;
		RenderContext.prototype._colorBuffer = null;
		RenderContext.prototype._indexBuffer = null;
		RenderContext.prototype._textureCoordBuffer = null;

		return RenderContext;
	});