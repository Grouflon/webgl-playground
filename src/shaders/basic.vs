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
uniform vec3 uLightDirection;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

void main(void)
{
	mat4 mv = uView * uModel;
    gl_Position = uProj* mv * vec4(aPosition, 1.0);
    vColor = aColor;
//    vTextureCoord = aTexCoord;

    //vec3 transformedNormal = uNormal * aNormal;
    vec4 transformedNormal = mv * vec4(aNormal, 0.0);
    vec4 transformedLightDirection = mv * vec4(uLightDirection, 0.0);
    float directionalLightWeighting = max(dot(transformedNormal.xyz, transformedLightDirection.xyz), 0.0);
    vLightWeighting = uAmbientColor + uLightColor*directionalLightWeighting;
}