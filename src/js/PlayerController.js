if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Main
 * ===================================*/
define([
		"engine/GameObject",
		"engine/input/Keyboard",
		"engine/input/Mouse",
		"engine/utils/Keys"
	]
	, function (GameObject, Keyboard, Mouse, Keys)
	{
		PlayerController.prototype = Object.create(GameObject.prototype);

		function PlayerController()
		{
			GameObject.call(this);
			this._desiredCameraAngles = [0.0, 0.0];
			this._cameraAngles = [0.0, 0.0];
			this._previousMousePosition = Mouse.position;
		}

		PlayerController.prototype.update = function(dt)
		{
			// CAMERA
			var mousePosition = Mouse.position;
			var mouseDelta = [
				mousePosition[0] - this._previousMousePosition[0],
				mousePosition[1] - this._previousMousePosition[1]
			];

			this._desiredCameraAngles[0] -= mouseDelta[0] / this._sensitivity;
			this._desiredCameraAngles[1] -= mouseDelta[1] / this._sensitivity;
			this._desiredCameraAngles[1] = Math.max(Math.min(this._desiredCameraAngles[1], this._maxXAngle * Math.PI / 180.0), this._minXAngle * Math.PI / 180.0);
			this._cameraAngles[0] = (this._smooth * this._desiredCameraAngles[0]) + ((1.0 - this._smooth) * this._cameraAngles[0]);
			this._cameraAngles[1] = (this._smooth * this._desiredCameraAngles[1]) + ((1.0 - this._smooth) * this._cameraAngles[1]);

			var q = quat.create();
			quat.rotateY(q, q, this._cameraAngles[0]);
			quat.rotateX(q, q, this._cameraAngles[1]);
			var v = [0.0, this._cameraDistance, 0.0];
			vec3.transformQuat(v, v, q);
			var m = mat4.create();
			var p = this._target.transform.getPosition();
			vec3.add(v, v, p);
			vec3.add(p, p, [0.0, this._cameraHeight, 0.0]);
			mat4.lookAt(m, v, p, [0.0, 1.0, 0.0]);
			camera.setViewMatrix(m);

			// MOVEMENT
			if (this._target)
			{
				var direction = [0.0, 0.0];
				if (Keyboard.check([Keys.W]) || Keyboard.check([Keys.Z]))
				{
					direction[0] += 1.0;
				}
				if (Keyboard.check([Keys.A]) || Keyboard.check([Keys.Q]))
				{
					direction[1] += 1.0;
				}
				if (Keyboard.check([Keys.D]))
				{
					direction[1] -= 1.0;
				}
				if (Keyboard.check([Keys.S]))
				{
					direction[0] -= 1.0;
				}
				var m2 = mat2d.create();
				mat2d.rotate(m2, m2, this._desiredCameraAngles[0]);
				vec2.normalize(direction, direction);
				vec2.transformMat2d(direction, direction, m2);
				this._target.setDirection(direction);
			}

			this._previousMousePosition = mousePosition;
		};

		PlayerController.prototype.setTarget = function(target)
		{
			this._target = target;
		};

		PlayerController.prototype._target = null;

		PlayerController.prototype._smooth = 0.4;
		PlayerController.prototype._cameraDistance = 7.0;
		PlayerController.prototype._cameraHeight = 1.0;
		PlayerController.prototype._sensitivity = 200.0;
		PlayerController.prototype._maxXAngle = 85.0;
		PlayerController.prototype._minXAngle = 0.0;

		PlayerController.prototype._previousMousePosition = null;
		PlayerController.prototype._desiredCameraAngles = null;
		PlayerController.prototype._cameraAngles = null;

		return PlayerController;
	});