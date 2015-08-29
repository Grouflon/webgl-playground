attribute vec3 aPosition;
attribute vec4 aColor;
attribute vec2 aTexCoord;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;

varying vec4 vColor;
varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = uModel * uView * uProj * vec4(aPosition, 1.0);
    vColor = aColor;
    vTextureCoord = aTexCoord;
}