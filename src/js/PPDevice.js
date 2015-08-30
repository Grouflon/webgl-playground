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
		}

		PPDevice.prototype.load = function()
		{
			var gl = this.renderer.gl;

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
			this._defaultShaderPogram = new ShaderProgram(gl, defaultVs, defaultFs);
			this._defaultShaderPogram.load();
			var glDefaultShaderProgram = this._defaultShaderPogram.glShaderProgram;
			gl.useProgram(glDefaultShaderProgram);
			var aPosition = gl.getAttribLocation(glDefaultShaderProgram, "aPosition");
			var aColor = gl.getAttribLocation(glDefaultShaderProgram, "aColor");
			var aTexCoord = gl.getAttribLocation(glDefaultShaderProgram, "aTexCoord");
			var aNormal = gl.getAttribLocation(glDefaultShaderProgram, "aNormal");
			gl.enableVertexAttribArray(aPosition);
			gl.enableVertexAttribArray(aColor);
			gl.enableVertexAttribArray(aTexCoord);
			gl.enableVertexAttribArray(aNormal);
			window.defaultShaderPogram = this._defaultShaderPogram;

			// ASCII POST PROCESSING SHADER
			var postProcessingVs = null;
			FileUtils.loadFile("shaders/post_processing.vs", false, function(response)
			{
				postProcessingVs = new Shader(gl, Shader.VERTEX_SHADER, response);
			});
			var postProcessingFs = null;
			FileUtils.loadFile("shaders/post_processing.fs", false, function(response)
			{
				postProcessingFs = new Shader(gl, Shader.FRAGMENT_SHADER, response);
			});
			postProcessingVs.load();
			postProcessingFs.load();
			this._ppShaderProgram = new ShaderProgram(gl, postProcessingVs, postProcessingFs);
			this._ppShaderProgram.load();
			var glPpShaderProgram = this._ppShaderProgram.glShaderProgram;
			gl.useProgram(glPpShaderProgram);
			gl.enableVertexAttribArray(gl.getAttribLocation(glPpShaderProgram, "aPosition"));

			// CRT POST PROCESSING SHADER
			var crtFs = null;
			FileUtils.loadFile("shaders/crt.fs", false, function(response)
			{
				crtFs = new Shader(gl, Shader.FRAGMENT_SHADER, response);
			});
			crtFs.load();
			this._crtShaderProgram = new ShaderProgram(gl, postProcessingVs, crtFs);
			this._crtShaderProgram.load();
			var glCrtShaderProgram = this._crtShaderProgram.glShaderProgram;
			gl.useProgram(glCrtShaderProgram);
			gl.enableVertexAttribArray(gl.getAttribLocation(glCrtShaderProgram, "aPosition"));

			// ASCII RAMP TEXTURE
			this._asciiRampTexture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this._asciiRampTexture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asciiRampImage);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

			// MID RENDER TARGET
			this._loadFrameBuffers();
			window.onresize = function() {
				var wrapper = document.getElementById("canvas-wrapper");
				this._canvas.width = wrapper.clientWidth;
				this._canvas.height = wrapper.clientHeight;
				this._resized = true;
			}.bind(this);

			// MID RENDER TARGET DATA
			this._quadBuffer = gl.createBuffer();
			var quadVertices = [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1];
			gl.bindBuffer(gl.ARRAY_BUFFER, this._quadBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVertices), gl.STATIC_DRAW);
		};

		PPDevice.prototype.release = function()
		{
			this._releaseFrameBuffers();
		};

		PPDevice.prototype._loadFrameBuffers = function()
		{
			var gl = this.renderer.gl;

			this._renderTexture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this._renderTexture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			this._frameBuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._renderTexture, 0);
			this._renderBuffer = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, this._renderBuffer);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._renderBuffer);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			this._renderTexture2 = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this._renderTexture2);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			this._frameBuffer2 = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer2);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._renderTexture2, 0);
			this._renderBuffer2 = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, this._renderBuffer2);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._renderBuffer2);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		};

		PPDevice.prototype._releaseFrameBuffers = function()
		{
			var gl = this.renderer.gl;
			gl.deleteFramebuffer(this._frameBuffer);
			gl.deleteFramebuffer(this._frameBuffer2);
			gl.deleteRenderbuffer(this._renderBuffer);
			gl.deleteRenderbuffer(this._renderBuffer2);
			gl.deleteTexture(this._renderTexture);
			gl.deleteTexture(this._renderTexture2);
			this._frameBuffer = null;
			this._frameBuffer2 = null;
			this._renderBuffer = null;
			this._renderBuffer2 = null;
			this._renderTexture = null;
			this._renderTexture2 = null;
		};

		PPDevice.prototype._reloadFrameBuffers = function()
		{
			this._releaseFrameBuffers();
			this._loadFrameBuffers();
		}

		PPDevice.prototype.draw = function(gl)
		{
			if (this._resized)
				this._reloadFrameBuffers();

			gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);

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
			gl.uniform1i(gl.getUniformLocation(glPpShaderProgram, "uSampler"), 0);
			gl.uniform1i(gl.getUniformLocation(glPpShaderProgram, "uAsciiSampler"), 1);
			gl.uniform2fv(gl.getUniformLocation(glPpShaderProgram, "uScreenSize"), [this.width, this.height]);
			gl.drawArrays(gl.TRIANGLES, 0, 6);

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			this.renderer.clear();
			var glCrtShaderProgram = this._crtShaderProgram.glShaderProgram;
			gl.useProgram(glCrtShaderProgram);
			gl.bindBuffer(gl.ARRAY_BUFFER, this._quadBuffer);
			gl.vertexAttribPointer(gl.getAttribLocation(glCrtShaderProgram, "aPosition"), 2, gl.FLOAT, false, 0, 0);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this._renderTexture2);
			gl.uniform1i(gl.getUniformLocation(glCrtShaderProgram, "uSampler"), 0);
			gl.uniform2fv(gl.getUniformLocation(glCrtShaderProgram, "uScreenSize"), [this.width, this.height]);
			gl.uniform1f(gl.getUniformLocation(glCrtShaderProgram, "uGlobalTime"), this.globalTime);
			gl.drawArrays(gl.TRIANGLES, 0, 6);
		};

		PPDevice.prototype._defaultShaderProgram = null;
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