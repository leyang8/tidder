import React from "react";
import Image from "next/image";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
const Welcome = () => {
  return (
    <div className="hero">
      <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">Tidder</h1>
        <p>Welcome to Tidder! Register for an account or sign in below!</p>
        <Button
          className="mt-10 transition-transform transform hover:scale-105 max-w-xl"
          gradientDuoTone="purpleToPink"
          href="/register"
        >
          Sign up!
        </Button>
        <Button
          className="mt-10 transition-transform transform hover:scale-105 max-w-xl"
          gradientDuoTone="purpleToPink"
          href="/login"
        >
          Login!
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
