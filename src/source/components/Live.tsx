export interface HeroCard {
  id: number;
  left: string;
  top: string;
  rot: number;
  bg: string;
  body: string;
  z: number;
  tag: string;
  price: string;
  title: string;
  specs: string;
  location: string;
}
const Live = ({ card }: { card: HeroCard [] }) => {

  return (
    <div className="car_live relative w-full flex justify-center items-start pt-[56px] box-border">
      <div className="bottom-[34%] absolute text-[420px]/[1em] font-semibold tracking-tighter whitespace-nowrap bg-gradient-to-b from-black/[0.12] to-transparent bg-clip-text text-transparent pointer-events-none select-none">
        CARBID
      </div>
      <div className="cars_live w-full h-[800px] max-w-[1240px] flex flex-col items-center justify-start">
        <div className="car_live_info flex flex-col items-center">
          <div className="car_bar_live w-fit flex items-center rounded-[999px] text-[11px]/[16.5px] tracking-[0.08em] gap-[8px] pt-[6px] pb-[6px] pr-[14px] pl-[14px]">
            <div className="live-dot w-[10px] h-[10px] bg-black rounded-[50%] inline-block "></div>
            <p className="car_live_quantity text-[11px] text-black font-semibold">
              128 CARS LIVE NOW
            </p>
          </div>
          <h1 className="live_text w-[900px] h-[190px] max-w-[900px] mt-[26px] mb-[18px] mr-auto ml-auto ">
            Find your next car.
            <br /> Name your price.
          </h1>
          <p className="w-[480px] h-[51px] align-center">
            Buy it now at the listed price, or make an offer the seller can
            accept.
          </p>
        </div>
        <div className="car_live_search relative w-[100%] max-w-[1000px] h-[470px] mt-[40px] mx-auto mb-0 ">
          {card.map((h) =>  
          <div className="car_frame w-[190px] h-[250px] absolute rounded-[30px] shadow-[0_30px_50px_-24px_rgba(0,0,0,0.45)] overflow-hidden "
          style={{
              left: h.left,
              top: h.top,
              background: h.bg,
              transform: `rotate(${h.rot}deg)`,
              zIndex: h.z
            }}
          >
            <div className="car_fr_img">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="190px"
                height="250px"
                viewBox="0 0 190 250"
                className="car_fr_img"
              >
                <ellipse
                  cx="95"
                  cy="176"
                  rx="70"
                  ry="9"
                  fill="rgba(0,0,0,0.28)"
                />
                <path
                  d="M22 168l14-30c3-6 8-9 15-9h58c8 0 13 3 18 8l20 22c8 1 14 5 14 12v7H22z"
                  fill= {h.body}
                />
                <path
                  d="M54 138h30v-1c0 0-6-8-14-8-6 0-12 4-16 9z"
                  fill="rgba(255,255,255,0.35)"
                />

                <circle cx="58" cy="176" r="12" fill="#111619" />
                <circle cx="58" cy="176" r="5" fill="#717a84" />
                <circle cx="140" cy="176" r="12" fill="#111619" />
                <circle cx="140" cy="176" r="5" fill="#717a84" />
              </svg>
            </div>
          </div>
)}
          <form className=" absolute left-[50%] bottom-[0] -translate-x-1/2 z-10 box-border w-[min(560px,100%)] p-[14px] pl-[20px] text-left rounded-[26px] bg-white/[0.88] border border-white/90 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.3)] backdrop-blur-[18px]">
            <input
              id="car_search"
              className=" w-full h-[44px] p-0 border-none outline-none bg-transparent font-inherit text-[16px] text-[#0B0B0C] "
              type="search"
              placeholder="Search by make, model or year"
            />
            <div className="flex flex-wrap justify-between items-center gap-[8px] mt-[8px]">
              <div className="flex gap-[6px] flex-shrink">
                <button className="border w-fit h-[44px] gap-[6px] min-h-[44px] inline-flex items-center justify-between font-medium rounded-[999px] px-[14px] text-[13px] bg-black text-white">
                  <p>Toyota</p>
                  <svg
                    className="w-3 h-3 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <button className="border w-fit h-[44px] min-h-[44px] gap-[6px] inline-flex items-center justify-between font-medium rounded-[999px] px-[14px] bg-white text-[13px] text-zinc-800">
                  <span>Price</span>
                  <svg
                    className="w-3 h-3 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <button className="border w-fit h-[44px] min-h-[44px] gap-[6px] inline-flex items-center justify-between font-medium rounded-[999px] px-[14px] bg-white text-[13px] text-zinc-800">
                  <span>Year</span>
                  <svg
                    className="w-3 h-3 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <button className="border w-fit h-[44px] min-h-[44px] gap-[6px] inline-flex items-center justify-between font-medium rounded-[999px] px-[14px] bg-white text-[13px] text-zinc-800">
                  <span>Fuel</span>
                  <svg
                    className="w-3 h-3 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <button className="border w-[91px] h-[44px] min-h-[44px] inline-flex font-medium rounded-[999px] px-[14px] items-center justify-center text-[13px] bg-black text-white">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Live;
