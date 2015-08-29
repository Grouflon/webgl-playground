precision mediump float;

uniform vec2 uScreenSize;
uniform sampler2D uSampler;

void main(void)
{

    gl_FragColor = texture2D(uSampler, gl_FragCoord.xy / uScreenSize);
    //gl_FragColor = vec4(vTexCoord.s, vTexCoord.t, 1.0, 1.0);
}