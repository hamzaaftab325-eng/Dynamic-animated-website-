"use client";

export default function CloudLayers() {
  return (
    <div className="home-clouds" aria-hidden="true">
      <div className="home-cloud home-cloud--a cloud-parallax--a">
        <div className="cloud-track cloud-track--a">
          <div className="cloud-item"><img src="/cloud-01.svg" alt="" /></div>
          <div className="cloud-item"><img src="/cloud-01.svg" alt="" /></div>
        </div>
      </div>

      <div className="home-cloud home-cloud--b cloud-parallax--b">
        <div className="cloud-track cloud-track--b">
          <div className="cloud-item"><img src="/cloud-02.svg" alt="" /></div>
          <div className="cloud-item"><img src="/cloud-02.svg" alt="" /></div>
        </div>
      </div>
    </div>
  );
}
