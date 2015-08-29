precision mediump float;

uniform vec2 uScreenSize;
uniform sampler2D uSampler;

vec4 pixelSample(vec2 screenPos)
{
	const float xStep = 8.0;
	float xMod = mod(screenPos.x, xStep);
	float xLo = screenPos.x - xMod;
	float xHi = xLo + xStep;

	const float yStep = 11.0;
	float yMod = mod(screenPos.y, yStep);
    float yLo = screenPos.y - yMod;
    float yHi = yLo + yStep;

	vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
	for (float x = 0.0; x < xStep; ++x)
	for (float y = 0.0; y < yStep; ++y)
	{
		color += texture2D(uSampler, vec2(xLo + x, yLo + y) / uScreenSize);
	}
	color /= xStep*yStep;
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