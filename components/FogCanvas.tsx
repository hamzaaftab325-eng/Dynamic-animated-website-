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

  for (int i = 0; i < 4; i++) {
    value += amp * noise(p);
    p = p * 2.03 + vec2(12.4, 7.6);
    amp *= 0.5;
  }

  return value;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

  float t = uTime * 0.035;
  vec2 mouse = (uMouse - 0.5) * 0.12;

  float broad = fbm(p * 1.15 + vec2(t, -t * 0.42) + mouse);
  float detail = fbm(p * 2.35 + vec2(-t * 0.62, t * 0.28) - mouse * 0.5);

  float band = smoothstep(0.16, 0.92, 1.0 - abs(p.y + 0.02) * 1.32);
  float cloud = smoothstep(0.43, 0.79, broad * 0.72 + detail * 0.34);
  float alpha = cloud * band * 0.34;

  vec3 color = mix(
    vec3(0.58, 0.60, 0.56),
    vec3(0.84, 0.83, 0.77),
    broad
  );

  gl_FragColor = vec4(color, alpha);
}
`;

export default function FogCanvas() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
      premultipliedAlpha: true,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    let frame = 0;
    let visible = true;
    const mouseTarget = new THREE.Vector2(0.5, 0.5);
    const mouse = new THREE.Vector2(0.5, 0.5);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );

    observer.observe(host);

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);

      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    const pointer = (event: PointerEvent) => {
      mouseTarget.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight
      );
    };

    const tick = (time: number) => {
      mouse.lerp(mouseTarget, 0.025);
      uniforms.uMouse.value.copy(mouse);
      uniforms.uTime.value = time * 0.001;

      if (visible) {
        renderer.render(scene, camera);
      }

      frame = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", pointer, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointer);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={ref} className="fog-canvas" aria-hidden="true" />;
}
