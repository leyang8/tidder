import React from "react";

const Login = () => {
  return (
    <>
      <section>
        <div className="form-box">
          <div className="form-value">
            <form action="">
              <h2>Login</h2>
              <div className="inputbox">
                <input type="email" required />
                <label htmlFor="">Email</label>
              </div>
              <div className="inputbox">
                <input type="password" required />
                <label htmlFor="">Password</label>
              </div>
              <div className="forget">
                <label htmlFor="">
                  <input type="checkbox" />
                  Remember Me <a href="#">Forget Password</a>
                </label>
              </div>
              <button>Log in</button>
              <div className="register">
                <p>
                  Don't have a account <a href="#">Register</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
