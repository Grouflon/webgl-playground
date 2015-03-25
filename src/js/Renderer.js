if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Renderer
 * ===================================*/
define([
		"glMatrix-0.9.5.min.js"
	]
	, function ()
	{
		var Renderer = {};

		Renderer.init = function (canvas)
		{
			this._mvMatrix = mat4.create();
			this._pMatrix = mat4.create();

			this._initGL(canvas);
			this._initShaders();
			this._initBuffers();

			this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
			this._gl.enable(this._gl.DEPTH_TEST);
		};


		Renderer.clear = function ()
		{
			this._gl.clear(this._gl.COLOR_BUFFER_BIT| this._gl.DEPTH_BUFFER_BIT);
		};


		Renderer.draw = function()
		{
			var gl = this._gl;

			gl.viewport(0, 0, this._viewportSize.x, this._viewportSize.y);
			mat4.perspective(45, this._viewportSize.x / this._viewportSize.y, 0.1, 100.0, this._pMatrix);
			mat4.identity(this._mvMatrix);
			mat4.translate(this._mvMatrix, [-1.5, 0.0, -7.0]);

			gl.bindBuffer(gl.ARRAY_BUFFER, this._triangleVertexPositionBuffer);
			gl.vertexAttribPointer(this._shaderProgram.vertexPositionAttribute, this._triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
			this._setMatrixUniforms();
			gl.drawArrays(gl.TRIANGLES, 0, this._triangleVertexPositionBuffer.numItems);

			mat4.translate(this._mvMatrix, [3.0, 0.0, 0.0]);
			gl.bindBuffer(gl.ARRAY_BUFFER, this._squareVertexPositionBuffer);
			gl.vertexAttribPointer(this._shaderProgram.vertexPositionAttribute, this._squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
			this._setMatrixUniforms();
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, this._squareVertexPositionBuffer.numItems);
		};


		Renderer._initGL = function(canvas)
		{
			try
			{
				this._gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
				this._viewportSize.x = canvas.width;
				this._viewportSize.y = canvas.height;
			}
			catch (e)
			{
				console.error("Impossible d'initialiser le WebGL. Il est possible que votre navigateur ne supporte pas cette fonctionnalité.", e);
			}
		};


		Renderer._initShaders = function()
		{
			var gl = this._gl;
			var fragmentShader = this._getShader("shader-fs");
			var vertexShader = this._getShader("shader-vs");

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

			shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
			shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

			this._shaderProgram = shaderProgram;
		};


		Renderer._initBuffers = function()
		{
			var gl = this._gl;
			// TRIANGLE
			this._triangleVertexPositionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._triangleVertexPositionBuffer);

			var vertices = [
				0.0,  1.0,  0.0,
				-1.0, -1.0,  0.0,
				1.0, -1.0,  0.0
			];

			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			this._triangleVertexPositionBuffer.itemSize = 3;
			this._triangleVertexPositionBuffer.numItems = 3;

			// SQUARE
			this._squareVertexPositionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._squareVertexPositionBuffer);

			vertices = [
				1.0,  1.0,  0.0,
				-1.0,  1.0,  0.0,
				1.0, -1.0,  0.0,
				-1.0, -1.0,  0.0
			];

			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			this._squareVertexPositionBuffer.itemSize = 3;
			this._squareVertexPositionBuffer.numItems = 4;
		};

		Renderer._getShader = function(id)
		{
			var gl = this._gl;
			var shaderScript = document.getElementById(id);
			if (!shaderScript) {
				return null;
			}

			var str = "";
			var k = shaderScript.firstChild;
			while (k)
			{
				if (k.nodeType == k.TEXT_NODE)
				{
					str += k.textContent;
				}
				k = k.nextSibling;
			}

			var shader;
			if (shaderScript.type == "x-shader/x-fragment")
			{
				shader = gl.createShader(gl.FRAGMENT_SHADER);
			}
			else if (shaderScript.type == "x-shader/x-vertex")
			{
				shader = gl.createShader(gl.VERTEX_SHADER);
			}
			else return null;

			gl.shaderSource(shader, str);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
			{
				console.error(gl.getShaderInfoLog(shader));
				return null;
			}

			return shader;
		};

		Renderer._setMatrixUniforms = function ()
		{
			this._gl.uniformMatrix4fv(this._shaderProgram.pMatrixUniform, false, this._pMatrix);
			this._gl.uniformMatrix4fv(this._shaderProgram.mvMatrixUniform, false, this._mvMatrix);
		};

		Renderer._mvMatrix = null;
		Renderer._pMatrix = null;

		Renderer._triangleVertexPositionBuffer = null;
		Renderer._squareVertexPositionBuffer = null;

		Renderer._viewportSize = { x : 0.0, y : 0.0 };

		Renderer._gl = null;
		Renderer._shaderProgram = null;

		return Renderer;
	});