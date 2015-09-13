if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * LandscapeController
 * ===================================*/
define([
		"engine/GameObject",
		"Box"
	]
	, function (GameObject, Box)
	{
		LandscapeController.prototype = Object.create(GameObject.prototype);

		function LandscapeController() {
			GameObject.call(this);

			this._topBoxes = [];
			this._bottomBoxes = [];
			this._boxPool = [];
			this._range = 10;
			this._boxSize = 12.0;
			this._landscapeAmplitude = 40.0;
			this._boxMinHeight = 2.0;
			this._boxMaxHeight = 24.0;
			this._observerCenter = [0, 0];
			this._center = [0, 0];
		}

		LandscapeController.prototype.update = function(dt)
		{
			if (!observer) return;

			var width = this._range*2;
			this._observerCenter = [
				Math.floor(observer.transform.getPosition()[0] / this._boxSize),
				Math.floor(observer.transform.getPosition()[2] / this._boxSize)
			];
			if (this._firstUpdate)
			{
				vec2.copy(this._center, this._observerCenter);
				this._topBoxes.length = width*width;
				this._bottomBoxes.length = width*width;
				for(var x = 0; x < width; ++x)
				for(var z = 0; z < width; ++z)
				{
					this._createBox(x, z, true);
					this._createBox(x, z, false);
				}

				this._firstUpdate = false;
			}

			var dx = this._observerCenter[0] - this._center[0];
			var dz = this._observerCenter[1] - this._center[1];
			if (dx != 0 || dz != 0)
			{
				if (dx != 0)
				{
					for(var x = 0; x < width; ++x)
					for(var z = 0; z < width; ++z)
					{
						var cur;
						if (dx > 0)
						{
							cur = x;
						}
						else
						{
							cur = width - 1 - x;
						}
						var to = cur - dx;

						if (to < 0 || to >= width)
						{
							this._removeBoxes(cur, z);
						}
						else
						{
							this._topBoxes[to*width + z] = this._topBoxes[cur*width + z];
							this._topBoxes[cur*width + z] = null;
							this._bottomBoxes[to*width + z] = this._bottomBoxes[cur*width + z];
							this._bottomBoxes[cur*width + z] = null;
						}
					}
				}

				if (dz != 0)
				{
					for(var x = 0; x < width; ++x)
					for(var z = 0; z < width; ++z)
					{
						var cur;
						if (dz > 0)
						{
							cur = z;
						}
						else
						{
							cur = width - 1 - z;
						}
						var to = cur - dz;

						if (to < 0 || to >= width)
						{
							//console.log(x, cur);
							this._removeBoxes(x, cur);
						}
						else
						{
							this._topBoxes[x*width + to] = this._topBoxes[x*width + cur];
							this._topBoxes[x*width + cur] = null;
							this._bottomBoxes[x*width + to] = this._bottomBoxes[x*width + cur];
							this._bottomBoxes[x*width + cur] = null;
						}
					}
				}

				vec2.copy(this._center, this._observerCenter);
				for(var x = 0; x < width; ++x)
				for(var z = 0; z < width; ++z)
				{
					if (!this._topBoxes[x*width + z])
					{
						this._createBox(x, z, true);
						this._createBox(x, z, false);
					}
				}
			}
		};

		LandscapeController.prototype._createBox = function(x, z, top)
		{
			var boxX = this._center[0] - this._range + x;
			var boxZ = this._center[1] - this._range + z;
			var box = null;
			if (this._boxPool.length)
			{
				box = this._boxPool.pop();
				Box.call(box,
						boxX*this._boxSize,
						top ? this._landscapeAmplitude*0.5 : -this._landscapeAmplitude*0.5,
						boxZ*this._boxSize,
						this._boxSize,
						Math.random()*(this._boxMaxHeight - this._boxMinHeight) + this._boxMinHeight,
						this._boxSize
				);
			}
			else
			{
				box = new Box(
						boxX*this._boxSize,
						top ? this._landscapeAmplitude*0.5 : -this._landscapeAmplitude*0.5,
						boxZ*this._boxSize,
						this._boxSize,
						Math.random()*(this._boxMaxHeight - this._boxMinHeight) + this._boxMinHeight,
						this._boxSize
				);
			}
			(top ? this._topBoxes : this._bottomBoxes)[x*this._range*2 + z] = box;
			box.load();
			device.addGameObject(box);
			return box;
		};

		LandscapeController.prototype._removeBoxes = function(x, z)
		{
			var box = this._topBoxes[x*this._range*2 + z];
			if (box)
			{
				box.release();
				device.removeGameObject(box);
				this._boxPool.push(box);
				this._topBoxes[x*this._range*2 + z] = null;
			}

			box = this._bottomBoxes[x*this._range*2 + z];
			if (box)
			{
				box.release();
				device.removeGameObject(box);
				this._boxPool.push(box);
				this._bottomBoxes[x*this._range*2 + z] = null;
			}
		};

		LandscapeController.prototype._topBoxes = null;
		LandscapeController.prototype._bottomBoxes = null;
		LandscapeController.prototype._boxPool = null;
		LandscapeController.prototype._range = 0.0;
		LandscapeController.prototype._boxSize = 0.0;
		LandscapeController.prototype._landscapeAmplitude = 0.0;
		LandscapeController.prototype._boxMinHeight = 0.0;
		LandscapeController.prototype._boxMaxHeight = 0.0;
		LandscapeController.prototype._center = null;
		LandscapeController.prototype._observerCenter = null;

		LandscapeController.prototype._firstUpdate = true;

		return LandscapeController;
	});