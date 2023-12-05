import React, { FormEvent, useState } from "react";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const routeToDashboard = () => {
    window.location.href = "/dashboard";
  }
  const onLoginClick = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await loginHandler();
  };

  const loginHandler = async () => {
    try { 
      const response = await fetch('http://localhost:5002/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password})
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Login failed, please try again!');
        return;
      }

      const data = await response.json();
      const currentUser = data.user
      // Handle successful login (e.g., redirect, store user data)
      Cookies.set("currentUser", currentUser.username)
      routeToDashboard()
    } catch (error: any) {
      alert('Login error: ' + error.message);
      // Handle login error (e.g., show error message)
    }
};


  return (
    <>
      <section>
        <div className="form-box">
          <div className="form-value">
            <form action="">
              <h2>Login</h2>
              <div className="inputbox">
                <input 
                type="email"
                onChange={(e) => {setEmail(e.target.value)}}
                required />
                <label>Email</label>
              </div>
              <div className="inputbox">
                <input type="password"
                onChange={(e) => {setPassword(e.target.value)}}
                required />
                <label>Password</label>
              </div>
              <button onClick={onLoginClick}>Log in</button>
              <div className="register">
                <p>
                  Don't have an account? <a href="/register">Register</a>
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