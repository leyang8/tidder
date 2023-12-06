import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const FollowerList = () => {
    const [currentUserID, setCurrentUserID] =useState<any>('')
    const [followers, setFollowers] = useState<any []>([]);
    

    const fetchFollowerList = async () => {
        try {
          const response = await fetch(`/api/profile/${currentUserID}`, {
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
                setFollowers(responseData)
                
            })
            .catch(error => {
                console.error('Error:', error);
                
            }); 
          
          
      } catch (error) {
          console.error('Error fetching current user ID:', error);
        }
      };



  useEffect(() => {
    const currentUserID = Cookies.get("currentUserID")
    setCurrentUserID(currentUserID)

    fetchFollowerList()

    
        // Assuming you have a function to get the current user ID, replace this with your logic
  }, []);


  return (
    <div>
      <ul className="list-inside space-y-2">
        {followers.map((follower, index) => (
          <li key={index}>
            <div className="text-teal-600">{follower.username}</div>
            {/* Add other details you want to display */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowerList;