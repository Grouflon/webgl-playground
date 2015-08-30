precision highp float;

uniform vec2 uScreenSize;
uniform sampler2D uSampler;
uniform sampler2D uAsciiSampler;


const float xStep = 8.0;
const float yStep = 11.0;
const float rampCharCount = 70.0;
const vec2 rampSize = vec2(560.0, 11.0);
const vec2 rampTexSize = vec2(1024.0, 16.0);

vec4 pixelSample(vec2 screenPos)
{
	float xMod = mod(screenPos.x, xStep);
	float xLo = screenPos.x - xMod;
	float xHi = xLo + xStep;

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

float grayify(vec4 color)
{
	float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
	return gray;
}

vec4 asciify(float gray, vec2 cellPosition)
{
	float charPos = floor(rampCharCount - gray * rampCharCount);
	return texture2D(uAsciiSampler, vec2(
		(charPos*xStep + cellPosition.x) / rampTexSize.x,
		(rampTexSize.y - cellPosition.y) / rampTexSize.y
		)
	);
}

void main(void)
{
	gl_FragColor = texture2D(uSampler, gl_FragCoord.xy / uScreenSize);
	vec4 pixelColor = pixelSample(gl_FragCoord.xy);
	float gray = grayify(pixelColor);
	gl_FragColor = asciify(gray, mod(gl_FragCoord.xy, vec2(xStep, yStep)));
	gl_FragColor *= vec4(0.3, 1.0, 0.5, 1.0);
}