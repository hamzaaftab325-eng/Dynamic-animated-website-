"use client";

import { useEffect, useRef } from "react";

export default function CloudLayers() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>(".cloud_item"));

    const observer = new IntersectionObserver(
      ([entry]) => {
        items.forEach((item) => {
          item.classList.toggle("-inView", entry.isIntersecting);
        });
      },
      { threshold: 0.01 }
    );

    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="homeHeader_clouds" aria-hidden="true">
      <div ref={rootRef} className="homeHeader_cloud">
        <div className="cloud cloud--01">
          <div className="cloud_item">
            <div className="cloud_img">
              <img src="/common_fv_cloud01.webp" alt="" />
            </div>
          </div>
          <div className="cloud_item">
            <div className="cloud_img">
              <img src="/common_fv_cloud01.webp" alt="" />
            </div>
          </div>
        </div>

        <div className="cloud cloud--02">
          <div className="cloud_item">
            <div className="cloud_img">
              <img src="/common_fv_cloud02.webp" alt="" />
            </div>
          </div>
          <div className="cloud_item">
            <div className="cloud_img">
              <img src="/common_fv_cloud02.webp" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
