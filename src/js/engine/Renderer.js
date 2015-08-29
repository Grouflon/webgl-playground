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