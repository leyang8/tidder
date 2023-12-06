"use client"
import { CommentComponentProps } from '@/types'
import { Accordion, Alert, Avatar, Button, Card, Label, TextInput } from 'flowbite-react';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { HiInformationCircle } from 'react-icons/hi';
import { FiHeart } from "react-icons/fi";
import { FaPoo } from "react-icons/fa";

const CommentComponent = ({commentData}: CommentComponentProps) => {
    const [children, setChildren] = useState([]);
    const [authorName, setAuthorName] = useState('')
    const [newReply, setNewReply] = useState('')
    const [userID, setUserID] = useState('')
    const [isAdmin, setIsAdmin] = useState('false')
    const [showAlert, setShowAlert] = useState(false); // State to manage alert visibility
    const [alertMessage, setAlertMessage] = useState('');
    const [likeCount, setLikeCount] = useState(0)
    const [dislikeCount, setDislikeCount] = useState(0)
    const [isReactionLike, setIsReactionLike] = useState(true)
    const [likeColour, setLikeColour] = useState('black')
    const [dislikeColour, setDislikeColour] = useState('black')
    const [hasUserReacted, setHasUserReacted] = useState(false)

    async function fetchHasUserReacted(){
        const url = `http://localhost:5002/api/secure/comments/${Cookies.get("currentUserID")}/${commentData.commentID}/reacted`;
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
                if(responseData == false){
                    setHasUserReacted(false)
                } else {
                    
                    console.log(responseData + " Reacted response data ")
                    setHasUserReacted(true)
                    if(responseData[0].isLike == 1){
                        setLikeColour("red")
                        setDislikeColour("black")
                        setIsReactionLike(true)
                    } else {
                        setLikeColour("black")
                        setDislikeColour("red")
                        setIsReactionLike(false)
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                
            });

    }
    async function handleDelete(event: React.FormEvent){
        event.preventDefault()
        const url = `http://localhost:5002/api/secure/comments/delete`;
        const data = {
            commentID: commentData.commentID
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
                setAlertMessage("Comment deleted!")
                setShowAlert(true)
               
                
            })
            .catch(error => {
                console.error('Error:', error);
                
            });


    }
    async function submitLike(event: React.FormEvent){
        event.preventDefault()
        
        setIsReactionLike(true)
        
        setLikeColour("red")
        setDislikeColour('black')
        const url = `http://localhost:5002/api/secure/comments/${commentData.commentID}/reactions`;
        const data = {
            isLike: isReactionLike,
            userID: userID,
            alreadyReacted: hasUserReacted
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
                console.log('POST successful:', responseData);
                if(hasUserReacted){
                    setDislikeCount(dislikeCount-1)
                }
                setLikeCount(likeCount + 1)
                setHasUserReacted(true)
                
            })
            .catch(error => {
                console.error('Error:', error);
                
            });



    }
    async function submitDislike(event: React.FormEvent){
        event.preventDefault()
        
        setIsReactionLike(false)
        setLikeColour('black')
        setDislikeColour('red')
        
        const url = `http://localhost:5002/api/secure/comments/${commentData.commentID}/reactions`;
        const data = {
            isLike: isReactionLike,
            userID: userID,
            alreadyReacted: hasUserReacted
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
                console.log('POST successful:', responseData);
                if(hasUserReacted){
                    setLikeCount(likeCount-1)
                }
                setHasUserReacted(true)
                setDislikeCount(dislikeCount+1)
                

                
            })
            .catch(error => {
                console.error('Error:', error);
                
            });



    }
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
    async function fetchReactions(){
        const url = `http://localhost:5002/api/secure/comments/${commentData.commentID}/reactions`;
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
                setLikeCount(responseData.likes)
                setDislikeCount(responseData.dislikes)
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
        const adminQuery = Cookies.get("isAdmin");
        
        if(adminQuery == 'true'){
            setIsAdmin('true')
        }
        if (currentUserID) {
            setUserID(currentUserID)
        }  
        fetchAuthorName()
        fetchReactions()
        fetchHasUserReacted()
        fetchChildrenComments()
        setShowAlert(false)

    }, [commentData])
  return (
    <Card>
        
        <div className="flex flex-wrap gap-2">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            @{authorName}
        </h5>
        
        </div>
        <p className='mb-5'>{commentData.content}</p>
        <div className="flex flex-wrap gap-2">
        <FiHeart size={28} color={likeColour} onClick={!(hasUserReacted && isReactionLike) ? submitLike : null}/>
        <Label>{likeCount}</Label>
        </div>
        <div className="flex flex-wrap gap-2">
        <FaPoo size={28} color={dislikeColour} onClick={!(hasUserReacted && !isReactionLike) ? submitDislike : null}/>
        <Label>{dislikeCount}</Label>
        </div>

        {(isAdmin == 'true') && 
        <Card>
            <form onSubmit={
                handleDelete}>
       
            <Label value="Admin Controls:" />
            
            <Button className="mt-5 mb-5 max-w-xl transition-transform transform hover:scale-105" color="failure" type="submit">Delete Comment</Button>
            {showAlert && <Alert color="success" icon={HiInformationCircle}>{alertMessage}</Alert>}
            </form>
            </Card>
        }
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