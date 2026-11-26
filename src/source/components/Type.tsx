import type {Strips } from "../types"
const Typecar = ({strip} : {strip: Strips []}) => {
  const totalQuantity = strip.reduce((sum, item)=> sum + item.quantity,0)
    return (
        <div className="car_types relative max-w-[1240px] my-0 mx-auto pt-[120px] px-[32px] text-center pb-0">
          <div className="car_types_by inline-flex items-center gap-[8px] py-[6px] px-[14px] rounded-[999px] bg-white border border-[#E8E8E5] shadow-[0_6px_18px_-10px_rgba(0,0,0,0.2)] text-[11px] font-medium tracking-[0.08em] uppercase text-black">
            <p>BROWSE BY TYPE</p>
          </div>
          <h2 className="mt-[22px] mx-auto mb-[14px] w-[700px] max-w-[700px] h-[114px]">
            One search.
            <br /> Every kind of ride.
          </h2>
          <p className="mx-auto mb-11!">
            Pick a body style to narrow the lot, then refine by price and year.
          </p>
          <div className="car_types_quantity flex  w-full gap-2.5 h-95 text-left">
            {strip.map((s) => {
            const totalWidth = (s.quantity/totalQuantity)* 100 ;
            return(
            <a key={s.id} href="#" className="min-w-0 relative rounded-[28px] overflow-hidden no-underline flex items-end justify-center py-[22px]"
            style = {{
              flex: `${s.grow} 1 0`,
              background: s.bg,
              width: `${totalWidth}%`
            }}
            >{s.label}</a>
)})}
            </div>
        </div>
    );
};
export default Typecar;