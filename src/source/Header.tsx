const Header = () => {
return (
    <div className="header">
        <div className="header_img">
           <svg 
            xmlns="http://www.w3.org/2000/svg"
            width= '26px'
            height= '26px'
            viewBox= "0 0 24 24"
            fill="none"
            aria-hidden='true'
           >
            <circle
                cx='12px'
                cy='12px'
                r='11px'
                fill="#0B0B0C"
                strokeLinecap="butt"
            />
            <path d="M5 14l1.6-3.6A2 2 0 0 1 8.4 9.2h7.2a2 2 0 0 1 1.8 1.2L19 14v2.4H5z" fill="#FAFAF9" />
           </svg>
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
          <button className="btn_toggle bg-white w-[44px] h-[44px] flex justify-center items-center border border-[#e4e4e1] rounded-[50%] cursor-pointer">
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
            <a className="auth_link" href="#">
              Register
            </a>
            /
            <a className="auth_link" href="#">
              Login
            </a>
          </p>
        </div>
      </div>
);
};
export default Header;