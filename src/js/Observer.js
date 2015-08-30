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
		}

		Observer.prototype.update = function(dt)
		{
			var speed = 10.0;
			var angularSpeed = 1.0;
			var m = this.transform.getMatrix();

			// LOOK
			m[12] = m[13] = m[14] = 0.0;
			var s = angularSpeed * dt;

			if (Keyboard.check([Keys.S]))
			{
				mat4.rotateX(m, m, s);
			}
			if (Keyboard.check(Keys.W) || Keyboard.check(Keys.Z))
			{
				mat4.rotateX(m, m, -s);
			}
			if (Keyboard.check([Keys.LEFT]))
			{
				mat4.rotateY(m, m, s);
			}
			if (Keyboard.check([Keys.RIGHT]))
			{
				mat4.rotateY(m, m, -s);
			}
			if (Keyboard.check(Keys.A) || Keyboard.check(Keys.Q))
			{
				mat4.rotateZ(m, m, s);
			}
			if (Keyboard.check([Keys.D]))
			{
				mat4.rotateZ(m, m, -s);
			}

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
			this._camera.set(45, device.width / device.height, 0.1, 100.0);
			var view = mat4.create();
			mat4.invert(view, this.transform.getMatrix());
			this._camera.setViewMatrix(view);
			this._camera.setViewport(0, 0, device.width, device.height);
		};

		Object.defineProperty(Observer.prototype, "camera", {
			get: function() { return this._camera; }
		});

		Observer.prototype._camera = null;

		return Observer;
	});