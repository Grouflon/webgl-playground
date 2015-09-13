if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Observer
 * ===================================*/
define([
		"engine/GameObject",
		"engine/Camera",
		"engine/input/Keyboard",
		"engine/utils/Keys"
	]
	, function (GameObject, Camera, Keyboard, Keys)
	{
		Observer.prototype = Object.create(GameObject.prototype);

		function Observer(x, y, z) {
			GameObject.call(this);

			this.transform.setPosition(x, y, z);
			this._camera = new Camera();

			this._pitchAcc = 1.0;
			this._pitchDamp = 0.9;
			this._pitchMaxSpeed = 3.0;

			this._yawAcc = 1.0;
			this._yawDamp = 0.9;
			this._yawMaxSpeed = 3.0;

			this._rollAcc = 1.5;
			this._rollDamp = 0.9;
			this._rollMaxSpeed = 4.0;
		}

		Observer.prototype.update = function(dt)
		{
			var speed = 10.0;
			var angularSpeed = 1.0;
			var m = this.transform.getMatrix();

			// LOOK
			m[12] = m[13] = m[14] = 0.0;
			var s = angularSpeed * dt;
			if (Keyboard.check([Keys.S]) || Keyboard.check(Keys.DOWN))
			{
				this._pitchSpeed += this._pitchAcc*dt;
			}
			if (Keyboard.check(Keys.W) || Keyboard.check(Keys.Z) || Keyboard.check(Keys.UP))
			{
				this._pitchSpeed -= this._pitchAcc*dt;
			}
			if (Keyboard.check([Keys.LEFT]))
			{
				this._yawSpeed += this._yawAcc*dt;
			}
			if (Keyboard.check([Keys.RIGHT]))
			{
				this._yawSpeed -= this._yawAcc*dt;
			}
			if (Keyboard.check(Keys.A) || Keyboard.check(Keys.Q))
			{
				this._rollSpeed += this._rollAcc*dt;
			}
			if (Keyboard.check([Keys.D]))
			{
				this._rollSpeed -= this._rollAcc*dt;
			}

			this._pitchSpeed -= this._pitchSpeed*this._pitchDamp*dt;
			this._pitchSpeed = Math.min(this._pitchSpeed, this._pitchMaxSpeed);
			mat4.rotateX(m, m, this._pitchSpeed * dt);

			this._yawSpeed -= this._yawSpeed*this._yawDamp*dt;
			this._yawSpeed = Math.min(this._yawSpeed, this._yawMaxSpeed);
			mat4.rotateY(m, m, this._yawSpeed * dt);

			this._rollSpeed -= this._rollSpeed*this._rollDamp*dt;
			this._rollSpeed = Math.min(this._rollSpeed, this._rollMaxSpeed);
			mat4.rotateZ(m, m, this._rollSpeed * dt);

			// MOVE
			var p = this.transform.getPosition();
			m[12] = p[0];
			m[13] = p[1];
			m[14] = p[2];

			var t = vec3.fromValues(0, 0, -speed*dt);
			mat4.translate(m, m, t);

			/*if (Keyboard.check([Keys.W]))
			{
				var t = vec3.fromValues(0, 0, -speed*dt);
				mat4.translate(m, m, t);
			}
			if (Keyboard.check([Keys.S]))
			{
				var t = vec3.fromValues(0, 0, speed*dt);
				mat4.translate(m, m, t);
			}*/
			this.transform.setMatrix(m);

			// UPDATE CAMERA
			this._camera.set(45, device.width / device.height, 0.1, 1000.0);
			var view = mat4.create();
			mat4.invert(view, this.transform.getMatrix());
			this._camera.setViewMatrix(view);
			this._camera.setViewport(0, 0, device.width, device.height);
		};

		Object.defineProperty(Observer.prototype, "camera", {
			get: function() { return this._camera; }
		});

		Observer.prototype._camera = null;
		Observer.prototype._pitchSpeed = 0.0;
		Observer.prototype._pitchAcc = 0.0;
		Observer.prototype._pitchDamp = 0.0;
		Observer.prototype._pitchMaxSpeed = 0.0;
		Observer.prototype._yawSpeed = 0.0;
		Observer.prototype._yawAcc = 0.0;
		Observer.prototype._yawDamp = 0.0;
		Observer.prototype._yawMaxSpeed = 0.0;
		Observer.prototype._rollSpeed = 0.0;
		Observer.prototype._rollAcc = 0.0;
		Observer.prototype._rollDamp = 0.0;
		Observer.prototype._rollMaxSpeed = 0.0;

		return Observer;
	});