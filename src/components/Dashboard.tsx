import { Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { ForumComponent } from '.';

const Dashboard = () => {
    const [forums, setForums] = useState([]);

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
    useEffect(() => {
        fetchForums()
    }, [])
  return (
    <div className="hero">
    <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">
            Tidder
        </h1>
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