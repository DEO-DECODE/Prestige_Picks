import React from "react";
import SearchInput from "./Form/SearchInput";
import carousel_img_1 from "../carouselimages/carousel_img_1.jpg";
import carousel_img_2 from "../carouselimages/carousel_img_2.jpg";
import carousel_img_3 from "../carouselimages/carousel_img_3.jpg";
export default function Carousel() {
  return (
    <div>
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade "
        data-bs-ride="carousel"
      >
        <div
          className="carousel-inner "
          id="carousel"
          style={{ height: "100vh" }}
        >
          <div
            className="carousel-caption d-flex align-items-center justify-content-center"
            style={{ zIndex: "9" }}
          >
            <SearchInput />
          </div>
          <div className="carousel-item active">
            <img
              src={carousel_img_1}
              className="d-block w-100  "
              style={{ filter: "brightness(30%)" }}
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src={carousel_img_2}
              className="d-block w-100 "
              style={{ filter: "brightness(30%)" }}
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src={carousel_img_3}
              className="d-block w-100 "
              style={{ filter: "brightness(30%)" }}
              alt="..."
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
