if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Device
 * ===================================*/
define([
		"Renderer"
	]
	, function (Renderer)
	{
		function Device(canvas, fsId, vsId)
		{
			console.log("Device created");
			this._renderer = new Renderer(canvas, fsId, vsId);
		}

		Device.prototype.start = function() {
			console.log("Device started");
			this._running = true;

			var loop = function ()
			{
				this.update();
				this._renderer.clear();
				this.draw();
				if (this._running) requestAnimationFrame(loop);
			}.bind(this);

			loop();
		};

		Device.prototype.stop = function() {
			this._running = false;
		};

		Device.prototype.update = function() {

		};

		Device.prototype.draw = function() {

		};

		Object.defineProperty(Device.prototype, "renderer", {
			get : function() { return this._renderer; }
		});

		Device.prototype._renderer = null;
		Device.prototype._running = false;

		return Device;
	});