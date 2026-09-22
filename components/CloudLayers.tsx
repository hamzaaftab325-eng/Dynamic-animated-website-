"use client";

export default function CloudLayers() {
  return (
    <div className="homeHeader_clouds" aria-hidden="true">
      <div className="homeHeader_cloud">
        <div className="cloud cloud--01">
          <div className="cloud_item -inView">
            <div className="cloud_img">
              <img src="/common_fv_cloud01.webp" alt="" draggable={false} />
            </div>
          </div>
          <div className="cloud_item -inView">
            <div className="cloud_img">
              <img src="/common_fv_cloud01.webp" alt="" draggable={false} />
            </div>
          </div>
        </div>

        <div className="cloud cloud--02">
          <div className="cloud_item -inView">
            <div className="cloud_img">
              <img src="/common_fv_cloud02.webp" alt="" draggable={false} />
            </div>
          </div>
          <div className="cloud_item -inView">
            <div className="cloud_img">
              <img src="/common_fv_cloud02.webp" alt="" draggable={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
