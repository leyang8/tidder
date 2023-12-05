import { CommentComponentProps } from '@/types'
import { Accordion, Card } from 'flowbite-react';

import React, { useEffect, useState } from 'react'

const CommentComponent = ({commentData}: CommentComponentProps) => {
    const [children, setChildren] = useState([]);
    const [authorName, setAuthorName] = useState('')
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
        
        <Accordion collapseAll>
            <Accordion.Panel>
                    <Accordion.Title>View Replies</Accordion.Title>
                    <Accordion.Content>
                        <div className='results' id='results'>
                        {children.map((result) => (
                            <div className="mt-5">
                                <CommentComponent commentData={result}/>
                            </div>
                        ))}     
                        </div>
                    </Accordion.Content>
                </Accordion.Panel>
                
                
            </Accordion>
    </Card>
  )
}

export default CommentComponent