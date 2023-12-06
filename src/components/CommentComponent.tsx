"use client"
import { CommentComponentProps } from '@/types'
import { Accordion, Button, Card, Label, TextInput } from 'flowbite-react';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'

const CommentComponent = ({commentData}: CommentComponentProps) => {
    const [children, setChildren] = useState([]);
    const [authorName, setAuthorName] = useState('')
    const [newReply, setNewReply] = useState('')
    const [userID, setUserID] = useState('')

    async function submitReply(event: React.FormEvent){
        event.preventDefault()
        const url = `http://localhost:5002/api/secure/comments/reply`;
        const data = {
            parentCommentID: commentData.commentID,
            content: newReply,
            creatorID: userID,
            forumID: commentData.forumID
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
        const url = `http://localhost:5002/api/secure/users/${commentData.creatorID}`;
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
    async function fetchChildrenComments(){
        const url = `http://localhost:5002/api/secure/comments/${commentData.commentID}/children`;
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
                setChildren(responseData)

                
                
            })
            .catch(error => {
                console.error('Error:', error);
                
            });

    }
    useEffect(() => {
        const currentUserID = Cookies.get("currentUserID");
        if (currentUserID) {
            setUserID(currentUserID)
        }  
        fetchAuthorName()
        fetchChildrenComments()

    }, [commentData])
  return (
    <Card>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            @{authorName}
        </h5>
        <p className='mb-10'>{commentData.content}</p>
        {children.length!==0 &&
        <Card>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Replies:
        </h5>
            <div className='results' id='results'>
                        {children.map((result, index) => (
                            <div className="mt-5" key = {index}>
                                <CommentComponent commentData={result}/>
                            </div>
                        ))}     
                        </div>
        </Card>
    }
        <form onSubmit={submitReply}>
            <div className="mb-2 block">
                    <Label value="Leave a reply!" />
                    <TextInput
                        placeholder="Example: I agree!"
                        shadow
                        onChange={(e) => {
                            setNewReply(e.target.value);
                        }}
                    />
                </div>
                <Button className="mt-5 transition-transform transform hover:scale-105" gradientDuoTone="redToYellow" type="submit">Submit</Button>
                </form>

                    
    </Card>
  )
}

export default CommentComponent