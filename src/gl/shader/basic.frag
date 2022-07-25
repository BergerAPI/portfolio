#version 300 es
precision mediump float;

out vec4 fout_color; in vec2 vout_position; in vec2 vout_uv;

uniform float time;

uniform vec2 mouse;
uniform vec2 mouseVelocity;

uniform float speed;
uniform float saturation;

uniform vec3 color0;
uniform vec3 mainColor;

uniform vec3 color1;
uniform float x1;
uniform float y1;
uniform float size1;

uniform vec3 color2;
uniform float x2;
uniform float y2;
uniform float size2;

vec3 f_saturation(vec3 rgb, float adjustment) {
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}

float gradientNoise(vec2 uv) {
    const vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
    return fract(magic.z * fract(dot(uv, magic.xy)));
}

void main() {
    vec2 vBackgroundPosition = (vout_uv - 0.5) * 2.;

    vec3 backgroundColor = color0;

    float ts = time * speed;
    backgroundColor = mix(mix(color1, vec3(1.), 0.), backgroundColor, smoothstep(0., 1., length(vBackgroundPosition - vec2(x1 * sin(ts + .5), y1 * cos(ts))) * size1));
    backgroundColor = mix(mix(color2, vec3(1.), 0.), backgroundColor, smoothstep(0., 1., length(vBackgroundPosition - vec2(x2 * sin(ts - 2.5), y2 * cos(ts))) * size2));

    fout_color = vec4(backgroundColor, 1.);
}