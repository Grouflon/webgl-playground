precision mediump float;

varying vec4 vColor;
//varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

uniform sampler2D uSampler;

void main(void)
{
    //gl_FragColor = vColor * texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = vec4(vColor.rgb * vLightWeighting, vColor.a);
}