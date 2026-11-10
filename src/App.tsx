// import { useState } from 'react'
import "./App.css";

function App() {
  return (
    <>
      <div className="header">
        <div className="header_img">
          <img src="/src/assets/CarBid_logo_light.png" />
          <p>CarBid</p>
        </div>
        <div className="header_nav">
          <ul id="nav_head">
            <li>
              <a className="nav_link" href="#">
                Browse
              </a>
            </li>
            <li>
              <a className="nav_link" href="#">
                Sell a car
              </a>
            </li>
            <li>
              <a className="nav_link" href="#">
                My Cars
              </a>
            </li>
            <li>
              <a className="nav_link" href="#">
                Offers
              </a>
            </li>
          </ul>
        </div>
        <div className="header_auth">
          <button className="btn_toggle">
            <svg
              className="ic_toggle"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0B0B0C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>
            </svg>
          </button>
          <p className="auth">
            <a className="auth_link" href="#">Register</a>/<a className="auth_link" href="#">Login</a>
          </p>
        </div>
      </div>
      <div className="main_content">
        <div className="car_live">
          <div className="watermark-text absolute text-6xl font-black tracking-tighter whitespace-nowrap bg-gradient-to-b from-black/[0.12] to-transparent bg-clip-text text-transparent pointer-events-none select-none" >
            CARBID
          </div>
          <div className="cars_live">
            <div className="car_bar_live">
              <div className="live-dot"></div>
              <p className="car_live_quantity">128 CARS LIVE NOW</p>
            </div>
            <h2>Find your next car. Name your price.</h2>
            <p>
              Buy it now at the listed price, or make an offer the seller can
              accept.
            </p>
            <div className="car_live_search">
              <input
                className="car_search"
                type="text"
                placeholder="Search by make, model or year"
              />
            </div>
          </div>
        </div>
        <div className="car_types">
          <h1>One search. Every kind of ride.</h1>
          <p>
            Pick a body style to narrow the lot, then refine by price and year.
          </p>
        </div>
        <div className="car_categories">
          <p>Fresh on the lot 128 cars available</p>
          <p>
            Sort{" "}
            <select>
              <option value="">Newest</option>
              <option value="">Previous</option>
              <option value=""></option>
            </select>
          </p>
          <div className="car_cat_frame" style={{ display: "flex" }}>
            <div
              className="car_categories_info"
              style={{
                display: "block",
                padding: "10px",
                margin: "10px",
                width: "363px",
                height: "363px",
              }}
            >
              <div className="car_cat_img" style={{ background: "orange" }}>
                <img
                  style={{ width: "363px", height: "240px" }}
                  src="/src/assets/Car_White.png"
                  alt=""
                />
              </div>
              <div
                className="car_cat_info"
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                <div className="car_info_left">
                  <h1 style={{ fontSize: "22px" }}>Toyota Camry SE</h1>
                  <p>2020 · 42,000 km · Petrol · Automatic</p>
                  <p>Minh Tran - Austin, TX</p>
                </div>
                <div className="car_info_right">
                  <button
                    style={{
                      backgroundColor: "black",
                      borderRadius: "50px",
                      border: "none",
                      opacity: "1",
                      width: "44px",
                      height: "44px",
                    }}
                  >
                    <svg
                      color="white"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div
              className="car_categories_info"
              style={{
                display: "block",
                padding: "10px",
                margin: "10px",
                width: "363px",
                height: "363px",
              }}
            >
              <div className="car_cat_img" style={{ background: "orange" }}>
                <img
                  style={{ width: "363px", height: "240px" }}
                  src="/src/assets/Car_White.png"
                  alt=""
                />
              </div>
              <div
                className="car_cat_info"
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                <div className="car_info_left">
                  <h1 style={{ fontSize: "22px" }}>Toyota Camry SE</h1>
                  <p style={{ fontSize: "14px" }}>
                    2020 · 42,000 km · Petrol · Automatic
                  </p>
                  <p style={{ fontSize: "13px" }}>Minh Tran - Austin, TX</p>
                </div>
                <div className="car_info_right">
                  <button
                    style={{ backgroundColor: "black", borderRadius: "10px" }}
                  >
                    <svg
                      color="white"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
