const Register = () => {
  return (
    <div className="w-full h-fit min-h-screen flex items-center justify-center relative overflow-hidden text-white">
      <img
        src="/src/assets/pexels-aboodi-18435520.jpg"
        className="w-full absolute h-full object-cover inset-0 mask-[linear-gradient(to_bottom,black_30%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]"

      />
      <div className="w-225 h-fit relative border-2 bg-linear-to-br from-gray-500 via-gray-600 to-gray-500">
      <h3 className="text-white!">Create your CarBid Account Now !!</h3>
      <p>
        <i>
          Join a transparent car buying and auction community – Place your bid
          in seconds.
        </i>
      </p>
      <form className="flex flex-col items-center leading-2 gap-3 m-6 h-max font-bold">
        <div className="grid grid-cols-[120px_1fr] items-center w-full max-w-100 gap-2.5 ">
          <label>FullName:</label>
          <input
            type="text"
            id="fullName"
            className="fullname border-2  bg-linear-to-br  from-blue-100 via-fuchsia-100 to-pink-300 border-slate-300 hover:from-blue-100 hover:via-fuchsia-200 hover:to-pink-400 py-2 px-3.5 rounded-2xl"
            placeholder="Input your fullname"
            required
          />
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center w-full max-w-100 gap-2.5 ">
          <label>Email: </label>
          <input
            type="email"
            id="email"
            className="email border-2 border-black py-2 px-3.5 rounded-2xl"
            placeholder="Input your email"
            required
          />
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center w-full max-w-100 gap-2.5  ">
          <label>Tel: </label>
          <input
            type="tel"
            id="number"
            inputMode="numeric"
            pattern="[0-9]{10,11}"
            maxLength= {11}
            className="email border-2 border-black py-2 px-3.5 rounded-2xl"
            placeholder="0123456789"
            required
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center w-full max-w-100 gap-2.5 ">
          <label>Password: </label>
          <input
            type="password"
            id="password"
            className="password border-2 border-black py-2 px-3.5 rounded-2xl"
            placeholder="Input your password"
            required
          />
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center w-full max-w-100 gap-2.5 ">
          <label>RePassword: </label>
          <input
            type="password"
            id="password"
            className="password border-2 border-black py-2 px-3.5 rounded-2xl"
            placeholder="Input your password"
            required
          />
        </div>
        <button className="w-30 h-11.25 border rounded-3xl bg-violet-400 duration-300 ease-out hover:bg-violet-500 text-white font-bold cursor-pointer hover:[text-shadow:1px_1px_2px_black,0_0_25px_blue,0_0_5px_darkblue]">
          Register
        </button>
        <p>
          Already have account,{" "}
          <a href="#" className="text-black hover:text-blue-500">
            {" "}
            Sign In{" "}
          </a>
        </p>
        <br></br>
      </form>
    </div>
    </div>
  );
};
export default Register;
