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
uniform float uVelocity;
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
  float amplitude = 0.5;

  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = p * 2.04 + vec2(17.1, 9.2);
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

  float t = uTime * 0.12;
  float speed = min(abs(uVelocity), 2.4);

  vec2 mouse = vec2(
    (uMouse.x - 0.5) * aspect,
    uMouse.y - 0.5
  );

  float mouseDistance = length(p - mouse);
  float mouseForce = exp(-mouseDistance * 7.0);

  vec2 q;
  q.x = fbm(p * 1.75 + vec2(t, -t * 0.62));
  q.y = fbm(p * 1.75 + vec2(-t * 0.48, t * 0.78));

  vec2 r;
  r.x = fbm(
    p * 2.25 +
    2.35 * q +
    vec2(1.7, 9.2) +
    vec2(t * 0.38, -t * 0.22) +
    mouseForce * vec2(uMouse.x - 0.5, uMouse.y - 0.5)
  );

  r.y = fbm(
    p * 2.25 +
    2.1 * q +
    vec2(8.3, 2.8) +
    vec2(-t * 0.25, t * 0.34)
  );

  float flow = fbm(
    p * (2.8 + speed * 0.18) +
    2.3 * r +
    vec2(0.0, uVelocity * 0.08)
  );

  float ribbon = smoothstep(0.46, 0.78, flow);
  float fine = smoothstep(0.58, 0.82, fbm(p * 5.2 + r * 1.4 - t * 0.16));

  float ring = smoothstep(0.18, 0.0, abs(mouseDistance - 0.13 - mouseForce * 0.018));
  float energy = clamp(speed * 0.16, 0.0, 0.24);

  float alpha = ribbon * 0.085 + fine * 0.035 + ring * 0.055 + energy * ribbon;

  vec3 warm = vec3(0.91, 0.88, 0.79);
  vec3 smoke = vec3(0.16, 0.14, 0.105);
  vec3 color = mix(smoke, warm, smoothstep(0.28, 0.82, flow));

  gl_FragColor = vec4(color, alpha);
}
`;

export default function FluidField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
      premultipliedAlpha: true,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? 0.8 : 1.15)
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      uTime: { value: 0 },
      uVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    let frame = 0;
    let lastScroll = window.scrollY;
    let velocityTarget = 0;
    let velocityCurrent = 0;

    const mouseTarget = new THREE.Vector2(0.5, 0.5);
    const mouseCurrent = new THREE.Vector2(0.5, 0.5);

    const onPointerMove = (event: PointerEvent) => {
      mouseTarget.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight
      );
    };

    const onScroll = () => {
      const next = window.scrollY;
      const delta = next - lastScroll;
      lastScroll = next;
      velocityTarget = THREE.MathUtils.clamp(delta / 42, -2.4, 2.4);
    };

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, width <= 767 ? 0.8 : 1.15)
      );
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };

    const tick = (time: number) => {
      mouseCurrent.lerp(mouseTarget, isMobile ? 0.035 : 0.075);
      velocityCurrent += (velocityTarget - velocityCurrent) * 0.11;
      velocityTarget *= 0.86;

      uniforms.uTime.value = time * 0.001;
      uniforms.uVelocity.value = velocityCurrent;
      uniforms.uMouse.value.copy(mouseCurrent);

      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="fluid-field" aria-hidden="true" />;
}
