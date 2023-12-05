"use client"
import { Alert, Button, Label, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { ForumComponent } from '.';
import { HiInformationCircle } from 'react-icons/hi';

const Dashboard = () => {
    const [forums, setForums] = useState([]);
    const [forumQuery, setForumQuery] = useState('');
    const [userQuery, setUserQuery] = useState('');
    const [showAlert, setShowAlert] = useState(false); // State to manage alert visibility
    const [alertMessage, setAlertMessage] = useState(''); 
    async function handleSubmit(event: React.FormEvent){
        event.preventDefault()
        const url = `http://localhost:5002/api/secure/forums/creator/${userQuery}`;
   
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
                setShowAlert(false)

                
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

        <form className="flex max-w-md flex-col gap-4 mt-10" onSubmit={handleSubmit}>
                <div className="mb-2 block">
                    <Label value="Creator Username (Optional):" />
                    <TextInput
                        required
                        placeholder="Example: john.smith"
                        shadow
                        onChange={(e) => {
                            setUserQuery(e.target.value);
                        }}
                    />
                </div>
                
                
                <Button className="transition-transform transform hover:scale-105" gradientDuoTone="purpleToPink" type="submit">Search!</Button>
                <Button className="transition-transform transform hover:scale-105" gradientDuoTone="purpleToPink" onClick={fetchForums}>Surprise me!</Button>
                {showAlert && <Alert color="failure" icon={HiInformationCircle}>{alertMessage}</Alert>}
            </form>
        
        {forums.map((result, index) => (
            <div key = {index} className="mt-10 mb-10">
                 <ForumComponent forumData={result}/>
                 </div>
        ))} 

    </div>
</div>
  )
}

export default Dashboard