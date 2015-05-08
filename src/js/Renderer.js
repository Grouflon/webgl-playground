if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Renderer
 * ===================================*/
define([
		"Utils",
		"glMatrix-0.9.5.min.js"
	]
	, function (Utils)
	{
		function Renderer(canvas, fsId, vsId)
		{
			console.log("Renderer created");
			this._stacks = {};
			this._stacks[Renderer.MatrixMode.MODELVIEW] = [mat4.create()];
			this._stacks[Renderer.MatrixMode.PROJECTION] = [mat4.create()];
			this._matrixMode = Renderer.MatrixMode.MODELVIEW;

			this._initGL(canvas);
			this._initShaders(fsId, vsId);

			this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
			this._gl.enable(this._gl.DEPTH_TEST);
		}

		Renderer.MatrixMode = {
			MODELVIEW : 0,
			PROJECTION : 1
		};

		Renderer.prototype.setMatrixMode = function(value)
		{
			this._matrixMode = value;
		};

		Renderer.prototype.setViewport = function(x, y, w, h)
		{
			this._gl.viewport(x, y, w, h);
		};

		Renderer.prototype.identity = function()                            { mat4.identity(this._currentMatrix); };
		Renderer.prototype.translate = function(x, y, z)                    { mat4.translate(this._currentMatrix, [x, y, z]); };
		Renderer.prototype.rotate = function(radAngle, axis)                { mat4.rotate(this._currentMatrix, radAngle, axis); };
		Renderer.prototype.scale = function(x, y, z)                        { mat4.scale(this._currentMatrix, x, y, z); };
		Renderer.prototype.perspective = function(fov, ratio, zNear, zFar)  { mat4.perspective(fov, ratio, zNear, zFar, this._currentMatrix) };

		Renderer.prototype.pushMatrix = function()
		{
			this._stacks[this._matrixMode].unshift(mat4.create(this._currentMatrix));
		};

		Renderer.prototype.popMatrix = function()
		{
			if (this._stacks[this._matrixMode].length > 1)
				this._stacks[this._matrixMode].shift();
			else
				throw "Renderer error: Can't empty stack."
		};


		Renderer.prototype.draw = function(renderContext)
		{
			var gl = this._gl;

			gl.bindBuffer(gl.ARRAY_BUFFER, renderContext.vertexBuffer);
			gl.vertexAttribPointer(this._shaderProgram.vertexPositionAttribute, renderContext.vertexSize, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, renderContext.colorBuffer);
			gl.vertexAttribPointer(this._shaderProgram.vertexColorAttribute, renderContext.colorSize, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, renderContext.indexBuffer);

			gl.uniformMatrix4fv(this._shaderProgram.pMatrixUniform, false, this._stacks[Renderer.MatrixMode.PROJECTION][0]);
			gl.uniformMatrix4fv(this._shaderProgram.mvMatrixUniform, false, this._stacks[Renderer.MatrixMode.MODELVIEW][0]);

			gl.drawElements(renderContext.mode, renderContext.size, gl.UNSIGNED_SHORT, 0);
		};

		Renderer.prototype.clear = function()
		{
			this._gl.clear(this._gl.COLOR_BUFFER_BIT| this._gl.DEPTH_BUFFER_BIT);
		};

		Object.defineProperty(Renderer.prototype, "gl", {
			get: function() { return this._gl; }
		});

		Renderer.prototype._initGL = function(canvas)
		{
			try
			{
				this._gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
				this.setViewport(0, 0, canvas.width, canvas.height);
				console.log("Renderer initialized");
			}
			catch (e)
			{
				console.error("Impossible d'initialiser le WebGL. Il est possible que votre navigateur ne supporte pas cette fonctionnalité.", e);
			}
		};

		Renderer.prototype._initShaders = function(fsId, vsId)
		{
			var gl = this._gl;
			var fragmentShader = Utils.getShader(gl, fsId);
			var vertexShader = Utils.getShader(gl, vsId);

			var shaderProgram = gl.createProgram();
			gl.attachShader(shaderProgram, vertexShader);
			gl.attachShader(shaderProgram, fragmentShader);
			gl.linkProgram(shaderProgram);

			if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
				console.error("Could not initialise shaders");
			}

			gl.useProgram(shaderProgram);

			shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
			gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

			shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
			gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

			shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
			shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

			this._shaderProgram = shaderProgram;
		};

		Object.defineProperty(Renderer.prototype, "_currentMatrix", {
			get: function() { return this._stacks[this._matrixMode][0]; }
		});

		Renderer.prototype._gl = null;
		Renderer.prototype._shaderProgram = null;

		Renderer.prototype._stacks = null;

		return Renderer;
	});