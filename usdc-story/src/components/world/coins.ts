import * as THREE from "three";
import { asset } from "@/lib/asset";
import { usdceTex } from "./textures";

let native: THREE.Material[] | null = null;
let bridged: THREE.Material[] | null = null;

/** [rim, top, bottom] materials for a USDC coin (CylinderGeometry groups). */
export function coinMats() {
  if (!native) {
    const face = new THREE.TextureLoader().load(asset("/img/usdc.png"));
    face.colorSpace = THREE.SRGBColorSpace;
    const rim = new THREE.MeshStandardMaterial({ color: "#d7e3f2", metalness: 0.6, roughness: 0.3 });
    const cap = new THREE.MeshStandardMaterial({ map: face, metalness: 0.1, roughness: 0.35 });
    native = [rim, cap, cap];
  }
  return native;
}
export function bridgedMats() {
  if (!bridged) {
    const rim = new THREE.MeshStandardMaterial({ color: "#b8c0ca", metalness: 0.5, roughness: 0.4 });
    const cap = new THREE.MeshStandardMaterial({ map: usdceTex(), metalness: 0.1, roughness: 0.4 });
    bridged = [rim, cap, cap];
  }
  return bridged;
}
/** coin geometry: radius 1, standing upright facing +z when rotated by COIN_UP */
export const coinGeo = () => new THREE.CylinderGeometry(1, 1, 0.14, 40);
