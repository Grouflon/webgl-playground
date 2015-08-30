attribute vec3 aPosition;
attribute vec4 aColor;
//attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;

uniform vec3 uAmbientColor;
uniform vec3 uLightColor;
uniform vec3 uLightDirection;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

void main(void)
{
    gl_Position = uProj* uView * uModel * vec4(aPosition, 1.0);
    vColor = aColor;
//    vTextureCoord = aTexCoord;

    vec4 transformedNormal = uModel * vec4(aNormal, 1.0);
    float directionalLightWeighting = max(dot(transformedNormal.xyz, uLightDirection), 0.0);
    vLightWeighting = uAmbientColor + uLightColor*directionalLightWeighting;
}