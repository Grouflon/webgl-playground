attribute vec3 aPosition;
attribute vec4 aColor;
//attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;
uniform mat3 uNormal;

uniform vec3 uAmbientColor;
uniform vec3 uLightColor;
uniform vec3 uLightPosition;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

void main(void)
{
	mat4 mv = uView * uModel;
	vec4 boxPosition = mv * vec4(0.0, 0.0, 0.0, 1.0);
	vec4 mvPosition = mv * vec4(aPosition, 1.0);
    gl_Position = uProj * mvPosition;
    vColor = aColor;
//    vTextureCoord = aTexCoord;

    vec4 transformedNormal = normalize(mv * vec4(aNormal, 0.0));
    vec4 transformedLightDirection = normalize((uView * vec4(uLightPosition, 1.0)) - boxPosition);


    float directionalLightWeighting = max(dot(transformedNormal.xyz, transformedLightDirection.xyz), 0.0);
    float maxLength = 11.0;
    vLightWeighting = (uAmbientColor + uLightColor*directionalLightWeighting) * max(-length(boxPosition.xyz)/pow(maxLength, 2.0) + 1.0, 0.0);
}