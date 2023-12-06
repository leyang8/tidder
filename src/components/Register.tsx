"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  function homePage() {
    router.push("/");
  }

  function loginPage() {
    router.push("/login");
  }

  const postData = {
    email: email,
    username: username,
    password: password,
    firstname: firstName,
    middlename: middleName,
    lastname: lastName,
    phoneNumber: phoneNumber,
  };

  const fetchURL = `http://localhost:5002/api/register`;

  function createAccount() {
    if (email && username && password && firstName && lastName && phoneNumber) {
      register();
      clearForm();
    }
  }

  function clearForm() {
    setEmail("");
    setUsername("");
    setPassword("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setPhoneNumber("");
  }

  const register = () => {
    fetch(fetchURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch((err) => alert(err));
  };

  return (
    <>
      <section className="mt-5">
        <div className="form-box mt-10">
          <div className="form-value">
            <form action="">
              <h2>Create Account</h2>
              <div className="inputbox">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="">Email</label>
              </div>
              <div className="inputbox">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="">Username</label>
              </div>
              <div className="inputbox">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="">Password</label>
              </div>
              <div className="inputbox">
                <div className="name">
                  <input
                    type="text"
                    placeholder="First"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Middle"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="inputbox">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <label htmlFor="">Phone Number</label>
              </div>
              <button onClick={createAccount}>Create</button>
              <div className="register">
                <p>
                  Already have an account?{" "}
                  <a href="#" onClick={loginPage}>
                    Login
                  </a>
                </p>
                <p>
                  <a href="#" onClick={homePage}>
                    Home
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
