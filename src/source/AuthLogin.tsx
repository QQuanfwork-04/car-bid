const Login = () => {
    return (
    <>
    <form>
        <h2>Login</h2>
        <input
        id="login_email "
        className="login_email "
        type="email"
        placeholder="Input your email"
        required
        ></input>
        <input
        id="password"
        type="password"
        className="password"
        placeholder="Input your password"
        required
        ></input>
        <button>Login</button>
    </form>
    </>
    )

}
export default Login;