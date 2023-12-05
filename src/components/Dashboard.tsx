import { Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { ForumComponent } from '.';
import Cookies from 'js-cookie';

const Dashboard = () => {
    const [forums, setForums] = useState([]);
    const [currentUsername, setCurrentUsername] = useState<string>("")

    async function fetchForums(){
        const url = `http://localhost:5002/api/secure/forums`;
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
                setForums(responseData)
            })
            .catch(error => {
                console.error('Error:', error);
                
            });
        
    }

    const onLogout = () => {
        Cookies.remove('currentUser');
        window.location.href = '/'
    }
    useEffect(() => {
        // Get the username from cookies
        const current = Cookies.get("currentUser");
        if (current) {
            setCurrentUsername(current)
        }
        fetchForums();
    }, [])
  return (
    <div className="hero">
    <div className="flex-1 pt-36 padding-x">
        <div className="infoContainer">
            <h1 className="hero__title">
                Tidder, Welcome! {currentUsername}
            </h1>
            <button id='logoutBtn' onClick={onLogout}>Logout</button>
        </div>
        <p>
            Welcome to Tidder! View forums below!
        </p>
        
        {forums.map((result) => (
            <div className="mt-10 mb-10">
                 <ForumComponent forumData={result}/>
                 </div>
        ))} 

    </div>
</div>
  )
}

export default Dashboard