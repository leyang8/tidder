import { Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { ForumComponent } from '.';

const Dashboard = () => {
    const [forums, setForums] = useState([]);

    async function fetchForums(){
        
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
        
        {forums.map((result, index) => (
            <div key={index} className="transition-transform transform hover:scale-105">
                 <ForumComponent forumData={result}/>
                 </div>
        ))} 

    </div>
</div>
  )
}

export default Dashboard