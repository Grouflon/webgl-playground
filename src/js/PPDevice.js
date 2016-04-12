if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * PostProcessingDevice
 * ===================================*/
define([
		"engine/Device",
		"engine/Shader",
		"engine/ShaderProgram",
		"engine/utils/FileUtils"
	]
	, function (Device, Shader, ShaderProgram, FileUtils)
	{
		PPDevice.prototype = Object.create(Device.prototype);

		function PPDevice(canvas) {
			Device.call(this, canvas);
			this.asciiTint = [2, 204, 15];
		}

		PPDevice.prototype.load = function()
		{
			var gl = this.renderer.gl;

			gl.clearColor(0.0, 0.0, 0.0, 1.0);

			// BASIC SHADERS
			var defaultVs = null;
			FileUtils.loadFile("shaders/basic.vs", false, function(response)
			{
				defaultVs = new Shader(gl, Shader.VERTEX_SHADER, response);
			});
			var defaultFs = null;
			FileUtils.loadFile("shaders/basic.fs", false, function(response)
			{
				defaultFs = new Shader(gl, Shader.FRAGMENT_SHADER, response);
			});
			defaultVs.load();
			defaultFs.load();
			this._defaultShaderProgram = new ShaderProgram(gl, defaultVs, defaultFs);
			this._defaultShaderProgram.load();
			var glDefaultShaderProgram = this._defaultShaderProgram.glShaderProgram;
			gl.useProgram(glDefaultShaderProgram);
			var aPosition = gl.getAttribLocation(glDefaultShaderProgram, "aPosition");
			var aColor = gl.getAttribLocation(glDefaultShaderProgram, "aColor");
			var aTexCoord = gl.getAttribLocation(glDefaultShaderProgram, "aTexCoord");
			var aNormal = gl.getAttribLocation(glDefaultShaderProgram, "aNormal");
			gl.enableVertexAttribArray(aPosition);
			gl.enableVertexAttribArray(aColor);
			gl.enableVertexAttribArray(aTexCoord);
			gl.enableVertexAttribArray(aNormal);
			window.defaultShaderProgram = this._defaultShaderProgram;

			var groundSize = 10000.0;
			var groundColor = [0.5, 0.5, 0.5, 1.0];
			this._ground = {};
			this._ground.vertexBuffer= gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._ground.vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
					groundSize * 0.5, 0.0, groundSize * 0.5,
					groundSize * 0.5, 0.0, -groundSize * 0.5,
					-groundSize * 0.5, 0.0, -groundSize * 0.5,
					-groundSize * 0.5, 0.0, groundSize * 0.5,
					groundSize * 0.5, 0.0, groundSize * 0.5,
					-groundSize * 0.5, 0.0, -groundSize * 0.5
			]), gl.STATIC_DRAW);

			this._ground.colorBuffer= gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._ground.colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
					groundColor[0], groundColor[1], groundColor[2], groundColor[3],
					groundColor[0], groundColor[1], groundColor[2], groundColor[3],
					groundColor[0], groundColor[1], groundColor[2], groundColor[3],
					groundColor[0], groundColor[1], groundColor[2], groundColor[3],
					groundColor[0], groundColor[1], groundColor[2], groundColor[3],
					groundColor[0], groundColor[1], groundColor[2], groundColor[3]
			]), gl.STATIC_DRAW);

			this._ground.normalBuffer= gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._ground.normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0
			]), gl.STATIC_DRAW);

			this._ground.texCoordBuffer= gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._ground.texCoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
				-groundSize * 0.125, -groundSize * 0.125,
				groundSize * 0.125, -groundSize * 0.125,
				groundSize * 0.125, groundSize * 0.125,
				-groundSize * 0.125, -groundSize * 0.125,
				groundSize * 0.125, groundSize * 0.125,
				-groundSize * 0.125, groundSize * 0.125
			]), gl.STATIC_DRAW);

			this._defaultTexture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this._defaultTexture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, defaultTexture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

			this._ground.texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this._ground.texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, groundTexture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		};

		PPDevice.prototype.release = function()
		{
		};

		PPDevice.prototype.draw = function(gl)
		{
			gl.enable(gl.DEPTH_TEST);
			gl.enable(gl.CULL_FACE);
			var viewport = camera.getViewport();
			gl.viewport(viewport.x, viewport.y, viewport.w, viewport.h);
			gl.clearColor(0.5, 0.1, 0.1, 1.0);

			var shaderProgram = defaultShaderProgram.glShaderProgram;
			gl.useProgram(shaderProgram);

			var uView = gl.getUniformLocation(shaderProgram, "uView");
			var uProj = gl.getUniformLocation(shaderProgram, "uProj");
			var uAmbientColor = gl.getUniformLocation(shaderProgram, "uAmbientColor");
			var uLightColor = gl.getUniformLocation(shaderProgram, "uLightColor");
			var uLightDirection = gl.getUniformLocation(shaderProgram, "uLightDirection");
			var uModel = gl.getUniformLocation(shaderProgram, "uModel");
			var uSampler = gl.getUniformLocation(shaderProgram, "uSampler");
			gl.uniformMatrix4fv(uView, false, camera.getViewMatrix());
			gl.uniformMatrix4fv(uProj, false, camera.getProjMatrix());
			gl.uniformMatrix4fv(uModel, false, mat4.create());
			gl.uniform3fv(uAmbientColor, [0.6, 0.6, 0.6]);
			gl.uniform3fv(uLightColor, [1.0, 1.0, 1.0]);
			gl.uniform3fv(uLightDirection, [0.3, 0.8, 0.6]);
			gl.uniform1i(uSampler, 0);

			var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
			var aColor = gl.getAttribLocation(shaderProgram, "aColor");
			var aNormal = gl.getAttribLocation(shaderProgram, "aNormal");
			var aTexCoord = gl.getAttribLocation(shaderProgram, "aTexCoord");
			gl.bindBuffer(gl.ARRAY_BUFFER, this._ground.vertexBuffer);
			gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this._ground.colorBuffer);
			gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this._ground.normalBuffer);
			gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this._ground.texCoordBuffer);
			gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this._ground.texture);

			this.renderer.clear();

			gl.drawArrays(gl.TRIANGLES, 0, 6);

			gl.bindTexture(gl.TEXTURE_2D, this._defaultTexture);

			Device.prototype.draw.call(this, gl);

			/*gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);

			this.renderer.clear();
			Device.prototype.draw.call(this, gl);

			gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer2);
			this.renderer.clear();
			var glPpShaderProgram = this._ppShaderProgram.glShaderProgram;
			gl.useProgram(glPpShaderProgram);
			gl.bindBuffer(gl.ARRAY_BUFFER, this._quadBuffer);
			gl.vertexAttribPointer(gl.getAttribLocation(glPpShaderProgram, "aPosition"), 2, gl.FLOAT, false, 0, 0);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this._renderTexture);
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, this._asciiRampTexture);
			gl.uniform1i(gl.getUniformLocation(glPpShaderProgram, "uEnabled"), this.asciify);
			gl.uniform1i(gl.getUniformLocation(glPpShaderProgram, "uSampler"), 0);
			gl.uniform1i(gl.getUniformLocation(glPpShaderProgram, "uAsciiSampler"), 1);
			gl.uniform2fv(gl.getUniformLocation(glPpShaderProgram, "uScreenSize"), [this.width, this.height]);
			gl.uniform3fv(gl.getUniformLocation(glPpShaderProgram, "uAsciiTint"), [this.asciiTint[0] / 255, this.asciiTint[1] / 255, this.asciiTint[2] / 255]);;
			gl.drawArrays(gl.TRIANGLES, 0, 6);

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			this.renderer.clear();
			var glCrtShaderProgram = this._crtShaderProgram.glShaderProgram;
			gl.useProgram(glCrtShaderProgram);
			gl.bindBuffer(gl.ARRAY_BUFFER, this._quadBuffer);
			gl.vertexAttribPointer(gl.getAttribLocation(glCrtShaderProgram, "aPosition"), 2, gl.FLOAT, false, 0, 0);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this._renderTexture2);
			gl.uniform1i(gl.getUniformLocation(glCrtShaderProgram, "uEnabled"), this.crt);
			gl.uniform1i(gl.getUniformLocation(glCrtShaderProgram, "uSampler"), 0);
			gl.uniform2fv(gl.getUniformLocation(glCrtShaderProgram, "uScreenSize"), [this.width, this.height]);
			gl.uniform1f(gl.getUniformLocation(glCrtShaderProgram, "uGlobalTime"), this.globalTime);
			gl.drawArrays(gl.TRIANGLES, 0, 6);*/
		};

		PPDevice.prototype._ground = null;
		PPDevice.prototype._defaultTexture = null;
		PPDevice.prototype._defaultShaderProgram = null;

		PPDevice.prototype.asciify = true;
		PPDevice.prototype.crt = true;
		PPDevice.prototype.asciiTint = null;

		PPDevice.prototype._ppShaderProgram = null;
		PPDevice.prototype._crtShaderProgram = null;

		PPDevice.prototype._renderTexture = null;
		PPDevice.prototype._frameBuffer = null;
		PPDevice.prototype._renderBuffer = null;
		PPDevice.prototype._renderTexture2 = null;
		PPDevice.prototype._frameBuffer2 = null;
		PPDevice.prototype._renderBuffer2 = null;
		PPDevice.prototype._quadBuffer = null;

		PPDevice.prototype._asciiRampTexture = null;

		PPDevice.prototype._resized = false;

		return PPDevice;
	});