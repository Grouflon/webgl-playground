if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * MobileBox
 * ===================================*/
define([
		"Box"
	]
	, function (Box)
	{
		MobileBox.prototype = Object.create(Box.prototype);

		function MobileBox(position, size, color) {
			Box.call(this,
				position[0],
				position[1],
				position[2],
				size, size, size,
				color);

			this._direction = [0.0, 0.0];
		}

		MobileBox.prototype.setDirection = function(direction)
		{
			this._direction = direction;
		};

		MobileBox.prototype.update = function(dt)
		{
			var dir = [this._direction[0], 0.0, -this._direction[1]];
			var dirNorm = vec3.len(dir);
			if (dirNorm > 0.001)
			{
				var desiredRotation = quat.create();
				quat.rotationTo(desiredRotation, [1.0, 0.0, 0.0], dir);
				var actualRotation = this.transform.getRotation();

				var outRotation = quat.create();
				quat.slerp(outRotation, actualRotation, desiredRotation, this._angularSmooth);
				this.transform.setRotation(outRotation);

				this._velocity = (this._linearSmooth * this._maxLinearVelocity) + ((1 - this._linearSmooth) * this._velocity);
			}
			else
			{
				this._velocity = ((1 - this._linearSmooth) * this._velocity);
			}

			var t = this.transform.getPosition();
			var front = this.transform.front;
			vec3.scale(front, front, this._velocity * dt);

			vec3.add(t, t, front);
			this.transform.setPosition(t);
		};

		MobileBox.prototype._direction = null;
		MobileBox.prototype._velocity = 0.0;
		MobileBox.prototype._linearSmooth = 0.5;
		MobileBox.prototype._angularSmooth = 0.1;
		MobileBox.prototype._maxLinearVelocity = 10.0;

		return MobileBox;
	});