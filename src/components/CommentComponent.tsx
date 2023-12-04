import { CommentComponentProps } from '@/types'
import { Accordion, Card } from 'flowbite-react'
import React, { useEffect, useState } from 'react'

const CommentComponent = ({commentData}: CommentComponentProps) => {
    const [children, setChildren] = useState([]);
    async function fetchChildrenComments(){

    }
    useEffect(() => {
        fetchChildrenComments()

    }, [])
  return (
    <Card>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {commentData.creatorID}
        </h5>
        <p>{commentData.content}</p>
        
        <Accordion>
            <Accordion.Panel>
                <Accordion.Title>
                    View replies
                </Accordion.Title>
                <Accordion.Content>
                <div className='results' id='results'>
                    {children.map((result, index) => (
                        <div key={index} className="transition-transform transform hover:scale-105 max-w-lg">
                            
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