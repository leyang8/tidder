import { ForumComponentProps } from '@/types'
import { Card } from 'flowbite-react'
import React, { useEffect } from 'react'


const ForumComponent = ({forumData}: ForumComponentProps) => {

    async function fetchComments(){

    }

    useEffect(() => {
        fetchComments()
    }, [])
  return (
    <Card>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {forumData.title}
        </h5>
        <p>Created on: {new Date(forumData.creationDate).toLocaleString()}</p>
        <p>Created by user: {forumData.creatorID}</p>

        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Comments:
        </h5>

    </Card>
  )
}

export default ForumComponent