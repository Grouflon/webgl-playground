if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Renderer
 * ===================================*/
define([
	]
	, function ()
	{
		function Renderer(canvas)
		{
			console.log("Renderer created");
			this._matrixStack = [mat4.create()];
			this._viewMatrix = mat4.create();
			this._projMatrix = mat4.create();

			try
			{
				this._gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
				console.log("Renderer initialized");
			}
			catch (e)
			{
				console.error("Impossible d'initialiser le WebGL. Il est possible que votre navigateur ne supporte pas cette fonctionnalité.", e);
			}

			this._gl.clearColor(0.2, 0.2, 0.2, 1.0);
		}

		Renderer.prototype.identity = function()                            { mat4.identity(this._currentMatrix); };
		Renderer.prototype.translate = function(x, y, z)                    { mat4.translate(this._currentMatrix, [x, y, z]); };
		Renderer.prototype.rotate = function(radAngle, axis)                { mat4.rotate(this._currentMatrix, radAngle, axis); };
		Renderer.prototype.scale = function(x, y, z)                        { mat4.scale(this._currentMatrix, x, y, z); };

		Renderer.prototype.pushMatrix = function()
		{
			this._matrixStack.unshift(mat4.create(this._currentMatrix));
		};

		Renderer.prototype.popMatrix = function()
		{
			if (this._matrixStack.length > 1)
				this._matrixStack.shift();
			else
				console.error("Renderer error: Can't empty stack.");
		};

/*
		Renderer.prototype.draw = function(renderContext)
		{
			var gl = this._gl;

			gl.bindBuffer(gl.ARRAY_BUFFER, renderContext.vertexBuffer);
			gl.vertexAttribPointer(this._glShaderProgram.vertexPositionAttribute, renderContext.vertexSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, renderContext.colorBuffer);
			gl.vertexAttribPointer(this._glShaderProgram.vertexColorAttribute, renderContext.colorSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, renderContext.textureCoordBuffer);
			gl.vertexAttribPointer(this._glShaderProgram.textureCoordAttribute, renderContext.textureCoordSize, gl.FLOAT, false, 0, 0);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, renderContext.texture.glTexture);
			gl.uniform1i(this._glShaderProgram.samplerUniform, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, renderContext.indexBuffer);

			gl.uniformMatrix4fv(this._glShaderProgram.pMatrixUniform, false, this._stacks[Renderer.MatrixMode.PROJECTION][0]);
			gl.uniformMatrix4fv(this._glShaderProgram.mvMatrixUniform, false, this._stacks[Renderer.MatrixMode.MODELVIEW][0]);

			gl.drawElements(renderContext.mode, renderContext.size, gl.UNSIGNED_SHORT, 0);
		};
		*/

		Renderer.prototype.clear = function()
		{
			this._gl.clear(this._gl.COLOR_BUFFER_BIT| this._gl.DEPTH_BUFFER_BIT);
		};

		Object.defineProperty(Renderer.prototype, "gl", {
			get: function() { return this._gl; }
		});

		Object.defineProperty(Renderer.prototype, "_currentMatrix", {
			get: function() { return this._matrixStack[this._matrixMode][0]; }
		});

		Renderer.prototype._gl = null;
		Renderer.prototype._matrixStack = null;

		return Renderer;
	});