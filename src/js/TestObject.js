if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * TestObject
 * ===================================*/
define([
		"engine/GameObject",
		"engine/Camera"
	]
	, function (GameObject, Camera)
	{
		TestObject.prototype = Object.create(GameObject.prototype);

		function TestObject() {
			GameObject.call(this);
		}

		TestObject.prototype.load = function()
		{
			// DATA
			this._vertices = [
				// FRONT
				-1.0, -1.0, 1.0,
				1.0, -1.0, 1.0,
				1.0, 1.0, 1.0,
				-1.0, 1.0, 1.0,

				// BACK
				-1.0, -1.0, -1.0,
				1.0, -1.0, -1.0,
				1.0, 1.0, -1.0,
				-1.0, 1.0, -1.0,

				// TOP
				-1.0, 1.0, -1.0,
				1.0, 1.0, -1.0,
				1.0, 1.0, 1.0,
				-1.0, 1.0, 1.0,

				// BOTTOM
				-1.0, -1.0, -1.0,
				1.0, -1.0, -1.0,
				1.0, -1.0, 1.0,
				-1.0, -1.0, 1.0,

				// RIGHT
				1.0, -1.0, -1.0,
				1.0, 1.0, -1.0,
				1.0, 1.0, 1.0,
				1.0, -1.0, 1.0,

				// LEFT
				-1.0, -1.0, -1.0,
				-1.0, 1.0, -1.0,
				-1.0, 1.0, 1.0,
				-1.0, -1.0, 1.0
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
			this._texCoords = [
				// Front face
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0,

				// Back face
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0,
				0.0, 0.0,

				// Top face
				0.0, 1.0,
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0,

				// Bottom face
				1.0, 1.0,
				0.0, 1.0,
				0.0, 0.0,
				1.0, 0.0,

				// Right face
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0,
				0.0, 0.0,

				// Left face
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0
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

			this._glTexture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, crateImage);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

			this._glVertexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._glVertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);

			this._glColorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._glColorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._colors), gl.STATIC_DRAW);

			this._glTexCoordBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._glTexCoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._texCoords), gl.STATIC_DRAW);

			this._glNormalBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._glNormalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._normals), gl.STATIC_DRAW);

			this._glIndexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glIndexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);
		};

		TestObject.prototype.release = function()
		{
			var gl = device.renderer.gl;
			gl.deleteTexture(this._glTexture);
			gl.deleteBuffer(this._glVertexBuffer);
			gl.deleteBuffer(this._glColorBuffer);
			gl.deleteBuffer(this._glTexCoordBuffer);
			gl.deleteBuffer(this._glNormalBuffer);
			gl.deleteBuffer(this._glIndexBuffer);
		};

		TestObject.prototype.update = function(dt)
		{
			var rotation = this.transform.getRotation();
			rotation[0] += 0.75*dt;
			rotation[1] += 0.75*dt;
			rotation[5] += 0.75*dt;
			this.transform.setRotation(rotation[0], rotation[1], rotation[2]);
		};

		TestObject.prototype.draw = function(gl)
		{
			var shaderProgram = defaultShaderPogram.glShaderProgram;
			gl.useProgram(shaderProgram);
			gl.enable(gl.DEPTH_TEST);

			var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
			var aColor = gl.getAttribLocation(shaderProgram, "aColor");
			var aTexCoord = gl.getAttribLocation(shaderProgram, "aTexCoord");
			var aNormal = gl.getAttribLocation(shaderProgram, "aNormal");
			var uSampler = gl.getUniformLocation(shaderProgram, "uSampler");
			var uModel = gl.getUniformLocation(shaderProgram, "uModel");
			var uView = gl.getUniformLocation(shaderProgram, "uView");
			var uProj = gl.getUniformLocation(shaderProgram, "uProj");
			var uAmbientColor = gl.getUniformLocation(shaderProgram, "uAmbientColor");
			var uLightColor = gl.getUniformLocation(shaderProgram, "uLightColor");
			var uLightDirection = gl.getUniformLocation(shaderProgram, "uLightDirection");

			gl.bindBuffer(gl.ARRAY_BUFFER, this._glVertexBuffer);
			gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this._glColorBuffer);
			gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this._glTexCoordBuffer);
			gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this._glNormalBuffer);
			gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
			gl.uniform1i(uSampler, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glIndexBuffer);

			// CAMERA
			var camera = new Camera();
			camera.set(45, device.width / device.height, 0.1, 100.0);
			var view = mat4.create();
			mat4.translate(view, view, [0, 0, 7.0]);
			mat4.invert(view, view);
			camera.setViewMatrix(view);

			gl.viewport(0, 0, device.width, device.height);
			gl.uniformMatrix4fv(uModel, false, this.transform.getMatrix());
			gl.uniformMatrix4fv(uView, false, camera.getViewMatrix());
			gl.uniformMatrix4fv(uProj, false, camera.getProjMatrix());
			gl.uniform3fv(uAmbientColor, [0.1, 0.1, 0.1]);
			gl.uniform3fv(uLightColor, [1.0, 1.0, 1.0]);
			gl.uniform3fv(uLightDirection, [1.0, 0.0, 1.0]);

			gl.drawElements(gl.TRIANGLES, this._indices.length, gl.UNSIGNED_SHORT, 0);

		};

		TestObject.prototype._glTexture = null;
		TestObject.prototype._glVertexBuffer = null;
		TestObject.prototype._glColorBuffer = null;
		TestObject.prototype._glTexCoordBuffer = null;
		TestObject.prototype._glNormalBuffer = null;
		TestObject.prototype._glIndexBuffer = null;

		TestObject.prototype._vertices = null;
		TestObject.prototype._colors = null;
		TestObject.prototype._texCoords = null;
		TestObject.prototype._normals = null;
		TestObject.prototype._indices = null;

		return TestObject;
	});