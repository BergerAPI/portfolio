#version 300 es
precision mediump float;

#define SRGB_TO_LINEAR(c) pow(c, vec3(2.2))
#define LINEAR_TO_SRGB(c) pow(c, vec3(1.0 / 2.2))

out vec4 fout_color;
in vec2 vout_position;
in vec2 vout_uv;

uniform float time;

uniform float speed;
uniform float saturation;

uniform vec3 color0;

uniform vec3 color1;
uniform float x1;
uniform float y1;
uniform float size1;

uniform float x2;
uniform float y2;
uniform float size2;

uniform float x3;
uniform float y3;
uniform float size3;

uniform float x4;
uniform float y4;
uniform float size4;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 f_saturation(vec3 rgb, float adjustment)
{
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}

float gradientNoise(vec2 uv)    {    
    const vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);    
    return fract(magic.z * fract(dot(uv, magic.xy)));    
}    

// vec3 addGrain(vec3 color, float strength) {    
//     float x = (    vout_uv.x + 4.0 ) * (    vout_uv.y + 4.0 ) * (time * 10.0);    
//     vec3 cgrain = vec3(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01)-0.005) * grain;    
//     cgrain = 1.0 - cgrain;    
//     // return color * cgrain;    
//     return mix( color, vec3(gradientNoise(vout_position.xy)), strength/100.);    
// }

void main() {
    vec2 vBackgroundPosition = (    vout_uv - 0.5) * 2.;

    vec3 backgroundColor = hsv2rgb(color0);

    float ts = time * speed;
    backgroundColor = mix( mix( hsv2rgb(color1), vec3(1.), 0. ), backgroundColor, smoothstep( 0., 1., length( vBackgroundPosition - vec2( x1 * sin( (ts + .5) * 1. ), y1 * cos( (ts + .0) * 1. ) ) ) * size1 ));
    backgroundColor = mix( mix( hsv2rgb(vec3(.55556, 0.114, 1)), vec3(1.), 0. ), backgroundColor, smoothstep( 0., 1., length( vBackgroundPosition - vec2( x2 * sin( (ts + .0) * 1. ), y2 * cos( (ts + .0) * 1. ) ) ) * size2 ));
    backgroundColor = abs(1. * 0. - mix( mix( hsv2rgb(vec3(.0958, 0.114, .95)), vec3(1.), 0. ), backgroundColor, smoothstep( 0., 1., length( vBackgroundPosition - vec2( x3 * sin( (ts + 0.) * 1. ), y3 * cos( (ts + 0.) * 1. ) ) ) * size3 )));
    backgroundColor = abs(1. * 0. - mix( mix( hsv2rgb(vec3(.02, 0.5151, .647)), vec3(1.), 0. ), backgroundColor, smoothstep( 0., 1., length( vBackgroundPosition - vec2( x4 * sin( (ts + .0) * 1. ), y4 * cos( (ts + .0) * 1. ) ) ) * size4 )));
    backgroundColor = mix( mix( hsv2rgb(vec3(.0, .0, 1.)), vec3(1.), 0. ), backgroundColor, smoothstep( 0., 1., length( vBackgroundPosition - vec2( -(x4 - .2) * sin( (ts + .0) * 1. ), -(y4 - .2) * cos( (ts + .0) * 1. ) ) ) * 0.5 ));

   
    backgroundColor = f_saturation(backgroundColor, saturation);
    backgroundColor = backgroundColor + vec3(-.07);

    backgroundColor = backgroundColor + ( (1.0/255.0) * gradientNoise(vout_position.xy) );

    gl_FragColor = vec4(backgroundColor, 1.);
}