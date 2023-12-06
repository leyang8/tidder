"use client"
// pages/createForumPage.js
"use client";
import React, { useState } from "react";

const CreateForumPage = () => {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const forumData = { title, comment };

    // Post forum data to your API endpoint
    const response = await fetch("/api/createForum", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(forumData),
    });

    if (response.ok) {
      console.log("Forum created successfully");
      // Handle success, e.g., redirect to another page or show success message
    } else {
      console.error("Failed to create forum");
      // Handle error, e.g., show error message
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Create Forum
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="forum-title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="forum-title"
                    id="forum-title"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter your forum title here"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={255}
                    required
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="forum-content"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Leave your first comment to lead the conversation
                </label>
                <div className="mt-2">
                  <textarea
                    id="forum-content"
                    name="forum-content"
                    rows={6}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="What are you thinking about?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={255}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateForumPage;
