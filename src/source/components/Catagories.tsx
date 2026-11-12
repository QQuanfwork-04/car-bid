const Catagory = () => {
    return (
        <div className="car_categories relative w-full h-[1002px] !box-content max-w-[1240px] mx-auto pt-[120px] pb-[80px] px-[32px]">
          <div className="w-full h-[77px] flex items-end justify-between gap-[16px] mb-[36px] ">
            <div className="w-fit h-[77px] text-start">
              <h3 className=" h-[48px]">Fresh on the lot</h3>
              <p>128 cars available</p>
            </div>
            <div className="flex w-[206px] h-[44px] justify-start items-center gap-[8px] text-[14px]">
              <p>Sort </p>
              <select className="w-[171px] h-[44px] border border-[#E4E4E1] rounded-[999px] px-[16px] bg-white text-black font-medium">
                <option value="">Newest</option>
                <option value="">Previous</option>
                <option value=""></option>
              </select>
            </div>
          </div>

          <div className="car_cat_frame grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[24px] w-full h-[789px]">
            <a href="#" className="car_categories_info underline-none block p-[10px] w-[377px] h-[363px] rounded-[32px] text-inherit shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_50px_-34px_rgba(0,0,0,0.25)] ">
              <div className="car_cat_frame relative h-[240px] rounded-[24px] bg-orange-200 overflow-hidden ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 240"
                  width="100%"
                  height="240"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <ellipse
                    cx="160"
                    cy="176"
                    rx="100"
                    ry="10"
                    fill="rgba(0,0,0,0.28)"
                  />

                  <path
                    d="M62 168l20-34c4-6 9-9 17-9h78c9 0 15 3 21 9l26 25c10 1 18 5 18 12v7H62z"
                    fill="#f7f5f0"
                  />

                  <path
                    d="M98 134h44v-1c0 0-8-9-19-9-8 0-17 4-25 10z"
                    fill="rgba(255,255,255,0.35)"
                  />

                  <circle cx="102" cy="176" r="14" fill="#101012" />
                  <circle cx="102" cy="176" r="6" fill="#8A8F98" />

                  <circle cx="218" cy="176" r="14" fill="#101012" />
                  <circle cx="218" cy="176" r="6" fill="#8A8F98" />
                </svg>
                <span className="car_tag absolute top-[14px] left-[14px] py-[5px] px-[12px] rounded-[999px] bg-black/[0.72] text-white text-[12px] font-medium">
                  Offer Welcome
                </span>
                <span className="car_price absolute bottom-[14px] left-[14px] py-[8px] px-[16px] rounded-[999px] bg-white/[0.91] text-black text-[20px] leading-[-0.03em] font-medium">
                  $18.500
                </span>
              </div>
              <div className="car_cat_info w-[349px] h-[93px] flex pt-[18px] px-[14px] pb-[12px] items-center justify-between gap-[12px]">
                <div className="car_info_left block w-[247px] text-start min-w-0">
                  <h4>Toyota Camry SE</h4>
                  <p className="!mb-[12px] leading-tight text-[14px]">
                    2020 · 42,000 km · Petrol · Automatic
                  </p>
                  <span className="w-auto leading-tight h-auto text-[13px]">Minh Tran - Austin, TX</span>
                </div>
                <span className=" car_info_right flex-none w-[44px] h-[44px] rounded-[50%] bg-black flex items-center justify-center">
                  <svg
                    color="white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z" />
                  </svg>
                </span>
              </div>
            </a>
            <a href="#" className="car_categories_info underline-none block p-[10px] w-[377px] h-[363px] rounded-[32px] text-inherit shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_50px_-34px_rgba(0,0,0,0.25)] ">
              <div className="car_cat_frame relative h-[240px] rounded-[24px] bg-orange-200 overflow-hidden ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 240"
                  width="100%"
                  height="240"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <ellipse
                    cx="160"
                    cy="176"
                    rx="100"
                    ry="10"
                    fill="rgba(0,0,0,0.28)"
                  />

                  <path
                    d="M62 168l20-34c4-6 9-9 17-9h78c9 0 15 3 21 9l26 25c10 1 18 5 18 12v7H62z"
                    fill="#f7f5f0"
                  />

                  <path
                    d="M98 134h44v-1c0 0-8-9-19-9-8 0-17 4-25 10z"
                    fill="rgba(255,255,255,0.35)"
                  />

                  <circle cx="102" cy="176" r="14" fill="#101012" />
                  <circle cx="102" cy="176" r="6" fill="#8A8F98" />

                  <circle cx="218" cy="176" r="14" fill="#101012" />
                  <circle cx="218" cy="176" r="6" fill="#8A8F98" />
                </svg>
                <span className="car_tag absolute top-[14px] left-[14px] py-[5px] px-[12px] rounded-[999px] bg-black/[0.72] text-white text-[12px] font-medium">
                  Offer Welcome
                </span>
                <span className="car_price absolute bottom-[14px] left-[14px] py-[8px] px-[16px] rounded-[999px] bg-white/[0.91] text-black text-[20px] leading-[-0.03em] font-medium">
                  $18.500
                </span>
              </div>
              <div className="car_cat_info w-[349px] h-[93px] flex pt-[18px] px-[14px] pb-[12px] items-center justify-between gap-[12px]">
                <div className="car_info_left block w-[247px] text-start min-w-0">
                  <h4>Toyota Camry SE</h4>
                  <p className="!mb-[12px] leading-tight text-[14px]">
                    2020 · 42,000 km · Petrol · Automatic
                  </p>
                  <span className="w-auto leading-tight h-auto text-[13px]">Minh Tran - Austin, TX</span>
                </div>
                <span className=" car_info_right flex-none w-[44px] h-[44px] rounded-[50%] bg-black flex items-center justify-center">
                  <svg
                    color="white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z" />
                  </svg>
                </span>
              </div>
            </a>
            <a href="#" className="car_categories_info underline-none block p-[10px] w-[377px] h-[363px] rounded-[32px] text-inherit shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_50px_-34px_rgba(0,0,0,0.25)] ">
              <div className="car_cat_frame relative h-[240px] rounded-[24px] bg-orange-200 overflow-hidden ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 240"
                  width="100%"
                  height="240"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <ellipse
                    cx="160"
                    cy="176"
                    rx="100"
                    ry="10"
                    fill="rgba(0,0,0,0.28)"
                  />

                  <path
                    d="M62 168l20-34c4-6 9-9 17-9h78c9 0 15 3 21 9l26 25c10 1 18 5 18 12v7H62z"
                    fill="#f7f5f0"
                  />

                  <path
                    d="M98 134h44v-1c0 0-8-9-19-9-8 0-17 4-25 10z"
                    fill="rgba(255,255,255,0.35)"
                  />

                  <circle cx="102" cy="176" r="14" fill="#101012" />
                  <circle cx="102" cy="176" r="6" fill="#8A8F98" />

                  <circle cx="218" cy="176" r="14" fill="#101012" />
                  <circle cx="218" cy="176" r="6" fill="#8A8F98" />
                </svg>
                <span className="car_tag absolute top-[14px] left-[14px] py-[5px] px-[12px] rounded-[999px] bg-black/[0.72] text-white text-[12px] font-medium">
                  Offer Welcome
                </span>
                <span className="car_price absolute bottom-[14px] left-[14px] py-[8px] px-[16px] rounded-[999px] bg-white/[0.91] text-black text-[20px] leading-[-0.03em] font-medium">
                  $18.500
                </span>
              </div>
              <div className="car_cat_info w-[349px] h-[93px] flex pt-[18px] px-[14px] pb-[12px] items-center justify-between gap-[12px]">
                <div className="car_info_left block w-[247px] text-start min-w-0">
                  <h4>Toyota Camry SE</h4>
                  <p className="!mb-[12px] leading-tight text-[14px]">
                    2020 · 42,000 km · Petrol · Automatic
                  </p>
                  <span className="w-auto leading-tight h-auto text-[13px]">Minh Tran - Austin, TX</span>
                </div>
                <span className=" car_info_right flex-none w-[44px] h-[44px] rounded-[50%] bg-black flex items-center justify-center">
                  <svg
                    color="white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z" />
                  </svg>
                </span>
              </div>
            </a>
            <a href="#" className="car_categories_info underline-none block p-[10px] w-[377px] h-[363px] rounded-[32px] text-inherit shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_50px_-34px_rgba(0,0,0,0.25)] ">
              <div className="car_cat_frame relative h-[240px] rounded-[24px] bg-orange-200 overflow-hidden ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 240"
                  width="100%"
                  height="240"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <ellipse
                    cx="160"
                    cy="176"
                    rx="100"
                    ry="10"
                    fill="rgba(0,0,0,0.28)"
                  />

                  <path
                    d="M62 168l20-34c4-6 9-9 17-9h78c9 0 15 3 21 9l26 25c10 1 18 5 18 12v7H62z"
                    fill="#f7f5f0"
                  />

                  <path
                    d="M98 134h44v-1c0 0-8-9-19-9-8 0-17 4-25 10z"
                    fill="rgba(255,255,255,0.35)"
                  />

                  <circle cx="102" cy="176" r="14" fill="#101012" />
                  <circle cx="102" cy="176" r="6" fill="#8A8F98" />

                  <circle cx="218" cy="176" r="14" fill="#101012" />
                  <circle cx="218" cy="176" r="6" fill="#8A8F98" />
                </svg>
                <span className="car_tag absolute top-[14px] left-[14px] py-[5px] px-[12px] rounded-[999px] bg-black/[0.72] text-white text-[12px] font-medium">
                  Offer Welcome
                </span>
                <span className="car_price absolute bottom-[14px] left-[14px] py-[8px] px-[16px] rounded-[999px] bg-white/[0.91] text-black text-[20px] leading-[-0.03em] font-medium">
                  $18.500
                </span>
              </div>
              <div className="car_cat_info w-[349px] h-[93px] flex pt-[18px] px-[14px] pb-[12px] items-center justify-between gap-[12px]">
                <div className="car_info_left block w-[247px] text-start min-w-0">
                  <h4>Toyota Camry SE</h4>
                  <p className="!mb-[12px] leading-tight text-[14px]">
                    2020 · 42,000 km · Petrol · Automatic
                  </p>
                  <span className="w-auto leading-tight h-auto text-[13px]">Minh Tran - Austin, TX</span>
                </div>
                <span className=" car_info_right flex-none w-[44px] h-[44px] rounded-[50%] bg-black flex items-center justify-center">
                  <svg
                    color="white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z" />
                  </svg>
                </span>
              </div>
            </a>
            <a href="#" className="car_categories_info underline-none block p-[10px] w-[377px] h-[363px] rounded-[32px] text-inherit shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_50px_-34px_rgba(0,0,0,0.25)] ">
              <div className="car_cat_frame relative h-[240px] rounded-[24px] bg-orange-200 overflow-hidden ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 240"
                  width="100%"
                  height="240"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <ellipse
                    cx="160"
                    cy="176"
                    rx="100"
                    ry="10"
                    fill="rgba(0,0,0,0.28)"
                  />

                  <path
                    d="M62 168l20-34c4-6 9-9 17-9h78c9 0 15 3 21 9l26 25c10 1 18 5 18 12v7H62z"
                    fill="#f7f5f0"
                  />

                  <path
                    d="M98 134h44v-1c0 0-8-9-19-9-8 0-17 4-25 10z"
                    fill="rgba(255,255,255,0.35)"
                  />

                  <circle cx="102" cy="176" r="14" fill="#101012" />
                  <circle cx="102" cy="176" r="6" fill="#8A8F98" />

                  <circle cx="218" cy="176" r="14" fill="#101012" />
                  <circle cx="218" cy="176" r="6" fill="#8A8F98" />
                </svg>
                <span className="car_tag absolute top-[14px] left-[14px] py-[5px] px-[12px] rounded-[999px] bg-black/[0.72] text-white text-[12px] font-medium">
                  Offer Welcome
                </span>
                <span className="car_price absolute bottom-[14px] left-[14px] py-[8px] px-[16px] rounded-[999px] bg-white/[0.91] text-black text-[20px] leading-[-0.03em] font-medium">
                  $18.500
                </span>
              </div>
              <div className="car_cat_info w-[349px] h-[93px] flex pt-[18px] px-[14px] pb-[12px] items-center justify-between gap-[12px]">
                <div className="car_info_left block w-[247px] text-start min-w-0">
                  <h4>Toyota Camry SE</h4>
                  <p className="!mb-[12px] leading-tight text-[14px]">
                    2020 · 42,000 km · Petrol · Automatic
                  </p>
                  <span className="w-auto leading-tight h-auto text-[13px]">Minh Tran - Austin, TX</span>
                </div>
                <span className=" car_info_right flex-none w-[44px] h-[44px] rounded-[50%] bg-black flex items-center justify-center">
                  <svg
                    color="white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z" />
                  </svg>
                </span>
              </div>
            </a>
            <a href="#" className="car_categories_info underline-none block p-[10px] w-[377px] h-[363px] rounded-[32px] text-inherit shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_50px_-34px_rgba(0,0,0,0.25)] ">
              <div className="car_cat_frame relative h-[240px] rounded-[24px] bg-orange-200 overflow-hidden ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 240"
                  width="100%"
                  height="240"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <ellipse
                    cx="160"
                    cy="176"
                    rx="100"
                    ry="10"
                    fill="rgba(0,0,0,0.28)"
                  />

                  <path
                    d="M62 168l20-34c4-6 9-9 17-9h78c9 0 15 3 21 9l26 25c10 1 18 5 18 12v7H62z"
                    fill="#f7f5f0"
                  />

                  <path
                    d="M98 134h44v-1c0 0-8-9-19-9-8 0-17 4-25 10z"
                    fill="rgba(255,255,255,0.35)"
                  />

                  <circle cx="102" cy="176" r="14" fill="#101012" />
                  <circle cx="102" cy="176" r="6" fill="#8A8F98" />

                  <circle cx="218" cy="176" r="14" fill="#101012" />
                  <circle cx="218" cy="176" r="6" fill="#8A8F98" />
                </svg>
                <span className="car_tag absolute top-[14px] left-[14px] py-[5px] px-[12px] rounded-[999px] bg-black/[0.72] text-white text-[12px] font-medium">
                  Offer Welcome
                </span>
                <span className="car_price absolute bottom-[14px] left-[14px] py-[8px] px-[16px] rounded-[999px] bg-white/[0.91] text-black text-[20px] leading-[-0.03em] font-medium">
                  $18.500
                </span>
              </div>
              <div className="car_cat_info w-[349px] h-[93px] flex pt-[18px] px-[14px] pb-[12px] items-center justify-between gap-[12px]">
                <div className="car_info_left block w-[247px] text-start min-w-0">
                  <h4>Toyota Camry SE</h4>
                  <p className="!mb-[12px] leading-tight text-[14px]">
                    2020 · 42,000 km · Petrol · Automatic
                  </p>
                  <span className="w-auto leading-tight h-auto text-[13px]">Minh Tran - Austin, TX</span>
                </div>
                <span className=" car_info_right flex-none w-[44px] h-[44px] rounded-[50%] bg-black flex items-center justify-center">
                  <svg
                    color="white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z" />
                  </svg>
                </span>
              </div>
            </a>
          </div>
        </div>
    );
};
export default Catagory;