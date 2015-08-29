if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
/* ===================================
 * FileUtils
 * ===================================*/
define([
	]
	, function ()
	{
		return {
			loadFile: function(url, async, success, failure)
			{
				var xhr = new XMLHttpRequest();
				xhr.open("GET", url, async);
				xhr.onreadystatechange = function () {
					// If the request is "DONE" (completed or failed)
					if (xhr.readyState == 4) {
						// If we got HTTP status 200 (OK)
						if (xhr.status == 200) {
							success(xhr.responseText)
						} else { // Failed
							failure(xhr.responseText, xhr.status);
						}
					}
				};
				xhr.send();
			}
		};
	});