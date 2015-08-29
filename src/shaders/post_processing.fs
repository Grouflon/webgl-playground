precision mediump float;

varying vec2 vTexCoord;

uniform vec2 uScreenSize;
uniform sampler2D uSampler;

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTexCoord);
    //gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}