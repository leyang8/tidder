"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CustomButton } from '.';
import Cookies from 'js-cookie';

import { get } from 'http';
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState('')
  const [username, setUsername] = useState('')
  const [admin, setAdmin] = useState('')
  async function handleLogout(){
    Cookies.remove('currentUserID');
    setUsername('')
    router.push('/login')
    
  }
  async function fetchUserName(userID: any){
    const url = `http://localhost:5002/api/secure/users/${userID}`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(responseData => {
            console.log('GET successful:', responseData);
            setUsername(responseData)
            
        })
        .catch(error => {
            console.error('Error:', error);
            
        });

}
  useEffect(() => {
    const userQuery = Cookies.get("currentUserID");
    if(userQuery){
      fetchUserName(userQuery)
    } else{
      setUsername('')
    }


    
    
  }, [username])

  
  return (
    <header className="w-full absolute z-9">
      <nav className="mt-3 bg-blue-300 max-w-[1440px] mx-auto flex justify-between items-center rounded-2xl sm:px-16 px-6 py-4">
        <Link href="/" className="flex justify-center items-center z-10">
          <Image
            src="next.svg"
            alt="logo"
            width={118}
            height={18}
            className="object-contain transition-transform transform hover:scale-105" 
          />
        </Link>

        <div className="flex space-x-4">         
          <CustomButton
            title="Dashboard"
            href="/dashboard"
            btnType="button"
            containerStyles="text-white rounded-xl bg-black-100 min-w-w[130px] transition-transform transform hover:scale-105"
          />
          
          
          <CustomButton
            title="Profile"
            href="/profile"
            btnType="button"
            containerStyles="text-white rounded-xl bg-black-100 min-w-w[130px] transition-transform transform hover:scale-105"
          />
          {username == '' && 
          <CustomButton
            title="Sign In"
            href="/login"
            btnType="button"
            containerStyles="text-white rounded-xl bg-black-100 min-w-w[130px] transition-transform transform hover:scale-105"
          />
          }
          
          {username != '' && 
          
          <CustomButton
            handleClick={handleLogout}
            title="Logout"
            btnType="button"
            containerStyles="text-white rounded-xl bg-black-100 min-w-w[130px] transition-transform transform hover:scale-105"
          />
 
          }
        </div>

      </nav>
    </header>
  );
};

export default Navbar;
