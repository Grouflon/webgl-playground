precision mediump float;

uniform vec2 uScreenSize;
uniform sampler2D uSampler;

vec4 pixelSample(vec2 screenPos)
{
	const float step = 10.0;
	float xMod = mod(screenPos.x, step);
	float xLo = screenPos.x - xMod;
	float xHi = xLo + step;

	float yMod = mod(screenPos.y, step);
    float yLo = screenPos.y - yMod;
    float yHi = yLo + step;

	vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
	for (float x = 0.0; x < step; ++x)
	for (float y = 0.0; y < step; ++y)
	{
		color += texture2D(uSampler, vec2(xLo + x, yLo + y) / uScreenSize);
	}
	color /= step*step;
    return color;
}

vec4 grayify(vec4 color)
{
	float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
	return vec4(gray, gray, gray, color.a);
}

void main(void)
{
	gl_FragColor = grayify(pixelSample(gl_FragCoord.xy));
    //gl_FragColor = vec4(vTexCoord.s, vTexCoord.t, 1.0, 1.0);
}