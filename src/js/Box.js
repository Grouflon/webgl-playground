if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Box
 * ===================================*/
define([
		"engine/GameObject",
	]
	, function (GameObject)
	{
		Box.prototype = Object.create(GameObject.prototype);

		function Box(x, y, z, w, h, d) {
			GameObject.call(this);

			this.transform.setPosition(x, y, z);
			this._w = w;
			this._h = h;
			this._d = d;
		}

		Box.prototype.load = function()
		{
			// DATA
			var w = this._w*0.5;
			var h = this._h*0.5;
			var d = this._d*0.5;
			this._vertices = [
				// FRONT
				-w, -h,  d,
				 w, -h,  d,
				 w,  h,  d,
				-w,  h,  d,

				// BACK
				 w, -h, -d,
				-w, -h, -d,
				-w,  h, -d,
				 w,  h, -d,

				// TOP
				 w, h, -d,
				-w, h, -d,
				-w, h,  d,
				 w, h,  d,

				// BOTTOM
				-w, -h, -d,
				 w, -h, -d,
				 w, -h,  d,
				-w, -h,  d,

				// RIGHT
				 w, -h, -d,
				 w,  h, -d,
				 w,  h,  d,
				 w, -h,  d,

				// LEFT
				-w,  h, -d,
				-w, -h, -d,
				-w, -h,  d,
				-w,  h,  d
			];
			this._colors = [
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,

				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,

				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,

				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,

				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,

				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0
			];
			this._normals = [
				// FRONT
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,

				// BACK
				0.0, 0.0, -1.0,
				0.0, 0.0, -1.0,
				0.0, 0.0, -1.0,
				0.0, 0.0, -1.0,

				// TOP
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,

				// BOTTOM
				0.0, -1.0, 0.0,
				0.0, -1.0, 0.0,
				0.0, -1.0, 0.0,
				0.0, -1.0, 0.0,

				// RIGHT
				1.0, 0.0, 0.0,
				1.0, 0.0, 0.0,
				1.0, 0.0, 0.0,
				1.0, 0.0, 0.0,

				// LEFT
				-1.0, 0.0, 0.0,
				-1.0, 0.0, 0.0,
				-1.0, 0.0, 0.0,
				-1.0, 0.0, 0.0
			];
			this._indices = [
				0, 1, 2, 0, 2, 3,
				4, 5, 6, 4, 6, 7,
				8, 9, 10, 8, 10, 11,
				12, 13, 14, 12, 14, 15,
				16, 17, 18, 16, 18, 19,
				20, 21, 22, 20, 22, 23
			];

			// GL
			var gl = device.renderer.gl;

			this._glVertexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._glVertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);

			this._glColorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._glColorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._colors), gl.STATIC_DRAW);

			this._glNormalBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._glNormalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._normals), gl.STATIC_DRAW);

			this._glIndexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glIndexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);
		};

		Box.prototype.release = function()
		{
			var gl = device.renderer.gl;

			gl.deleteBuffer(Box.prototype._glVertexBuffer);
			gl.deleteBuffer(Box.prototype._glColorBuffer);
			gl.deleteBuffer(Box.prototype._glNormalBuffer);
			gl.deleteBuffer(Box.prototype._glIndexBuffer);
		};

		Box.prototype.draw = function(gl)
		{
			var shaderProgram = defaultShaderPogram.glShaderProgram;
			gl.useProgram(shaderProgram);
			gl.enable(gl.DEPTH_TEST);
			gl.enable(gl.CULL_FACE);

			var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
			var aColor = gl.getAttribLocation(shaderProgram, "aColor");
			var aNormal = gl.getAttribLocation(shaderProgram, "aNormal");
			var uModel = gl.getUniformLocation(shaderProgram, "uModel");
			var uView = gl.getUniformLocation(shaderProgram, "uView");
			var uProj = gl.getUniformLocation(shaderProgram, "uProj");
			var uNormal = gl.getUniformLocation(shaderProgram, "uNormal");
			var uAmbientColor = gl.getUniformLocation(shaderProgram, "uAmbientColor");
			var uLightColor = gl.getUniformLocation(shaderProgram, "uLightColor");
			var uLightPosition = gl.getUniformLocation(shaderProgram, "uLightPosition");

			gl.bindBuffer(gl.ARRAY_BUFFER, this._glVertexBuffer);
			gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this._glColorBuffer);
			gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this._glNormalBuffer);
			gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glIndexBuffer);

			var camera = observer.camera;
			var viewport = camera.getViewport();
			gl.viewport(viewport.x, viewport.y, viewport.w, viewport.h);
			gl.uniformMatrix4fv(uModel, false, this.transform.getMatrix());
			gl.uniformMatrix4fv(uView, false, camera.getViewMatrix());
			gl.uniformMatrix4fv(uProj, false, camera.getProjMatrix());

			// NORMAL MATRIX
			var mvMat = mat4.create();
			var nMat = mat3.create();
			mat4.mul(mvMat, this.transform.getMatrix(), camera.getViewMatrix());
			mat3.fromMat4(nMat, mvMat);
			mat3.invert(nMat, nMat);
			mat3.transpose(nMat, nMat);
			gl.uniformMatrix3fv(uNormal, false, nMat);

			gl.uniform3fv(uAmbientColor, [0.0, 0.0, 0.0]);
			gl.uniform3fv(uLightColor, [1.0, 1.0, 1.0]);
			gl.uniform3fv(uLightPosition, observer.transform.getPosition());

			gl.drawElements(gl.TRIANGLES, this._indices.length, gl.UNSIGNED_SHORT, 0);
		};

		Box.prototype._w = 0.0;
		Box.prototype._h = 0.0;
		Box.prototype._d = 0.0;
		Box.prototype._glVertexBuffer = null;
		Box.prototype._glColorBuffer = null;
		Box.prototype._glNormalBuffer = null;
		Box.prototype._glIndexBuffer = null;
		Box.prototype._vertices = null;
		Box.prototype._colors = null;
		Box.prototype._normals = null;
		Box.prototype._indices = null;

		return Box;
	});