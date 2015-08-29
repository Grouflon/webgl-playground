precision mediump float;

attribute vec2 aPosition;

uniform vec2 uScreenSize;

void main(void)
{
    gl_Position = vec4(aPosition * uScreenSize, 0, 1.0);
}