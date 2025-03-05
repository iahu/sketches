#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// Raymarching 参数
#define MAX_STEPS 100
#define SURFACE_DIST 0.01
#define MAX_DIST 5.0

// Metaball 场计算
float metaball(vec3 p, vec3 center, float radius) {
    float d = length(p - center);
    return radius * radius / d;
}

// 距离场函数
float map(vec3 p) {
    float field = 0.0;
    field += metaball(p, vec3(sin(u_time) * 0.5, cos(u_time) * 0.5, 0.5), 0.2);
    field += metaball(p, vec3(-0.5 * cos(u_time * 2.0), -0.5, 0.5), 0.3);
    return 0.5 - field;
}

// 光线步进
float raymarch(vec3 ro, vec3 rd) {
    float t = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + t * rd;
        float d = map(p);
        if (d < SURFACE_DIST) return t;
        if (t > MAX_DIST) break;
        t += d;
    }
    return -1.0;
}

// 计算法线
vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.01, 0.0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    ));
}

// 主要渲染逻辑
void main() {
    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / u_resolution.y;
    vec3 ro = vec3(0.0, 0.0, -2.0); // 观察者位置
    vec3 rd = normalize(vec3(uv, 1.0)); // 视线方向

    float t = raymarch(ro, rd);
    vec3 col = vec3(0.0);

    if (t > 0.0) {
        vec3 p = ro + t * rd;
        vec3 n = getNormal(p);
        float light = dot(n, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;
        col = mix(vec3(0.2, 0.3, 0.8), vec3(1.0), light);
    }

    gl_FragColor = vec4(col, 1.0);
}
