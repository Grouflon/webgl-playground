if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * Texture
 * ===================================*/
define([
	]
	, function ()
	{
		function Texture(gl, image) {
			var glTexture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, glTexture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.bindTexture(gl.TEXTURE_2D, null);

			this._glTexture = glTexture;
		}


		Object.defineProperty(Texture.prototype, "glTexture", {
			get : function() { return this._glTexture; }
		});

		Texture.prototype._glTexture = null;

		return Texture;
	});