precision mediump float;

varying vec4 vColor;
varying vec2 vTexCoord;
varying vec3 vLightWeighting;

uniform sampler2D uSampler;

void main(void)
{
    gl_FragColor = vec4(vColor.rgb * vLightWeighting, vColor.a) * texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
}