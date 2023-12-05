import { MouseEventHandler } from "react";


export interface ForumData {
  forumID: number,
  title: string,
  creationDate: Date,
  creatorID: number,
  adminID: number
}

export interface ForumComponentProps{
  forumData: ForumData
}

export interface CommentData{
  commentID: number,
  parentCommentID: number,
  content: string,
  creationDate: Date,
  creatorID: number,
  forumID: number
}

export interface CommentComponentProps{
  commentData: CommentData
}