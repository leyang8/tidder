"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Profile = () => {
  const [currentUserID, setCurrentUserID] = useState<any>("");
  const [followers, setFollowers] = useState<any[]>([]);

  const fetchFollowerList = async () => {
    try {
      await fetch(`http://localhost:5002/api/profile/${currentUserID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            // throw new Error(`HTTP error! Status: ${response.status}`);
            console.log("HTTP error! Status: ", response.status);
          }
          return response.json();
        })
        .then((responseData) => {
          console.log("Followers:", responseData);
          setFollowers(responseData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error fetching current user ID:", error);
    }
  };

  useEffect(() => {
    const currentUserID = Cookies.get("currentUserID");
    if (currentUserID) {
      setCurrentUserID(currentUserID);
    }
    fetchFollowerList();

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
    //<div>Profile</div>
    /* <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Social Media App</title>
      <!-- Add your stylesheets and other meta tags here -->
</head>
<body class="flex h-screen">

  <!-- Follower List Column (1/3 of the screen) -->
  <div class="flex-none w-1/3 p-4 border-r border-gray-200">
    <!-- Replace the following ul with your actual follower list code -->
    <ul role="list" className="divide-y divide-gray-100">
      {people.map((person) => (
        <li key={person.email} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.imageUrl} alt="" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.email}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>

  <!-- Following List Column (1/3 of the screen) -->
  <div class="flex-none w-1/3 p-4 border-r border-gray-200">
    <!-- Add your code for the following list here -->
  </div>

  <!-- Notifications Column (1/3 of the screen) -->
  <div class="flex-none w-1/3 p-4">
    <!-- Add your code for the notifications tab here -->
  </div>

  <!-- Add your scripts and other HTML content here -->

</body> */
  );
};

export default Profile;
