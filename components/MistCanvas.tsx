"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amp * noise(p);
    p = p * 2.03 + vec2(13.7, 9.2);
    amp *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

  float t = uTime * 0.035;
  vec2 drift = uMouse * 0.035;
  float n1 = fbm(p * 1.75 + vec2(t, -t * 0.55) + drift);
  float n2 = fbm(p * 2.7 + vec2(-t * 0.7, t * 0.45) - drift * 0.8);
  float veil = smoothstep(0.26, 0.9, n1 * 0.72 + n2 * 0.38);

  float vignette = 1.0 - smoothstep(0.15, 0.78, length(p * vec2(0.9, 1.12)));
  float glow = veil * (0.18 + 0.34 * vignette);

  vec3 base = vec3(0.036, 0.031, 0.019);
  vec3 mist = vec3(0.33, 0.32, 0.285);
  vec3 col = mix(base, mist, glow * 0.28);

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function MistCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const host = mountRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: {
        value: new THREE.Vector2(host.clientWidth, host.clientHeight),
      },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    let frame = 0;
    const pointer = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);

    const onPointerMove = (event: PointerEvent) => {
      target.set(
        (event.clientX / window.innerWidth - 0.5) * 2,
        (event.clientY / window.innerHeight - 0.5) * -2
      );
    };

    const onResize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };

    const tick = (time: number) => {
      pointer.lerp(target, reduced ? 0 : 0.028);
      uniforms.uMouse.value.copy(pointer);
      uniforms.uTime.value = reduced ? 0 : time * 0.001;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      material.dispose();
      mesh.geometry.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="mist-canvas" aria-hidden="true" />;
}
