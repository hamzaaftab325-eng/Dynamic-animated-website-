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
uniform float uScrollVelocity;
uniform float uScrollPhase;
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
    p = p * 2.02 + vec2(12.4, 7.6);
    amp *= 0.5;
  }

  return value;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

  float velocity = clamp(abs(uScrollVelocity), 0.0, 2.2);
  float direction = sign(uScrollVelocity);
  float t = uTime * 0.055;

  vec2 pointer = (uMouse - 0.5) * vec2(0.12 * aspect, 0.08);

  vec2 warpA = vec2(
    fbm(p * 1.15 + vec2(t * 0.62, -t * 0.21)),
    fbm(p * 1.10 + vec2(-t * 0.31, t * 0.54))
  );

  vec2 warpB = vec2(
    fbm(p * 1.85 + warpA * 0.82 + pointer + vec2(t * 0.24, 0.0)),
    fbm(p * 1.75 - warpA * 0.66 - pointer + vec2(0.0, -t * 0.18))
  );

  vec2 scrolledP = p;
  scrolledP.y += uScrollPhase * 0.045;
  scrolledP.x += direction * velocity * 0.014;

  float broad = fbm(
    scrolledP * vec2(1.05 + velocity * 0.05, 0.92) +
    warpA * 0.88 +
    vec2(t * 0.34, -t * 0.12)
  );

  float middle = fbm(
    scrolledP * vec2(1.9 + velocity * 0.10, 1.38) +
    warpB * 1.16 +
    vec2(-t * 0.47, t * 0.17)
  );

  float fine = fbm(
    scrolledP * vec2(3.5 + velocity * 0.18, 2.25) +
    warpA * 0.72 -
    vec2(t * 0.24, t * 0.08)
  );

  float horizontalBand =
    smoothstep(0.10, 0.88, 1.0 - abs(p.y + 0.03) * 1.18);

  float softBody = smoothstep(
    0.38,
    0.76,
    broad * 0.58 + middle * 0.34 + fine * 0.12
  );

  float wisps = smoothstep(
    0.50,
    0.82,
    middle * 0.68 + fine * 0.36
  );

  float edgeFade =
    smoothstep(0.78, 0.16, abs(p.x) / max(aspect * 0.5, 0.001));

  float motionLift = 1.0 + velocity * 0.14;
  float alpha =
    (softBody * 0.22 + wisps * 0.12) *
    horizontalBand *
    mix(0.78, 1.0, edgeFade) *
    motionLift;

  vec3 coolGrey = vec3(0.66, 0.69, 0.65);
  vec3 warmMist = vec3(0.88, 0.87, 0.82);

  vec3 color = mix(
    coolGrey,
    warmMist,
    smoothstep(0.30, 0.80, broad)
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

    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
      premultipliedAlpha: true,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, mobile ? 0.75 : 1)
    );
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      uTime: { value: 0 },
      uScrollVelocity: { value: 0 },
      uScrollPhase: { value: 0 },
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
      blending: THREE.NormalBlending,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    let frame = 0;
    let visible = true;
    let lastScrollY = window.scrollY;
    let velocityTarget = 0;
    let velocity = 0;
    let scrollPhase = 0;

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

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, width <= 767 ? 0.75 : 1)
      );
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    const pointer = (event: PointerEvent) => {
      mouseTarget.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight
      );
    };

    const onScroll = () => {
      const next = window.scrollY;
      const delta = next - lastScrollY;
      lastScrollY = next;

      velocityTarget = THREE.MathUtils.clamp(delta / 30, -2.2, 2.2);
      scrollPhase += delta / Math.max(window.innerHeight, 1);
    };

    const tick = (time: number) => {
      mouse.lerp(mouseTarget, mobile ? 0.025 : 0.04);

      velocity += (velocityTarget - velocity) * 0.12;
      velocityTarget *= 0.86;

      uniforms.uMouse.value.copy(mouse);
      uniforms.uTime.value = time * 0.001;
      uniforms.uScrollVelocity.value = velocity;
      uniforms.uScrollPhase.value +=
        (scrollPhase - uniforms.uScrollPhase.value) * 0.075;

      if (visible) {
        renderer.render(scene, camera);
      }

      frame = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", pointer, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
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
