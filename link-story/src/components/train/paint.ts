/**
 * Car livery drawn in the fragment shader from object-space position + normal:
 * white clear-coated body, orange belt stripes, dark tinted glazing with a lit
 * ceiling strip, plug doors with grooves and split lines, cab mask in amber with
 * a three-pane windscreen, LED destination sign, head/tail lights, side decal.
 * Anti-aliased with fwidth so edges stay crisp at any distance.
 */
import * as THREE from "three";
import { NOSE } from "./body";

export type PaintOpts = {
  L: number;
  nose: boolean;
  tail: boolean;
  doors: [number, number, number, number];
  sign: THREE.Texture | null;
  decal: THREE.Texture | null;
};

const GLSL_FUNCS = /* glsl */ `
varying vec3 vP;
varying vec3 vN;
uniform float uL;
uniform float uNose;
uniform float uTail;
uniform vec4 uDoors;
uniform sampler2D uSign;
uniform sampler2D uDecal;
uniform float uHasSign;
uniform float uHasDecal;
float gRough; float gMetal; float gClear; vec3 gEm;

vec3 lin(vec3 c){ return pow(c, vec3(2.2)); }
float sdRB(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q,0.0)) + min(max(q.x,q.y),0.0) - r; }
float fillD(float d){ float w = max(fwidth(d), 1e-4) * 0.9; return 1.0 - smoothstep(-w, w, d); }
float nearestDoor(float x){
  float d = abs(x - uDoors.x); float c = uDoors.x;
  if (abs(x - uDoors.y) < d) { d = abs(x - uDoors.y); c = uDoors.y; }
  if (abs(x - uDoors.z) < d) { d = abs(x - uDoors.z); c = uDoors.z; }
  if (abs(x - uDoors.w) < d) { d = abs(x - uDoors.w); c = uDoors.w; }
  return c;
}
`;

const PAINT = /* glsl */ `
{
  // sRGB swatches converted to linear
  vec3 WHITE = lin(vec3(0.93, 0.945, 0.95));
  vec3 ORANGE = lin(vec3(0.95, 0.50, 0.11));
  vec3 AMBER = lin(vec3(0.97, 0.63, 0.13));
  vec3 SKIRT = lin(vec3(0.24, 0.27, 0.29));
  vec3 ROOF = lin(vec3(0.80, 0.82, 0.84));
  vec3 GLASS = lin(vec3(0.07, 0.09, 0.105));
  vec3 BLACK = lin(vec3(0.07, 0.075, 0.08));

  float x = vP.x, y = vP.y, z = vP.z;
  vec3 n = normalize(vN);
  vec3 col = WHITE; gRough = 0.26; gMetal = 0.0; gClear = 1.0; gEm = vec3(0.0);
  float halfL = uL * 0.5;
  float cabEnd = uNose > 0.5 ? halfL - NOSE_LEN - 1.7 : halfL - 0.75;

  // ---------- sides ----------
  float sideK = smoothstep(0.25, 0.55, abs(n.z));
  // sill skirt
  float sk = fillD(y - 0.32);
  col = mix(col, SKIRT, sk); gRough = mix(gRough, 0.6, sk); gClear = mix(gClear, 0.3, sk);
  // belt stripes (orange) and a thin pin line
  float st = fillD(abs(y - 1.29) - 0.115) + fillD(abs(y - 1.50) - 0.022);
  col = mix(col, ORANGE, clamp(st, 0.0, 1.0));

  // passenger windows: equal panes between doors
  float a0 = -halfL + 0.75;
  float b0 = cabEnd;
  vec4 D = uDoors;
  float segA = a0, segB = D.x - 0.98;
  if (x > D.x) { segA = D.x + 0.98; segB = D.y - 0.98; }
  if (x > D.y) { segA = D.y + 0.98; segB = D.z - 0.98; }
  if (x > D.z) { segA = D.z + 0.98; segB = D.w - 0.98; }
  if (x > D.w) { segA = D.w + 0.98; segB = b0; }
  float segW = segB - segA;
  float nP = max(1.0, floor(segW / 1.5 + 0.5));
  float pw = segW / nP;
  float lx = mod(x - segA, pw) - pw * 0.5;
  float inSeg = step(segA, x) * step(x, segB) * step(0.6, segW);
  float win = fillD(sdRB(vec2(lx, y - 2.37), vec2(pw * 0.5 - 0.1, 0.6), 0.1)) * inSeg;

  // doors
  float xd = nearestDoor(x);
  float dd = sdRB(vec2(x - xd, y - 1.6), vec2(0.7, 1.46), 0.05);
  float inDoor = fillD(dd);
  float groove = fillD(abs(dd) - 0.014) + inDoor * fillD(abs(x - xd) - 0.008);
  float dwin = fillD(sdRB(vec2(abs(x - xd) - 0.34, y - 2.28), vec2(0.25, 0.66), 0.07)) * inDoor;
  win = max(win, dwin);
  // door step light (amber), subtle
  gEm += vec3(1.0, 0.55, 0.15) * 0.0 * inDoor;

  // cab side window + cab door (driver)
  if (uNose > 0.5) {
    float cx = halfL - NOSE_LEN - 0.85;
    float cw = fillD(sdRB(vec2(x - cx, y - 2.33), vec2(0.42, 0.62), 0.1));
    float cd = sdRB(vec2(x - cx, y - 1.75), vec2(0.6, 1.32), 0.05);
    groove = max(groove, fillD(abs(cd) - 0.014));
    win = max(win, cw);
  }

  // side decal under the middle window band
  if (uHasDecal > 0.5) {
    float cx = (D.y + D.z) * 0.5;
    vec2 uv = vec2((x - (cx - 1.55)) / 3.1, (y - 0.48) / 0.52);
    if (z < 0.0) uv.x = 1.0 - uv.x;
    if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) {
      vec4 dc = texture2D(uDecal, uv);
      col = mix(col, dc.rgb, dc.a * sideK);
    }
  }

  // glazing: tinted, with a lit ceiling strip and a soft interior gradient
  vec3 gcol = mix(GLASS * 2.6, GLASS, smoothstep(1.75, 2.75, y));
  float ceilingLight = fillD(abs(y - 2.86) - 0.035);
  float wk = win * sideK;
  col = mix(col, gcol, wk);
  gEm += vec3(0.85, 0.92, 1.0) * 0.55 * ceilingLight * wk;
  gRough = mix(gRough, 0.09, wk); gClear = mix(gClear, 0.6, wk);
  col = mix(col, BLACK, clamp(groove, 0.0, 1.0) * sideK * (1.0 - wk));

  // roof
  float roof = smoothstep(3.38, 3.5, y) * smoothstep(0.55, 0.8, n.y);
  col = mix(col, ROOF, roof); gRough = mix(gRough, 0.55, roof); gClear = mix(gClear, 0.15, roof);

  // ---------- cab front ----------
  if (uNose > 0.5) {
    float front = smoothstep(0.3, 0.62, n.x) * step(halfL - NOSE_LEN - 0.05, x);
    vec3 fc = AMBER; float fr = 0.28;
    // white crown above the sign
    fc = mix(fc, WHITE, fillD(3.47 - y));
    // three-pane windscreen
    float ws = fillD(sdRB(vec2(z, y - 2.42), vec2(1.1, 0.68), 0.24));
    float pillar = fillD(abs(abs(z) - 0.37) - 0.05) + fillD(abs(abs(z) - 1.08) - 0.03);
    pillar = clamp(pillar, 0.0, 1.0);
    float glass = ws * (1.0 - pillar);
    fc = mix(fc, BLACK, ws * pillar);
    fc = mix(fc, GLASS, glass);
    fr = mix(fr, 0.03, glass);
    // destination sign
    vec2 su = vec2(0.5 - z / 1.04, (y - 3.18) / 0.24);
    float sgn = fillD(sdRB(vec2(z, y - 3.3), vec2(0.54, 0.13), 0.02));
    fc = mix(fc, BLACK, sgn);
    if (uHasSign > 0.5 && su.x > 0.0 && su.x < 1.0 && su.y > 0.0 && su.y < 1.0) {
      vec3 led = texture2D(uSign, vec2(su.x, su.y)).rgb;
      fc = mix(fc, led, sgn);
      gEm += led * 1.6 * sgn * front * (1.0 - uTail * 0.6);
    }
    // lower black mask with lamp clusters
    float lowMask = fillD(sdRB(vec2(z, y - 0.98), vec2(0.52, 0.56), 0.12));
    fc = mix(fc, BLACK, lowMask);
    // lamps: ring + lens
    for (int k = 0; k < 2; k++) {
      float sx = k == 0 ? 1.0 : -1.0;
      vec2 c1 = vec2(z - sx * 0.93, y - 0.96);
      vec2 c2 = vec2(z - sx * 0.66, y - 0.96);
      float ring = fillD(length(c1) - 0.17) + fillD(length(c2) - 0.1);
      fc = mix(fc, BLACK, clamp(ring, 0.0, 1.0));
      float l1 = fillD(length(c1) - 0.12);
      float l2 = fillD(length(c2) - 0.065);
      vec3 head = vec3(1.0, 0.96, 0.88);
      vec3 red = vec3(1.0, 0.08, 0.05);
      vec3 lc1 = mix(head, red * 0.6, uTail);
      vec3 lc2 = mix(vec3(0.85, 0.95, 1.0), red, uTail);
      fc = mix(fc, lc1, l1); fc = mix(fc, lc2, l2);
      gEm += (lc1 * l1 * mix(3.2, 0.6, uTail) + lc2 * l2 * mix(1.6, 2.6, uTail)) * front;
    }
    // hexagon mark on the mask
    vec2 hp = vec2(z, y - 1.12);
    vec2 q = abs(hp);
    float hex = max(q.y * 0.866025 + q.x * 0.5, q.x) - 0.15;
    float hring = fillD(abs(hex) - 0.03);
    float hin = fillD(max(q.y * 0.866025 + q.x * 0.5, q.x) - 0.06);
    vec3 blue = lin(vec3(0.16, 0.35, 0.86));
    fc = mix(fc, blue, clamp(hring + hin, 0.0, 1.0) * lowMask);
    gEm += blue * 0.5 * clamp(hring + hin, 0.0, 1.0) * lowMask * front;
    // anti-climber skirt
    float sk2 = fillD(y - 0.3);
    fc = mix(fc, SKIRT, sk2);

    col = mix(col, fc, front);
    gRough = mix(gRough, fr, front);
  }

  diffuseColor.rgb = col;
}
`;

export function makePaint(o: PaintOpts) {
  const m = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: 0.3,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1,
  });
  const uniforms = {
    uL: { value: o.L },
    uNose: { value: o.nose ? 1 : 0 },
    uTail: { value: o.tail ? 1 : 0 },
    uDoors: { value: new THREE.Vector4(...o.doors) },
    uSign: { value: o.sign },
    uDecal: { value: o.decal },
    uHasSign: { value: o.sign ? 1 : 0 },
    uHasDecal: { value: o.decal ? 1 : 0 },
  };
  m.userData.uniforms = uniforms;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vP;\nvarying vec3 vN;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvP = position;\nvN = normal;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\n#define NOSE_LEN " + NOSE.toFixed(3) + "\n" + GLSL_FUNCS)
      .replace("#include <color_fragment>", "#include <color_fragment>\n" + PAINT)
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = gRough;")
      .replace("#include <metalnessmap_fragment>", "#include <metalnessmap_fragment>\nmetalnessFactor = gMetal;")
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance += gEm;")
      .replace(
        "#include <lights_physical_fragment>",
        "#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat = gClear;\n#endif",
      );
  };
  m.customProgramCacheKey = () => "link-car-paint-v1";
  return m;
}
