#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// original by @xordev
void main () {
  vec2 st = gl_FragCoord.xy;
  float w = u_resolution.x;
  float h = u_resolution.y;

  vec2 p = (2.0 * st - u_resolution) / h;
  float q = (0.01 * sin(u_time) * h) / (2. * (st.x - st.y) + h - w);
  float m = abs(sqrt(p.x * p.x + p.y * p.y) - abs(sin(u_time)) / 2. + q);

  float s = 0.1 * abs(sin(u_time)) / m;

  gl_FragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0), s);
}
