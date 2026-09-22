"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type LiquidMediaProps = {
  src: string;
  className?: string;
  intensity?: number;
  ariaLabel?: string;
};

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

uniform sampler2D uTexture;
uniform float uTime;
uniform float uIntensity;
uniform float uVelocity;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec2 uImageResolution;

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

vec2 coverUv(vec2 uv, vec2 screen, vec2 image) {
  float rs = screen.x / screen.y;
  float ri = image.x / image.y;
  vec2 newSize = rs < ri
    ? vec2(image.x * screen.y / image.y, screen.y)
    : vec2(screen.x, image.y * screen.x / image.x);

  vec2 offset = (rs < ri
    ? vec2((newSize.x - screen.x) / 2.0, 0.0)
    : vec2(0.0, (newSize.y - screen.y) / 2.0)) / newSize;

  return uv * screen / newSize + offset;
}

void main() {
  vec2 uv = coverUv(vUv, uResolution, uImageResolution);
  vec2 p = vUv - 0.5;

  float t = uTime * 0.16;
  float velocity = min(abs(uVelocity), 2.2);

  float n1 = noise(uv * 3.2 + vec2(t, -t * 0.7));
  float n2 = noise(uv * 6.4 + vec2(-t * 0.55, t * 0.4));
  float n3 = noise(uv * 11.0 - t * 0.25);

  vec2 mouseDelta = vUv - uMouse;
  float mouseInfluence = exp(-dot(mouseDelta, mouseDelta) * 18.0);

  vec2 distortion = vec2(
    (n1 - 0.5) + (n3 - 0.5) * 0.35,
    (n2 - 0.5) + (n1 - 0.5) * 0.25
  );

  float strength = uIntensity * (0.010 + velocity * 0.007);
  distortion *= strength;
  distortion += mouseDelta * mouseInfluence * uIntensity * 0.018;

  vec4 color = texture2D(uTexture, uv + distortion);

  float edge = smoothstep(0.95, 0.35, length(p));
  color.rgb *= mix(0.9, 1.02, edge);

  gl_FragColor = color;
}
`;

export default function LiquidMedia({
  src,
  className = "",
  intensity = 1,
  ariaLabel = "",
}: LiquidMediaProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 0.8 : 1.15));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");

    let texture: THREE.Texture | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let frame = 0;
    let isVisible = true;
    let lastScroll = window.scrollY;
    let velocityTarget = 0;
    let velocity = 0;

    const mouseTarget = new THREE.Vector2(0.5, 0.5);
    const mouse = new THREE.Vector2(0.5, 0.5);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "20% 0px 20% 0px", threshold: 0.01 }
    );
    observer.observe(host);

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) return;

      mouseTarget.set(
        (event.clientX - rect.left) / Math.max(rect.width, 1),
        1 - (event.clientY - rect.top) / Math.max(rect.height, 1)
      );
    };

    const onScroll = () => {
      const next = window.scrollY;
      const delta = next - lastScroll;
      lastScroll = next;
      velocityTarget = THREE.MathUtils.clamp(delta / 34, -2.2, 2.2);
    };

    const resize = () => {
      if (!material) return;
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, width <= 767 ? 0.8 : 1.15)
      );
      renderer.setSize(width, height, false);
      material.uniforms.uResolution.value.set(width, height);
    };

    textureLoader.load(
      src,
      (loadedTexture) => {
        texture = loadedTexture;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const image = loadedTexture.image as HTMLImageElement;

        material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uTexture: { value: texture },
            uTime: { value: 0 },
            uIntensity: { value: intensity },
            uVelocity: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uResolution: { value: new THREE.Vector2(1, 1) },
            uImageResolution: {
              value: new THREE.Vector2(image.naturalWidth || image.width, image.naturalHeight || image.height),
            },
          },
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(mesh);
        resize();

        const tick = (time: number) => {
          if (!material) return;

          mouse.lerp(mouseTarget, mobile ? 0.035 : 0.075);
          velocity += (velocityTarget - velocity) * 0.12;
          velocityTarget *= 0.86;

          material.uniforms.uTime.value = time * 0.001;
          material.uniforms.uVelocity.value = velocity;
          material.uniforms.uMouse.value.copy(mouse);

          if (isVisible) {
            renderer.render(scene, camera);
          }
          frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
      }
    );

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      observer.disconnect();
      material?.dispose();
      texture?.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [src, intensity]);

  return (
    <div
      ref={hostRef}
      className={"liquid-media " + className}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel || undefined}
      style={{ backgroundImage: `url("${src}")` }}
    />
  );
}
