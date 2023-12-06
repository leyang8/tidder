"use client"
import { ForumComponentProps } from '@/types'
import { Alert, Avatar, Button, Card, Label, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import CommentComponent from './CommentComponent'
import Cookies from 'js-cookie'
import { HiInformationCircle } from 'react-icons/hi';


const ForumComponent = ({forumData}: ForumComponentProps) => {
    const [comments, setComments] = useState([])
    const [authorName, setAuthorName] = useState('')
    const [isAdmin, setIsAdmin] = useState('false')
    const [newReply, setNewReply] = useState('')
    const [userID, setUserID] = useState('')
    const [showAlert, setShowAlert] = useState(false); 
    const [alertMessage, setAlertMessage] = useState('');
 

    async function handleDelete(event: React.FormEvent){
        event.preventDefault()
        const url = `http://localhost:5002/api/secure/forums`;
        const data = {
            forumID: forumData.forumID
        }
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(responseData => {
                console.log('DELETE successful:', responseData);
                setAlertMessage("Forum deleted!")
                setShowAlert(true)
                
                
            })
            .catch(error => {
                console.error('Error:', error);
                
            });


    }
    async function submitReply(event: React.FormEvent){
        event.preventDefault()
        const url = `http://localhost:5002/api/secure/comments/new`;
        const data = {
            content: newReply,
            creatorID: userID,
            forumID: forumData.forumID
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(responseData => {
                console.log('GET successful:', responseData);
               
                
            })
            .catch(error => {
                console.error('Error:', error);
                
            });



    }
    async function fetchAuthorName(){
        const url = `http://localhost:5002/api/secure/users/${forumData.creatorID}`;
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
                setAuthorName(responseData)
            
            })
            .catch(error => {
                console.error('Error:', error);
                
            });

    }
    async function fetchComments(){
        const url = `http://localhost:5002/api/secure/forums/${forumData.forumID}/comments`;
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
                setComments(responseData)

                
                
            })
            .catch(error => {
                console.error('Error:', error);
                
            });

    }

    useEffect(() => {
        const currentUserID = Cookies.get("currentUserID");
        const adminQuery = Cookies.get("isAdmin");
        if (currentUserID) {
            setUserID(currentUserID)
        }  
        if(adminQuery == 'true'){
            setIsAdmin('true')
        }
        fetchComments()
        fetchAuthorName()
        setShowAlert(false)
    }, [forumData])
  return (
    <Card className = "max-w-5xl">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {forumData.title}
        </h5>
        <p>Created on: {new Date(forumData.creationDate).toLocaleString()}</p>
        <div className="flex flex-wrap gap-2">
        <p>Created by @{authorName}</p>
        
        </div>
        {isAdmin == 'true' && 
        <Card>
            <form onSubmit={handleDelete}>
       
            <Label value="Admin Controls:" />
            
            <Button className="mt-5 mb-5 max-w-xl transition-transform transform hover:scale-105" color="failure" type="submit">Delete Forum</Button>
            {showAlert && <Alert color="success" icon={HiInformationCircle}>{alertMessage}</Alert>}
            </form>
            </Card>
        }
        
        <Card>
            
        <form onSubmit={submitReply}>
            <div className="mb-2 block">
                    <Label value="Leave a new comment" />
                    <TextInput
                        placeholder="Example: This is a great forum!"
                        shadow
                        onChange={(e) => {
                            setNewReply(e.target.value);
                        }}
                    />
                </div>
                <Button className="mt-5 max-w-xl transition-transform transform hover:scale-105" gradientDuoTone="redToYellow" type="submit">Submit</Button>
                </form>
        <div className='results'>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Comments:
        </h5>
        {comments.map((result, index) => (
          <div className="mt-10" key={index}>            
            <CommentComponent commentData={result}/>
         </div>
         ))}  
         </div>
        </Card>


    </Card>
  )
}

export default ForumComponent