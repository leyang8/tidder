import { ForumComponentProps } from '@/types'
import { Card } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import CommentComponent from './CommentComponent'


const ForumComponent = ({forumData}: ForumComponentProps) => {
    const [comments, setComments] = useState([])

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
        fetchComments()
    }, [])
  return (
    <Card className = "max-w-xl">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {forumData.title}
        </h5>
        <p>Created on: {new Date(forumData.creationDate).toLocaleString()}</p>
        <p>Created by user: {forumData.creatorID}</p>

        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Comments:
        </h5>
        <div className='results'>
        {comments.map((result) => (
          <div className="mt-10">            
            <CommentComponent commentData={result}/>
         </div>
         ))}  
         </div>


    </Card>
  )
}

export default ForumComponent