if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Device
 * ===================================*/
define([
		"engine/Renderer"
	]
	, function (Renderer)
	{
		function Device(canvas)
		{
			this._renderer = new Renderer(canvas);
			this._gameObjects = [];
			this._removedGameObjects = [];
			console.log("Device created");
		}

		Device.prototype.start = function() {
			this._running = true;
			this._lastFrameTime = Date.now();

			var loop = function ()
			{
				this.update();
				if (this._running) requestAnimationFrame(loop);
			}.bind(this);

			console.log("Device started");
			loop();
		};

		Device.prototype.stop = function() {
			this._running = false;
		};

		Device.prototype.update = function() {
			var thisFrameTime = Date.now();
			this._elapsed = thisFrameTime - this._lastFrameTime;
			this._elapsed *= 0.001;
			this._lastFrameTime = thisFrameTime;

			// UPDATE
			this._gameObjects.forEach(function(element) {
				element.update(this._elapsed);
			}.bind(this));

			// DRAW
			this._renderer.clear();
			this._gameObjects.forEach(function(element) {
				element.draw(this.renderer.gl);
			}.bind(this));

			// CLEAN
			while (this._removedGameObjects.length)
			{
				var gameObject = this._removedGameObjects.shift();
				var i = this._gameObjects.indexOf(gameObject);
				if (i >= 0)
				{
					this._gameObjects.splice(i, 1);
				}
			}
		};

		Device.prototype.addGameObject = function(gameObject) {
			this._gameObjects.push(gameObject);
		};

		Device.prototype.removeGameObject = function(gameObject) {
			this._removedGameObjects.push(gameObject);
		};

		Object.defineProperty(Device.prototype, "renderer", {
			get : function() { return this._renderer; }
		});

		Device.prototype._renderer = null;

		Device.prototype._gameObjects = null;
		Device.prototype._removedGameObjects = null;
		Device.prototype._running = false;
		Device.prototype._lastFrameTime = 0;
		Device.prototype._elapsed = 0;

		return Device;
	});