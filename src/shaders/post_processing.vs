precision mediump float;

attribute vec2 aPosition;

uniform vec2 uScreenSize;
varying vec2 vTexCoord;

void main(void)
{
    gl_Position = vec4(aPosition, 0.0, 1.0) * vec4(uScreenSize, 0.0, 1.0);
    vTexCoord = aPosition;
}