import { MouseEventHandler } from "react";

export interface CustomButtonProps {
    title: string;
    containerStyles?: string;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
    btnType?: "button" | "submit";
    href?: string;
}
// Interface to hold superhero data
export interface SuperheroData {
    id: number;
    name: string;
    Gender: string;
    "Eye color": string;
    Race: string;
    "Hair color": string;
    Height: number;
    Publisher: string;
    "Skin color": string;
    Alignment: string;
    Weight: number;
  }
  
  export interface UserDataForAdmin{
    username: string,
    disabled: boolean,
    admin: boolean
  }

  export interface ListData {
    username: string;
    listName: string;
    description?: string;
    heroIDs: [number];
    publicList: boolean;
    date: Date
  }

  export interface ReviewData {
    listName: string,
    author: string,
    comment?: string,
    selectedStars: number,
    hidden: boolean
  }



  export interface ListResultProps {
    listData: ListData
  }

export interface AuthManager {
    username: string;
    signedIn: boolean;
}
export interface UserDataForAdminProps {
  userDataForAdmin: UserDataForAdmin
}
export interface ReviewProps {
  reviewData: ReviewData
}
export interface SuperheroResultProps {
    superheroData: SuperheroData;
}