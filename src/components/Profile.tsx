"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Alert, Avatar, Button, Card, Label, TextInput } from "flowbite-react";

const Profile = () => {
  const [currentUserID, setCurrentUserID] = useState<any>("");
  const [followers, setFollowers] = useState<any[]>([]);
  const [followings, setFollowings] = useState<any[]>([]);
  const [forums, setForums] = useState<any[]>([]);
  const [reactions, setReactions] = useState<any[]>([]);

  const fetchFollowerList = async (userID: number) => {
    try {
      await fetch(`http://localhost:5002/api/profile/${userID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            // console.log("HTTP error! Status: ", response.status);
          }
          return response.json();
        })
        .then((responseData) => {
          setFollowers(responseData);
        })
        .catch((error) => {
          console.error("Error:", JSON.parse(error));
        });
    } catch (error) {
      console.error("Error fetching current user ID:", error);
    }
  };

  const fetchFollowingList = async (userID: number) => {
    try {
      const response = await fetch(
        `http://localhost:5002/api/profile/following/${userID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((responseData) => {
          setFollowings(responseData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error fetching current user ID:", error);
    }
  };

  const fetchForumList = async (userID: number) => {
    try {
      const response = await fetch(
        `http://localhost:5002/api/profile/forumCreated/${userID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setForums(responseData);
    } catch (error) {
      console.error("Error fetching forum list:", error);
    }
  };

  const fetchReactionList = async (userID: number) => {
    try {
      const response = await fetch(
        `http://localhost:5002/api/profile/reaction/${userID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Result: ", responseData);
      setReactions(responseData);
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  };

  useEffect(() => {
    const userID = Cookies.get("currentUserID");
    if (userID) {
      setCurrentUserID(userID);
    }

    //Pass in the current user ID to fetch the list of followers
    fetchFollowerList(Number(userID));
    fetchFollowingList(Number(userID));
    fetchForumList(Number(userID));
    fetchReactionList(Number(userID));

    // Assuming you have a function to get the current user ID, replace this with your logic
  }, []);

  return (
    <>
      <section className="mt-5">
        <Card className="">
          <div className="userProfile">
            <h4>Username: </h4>
            <h4>Password: </h4>
            <h4>First Name: </h4>
            <h4>Middle Name: </h4>
            <h4>Last Name: </h4>
            <h4>Phone Number: </h4>
          </div>
          <div>
            <div className="text-teal-600 flex flex-wrap gap-2">
              <Card>
                <h2>Following:</h2>
                {followings.length !== 0 && (
                  <div className="gap-2">
                    {followings.map((following, index) => (
                      <Card key={index}>{following}</Card>
                    ))}
                  </div>
                )}
                {followings.length === 0 && (
                  <h5>
                    You're not following others yet! Go see others posts and
                    start following!
                  </h5>
                )}
              </Card>
              <Card>
                <h2>Followers:</h2>
                {followers.length !== 0 && (
                  <div className="gap-2">
                    {followers.map((follower, index) => (
                      <Card key={index}>{follower}</Card>
                    ))}
                  </div>
                )}
                {followings.length === 0 && (
                  <h5>No followers yet! Start post your comments!</h5>
                )}
              </Card>
            </div>

            {forums.length !== 0 ? (
              <ul className="list-inside space-y-2">
                {forums.map((forum, index) => (
                  <li key={index}>
                    <div className="text-teal-600">
                      You created forum titled {forum}
                    </div>
                    {/* Add other details you want to display */}
                  </li>
                ))}
              </ul>
            ) : (
              <h5>You have not created any forums yet. Start posting!</h5>
            )}

            {reactions.length !== 0 ? (
              <ul className="list-inside space-y-2">
                {reactions.map((reaction, index) => (
                  <li key={index}>
                    <div className="text-teal-600">
                      {reaction} liked your comment
                    </div>
                    {/* Add other details you want to display */}
                  </li>
                ))}
              </ul>
            ) : (
              <h5>There're no one likes your comment yet! Try posting more!</h5>
            )}
          </div>
        </Card>
      </section>
    </>
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
