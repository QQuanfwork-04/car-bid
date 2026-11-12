const Typecar = () => {
    return (
        <div className="car_types relative max-w-[1024px] m-0 m-auto pt-[120px] px-[32px] text-center pb-0">
          <div className="car_types_by inline-flex items-center gap-[8px] py-[6px] px-[14px] rounded-[999px] bg-white border border-[#E8E8E5] shadow-[0_6px_18px_-10px_rgba(0,0,0,0.2)] text-[11px] font-medium tracking-[0.08em] upercase text-black">
            <p>BROWSE BY TYPE</p>
          </div>
          <h2 className="mt-[22px] mx-auto mb-[14px] w-[700px] max-w-[700px] h-[114px]">
            One search.
            <br /> Every kind of ride.
          </h2>
          <p>
            Pick a body style to narrow the lot, then refine by price and year.
          </p>
          <div className="car_types_quantity">Sedan</div>
        </div>
    );
};
export default Typecar;