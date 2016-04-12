attribute vec3 aPosition;
attribute vec4 aColor;
attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;

uniform vec3 uAmbientColor;
uniform vec3 uLightColor;
uniform vec3 uLightDirection;

varying vec4 vColor;
varying vec2 vTexCoord;
varying vec3 vLightWeighting;

void main(void)
{
	mat4 mv = uView * uModel;
	vec4 mvPosition = mv * vec4(aPosition, 1.0);
    gl_Position = uProj * mvPosition;
    vColor = aColor;
	vTexCoord = aTexCoord;

    vec4 transformedNormal = normalize(uModel * vec4(aNormal, 0.0));
    vec4 transformedLightDirection = normalize(vec4(uLightDirection, 1.0));


    float directionalLightWeighting = max(dot(transformedNormal.xyz, transformedLightDirection.xyz), 0.0);
    vLightWeighting = (uAmbientColor + uLightColor*directionalLightWeighting);
}