"use client"
import { CommentComponentProps } from '@/types'
import { Accordion, Card, Label, TextInput } from 'flowbite-react';

import React, { useEffect, useState } from 'react'

const CommentComponent = ({commentData}: CommentComponentProps) => {
    const [children, setChildren] = useState([]);
    const [authorName, setAuthorName] = useState('')
    const [newReview, setNewReview] = useState('')
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
        fetchAuthorName()
        fetchChildrenComments()

    }, [])
  return (
    <Card>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            @{authorName}
        </h5>
        <p className='mb-10'>{commentData.content}</p>
        
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
        <div className="mb-2 block">
                    <Label value="Leave a review!" />
                    <TextInput
                        placeholder="Example: I agree!"
                        shadow
                        onChange={(e) => {
                            setNewReview(e.target.value);
                        }}
                    />
                </div>

                    
    </Card>
  )
}

export default CommentComponent