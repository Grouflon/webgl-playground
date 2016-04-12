if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Mouse
 * ===================================*/
define([
]
	, function () {
        var Mouse = {};

        /**** PUBLIC ****/

        Object.defineProperty( Mouse, "position", { get: function () { return [].concat(this._position); }});
        Object.defineProperty( Mouse, "hasMoved", { get: function () { return this._hasMoved; }});
        Object.defineProperty( Mouse, "hasBeenPressed", { get: function () { return this._hasBeenPressed; }});
        Object.defineProperty( Mouse, "hasBeenReleased", { get: function () { return this._hasBeenReleased; }});
        Object.defineProperty( Mouse, "isDown", { get: function () { return this._isDown; } });
        // TODO : right click events


		Mouse.init = function(canvas)
		{
			this._hasMoved = false;
			this._hasBeenPressed = false;
			this._hasBeenReleased = false;
			this._isDown = false;

			this._canvas = canvas;

			// Binding Events
			addEventListener('mousemove', this._onMove.bind(this));
			addEventListener('mousedown', this._onPressed.bind(this));
			addEventListener('mouseup', this._onReleased.bind(this));
		};


		Mouse.reset = function()
		{
			this._hasMoved = false;
			this._hasBeenPressed = false;
			this._hasBeenReleased = false;
		};


        /**** PRIVATE ****/

		Mouse._onMove = function(event)
        {
            this._position[0] = this.x = event.clientX - this._canvas.offsetLeft;
            this._position[1] = this.y = event.clientY - this._canvas.offsetTop;
			this._hasMoved = true;
		};


		Mouse._onPressed = function(event)
        {
			this._isDown = true;
			this._hasBeenPressed = true;
		};


		Mouse._onReleased = function(event)
        {
			this._isDown = false;
			this._hasBeenReleased = true;
		};


        Mouse._position = [0, 0];
        Mouse._hasMoved = false;
        Mouse._hasBeenPressed = false;
        Mouse._hasBeenReleased = false;
        Mouse._isDown = false;
        Mouse._canvas = null;

		return Mouse;
	});