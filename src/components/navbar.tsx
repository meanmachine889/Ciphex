import React from "react";
import Avatar from "boring-avatars";
import { Button } from "@/components/ui/button";
import { FileMusic, FileVideo, Image, File } from "lucide-react";  // Import the File icon for "Exe"

interface NavParams {
  name: string;
  page: string;
  setFunction: React.Dispatch<React.SetStateAction<string>>;
}

export const NavBar: React.FC<NavParams> = (props) => {
  return (
    <div
      className={
        "h-[100vh] w-fit mx-2 rounded-xl flex flex-col items-start gap-3 justify-start py-5 px-3"
      }
    >
      <div
        className={
          "flex text-gray-400 bg-[#313041] rounded-lg gap-5 p-2 px-5 items-center justify-center"
        }
      >
        <Avatar size={30} name={props.name} variant="beam" />
        <p>{props.name}</p>
      </div>
      <div className="h-1 border-t w-full border-[#45434c]"></div>
      <Button
        variant={"ghost"}
        onClick={() => props.setFunction("Image")}
        className={
          `text-md px-2 flex justify-start gap-3 items-center w-full hover:bg-[#242233] hover:text-[#4e4b56]  mt-1 ${props.page === "Image" ? "bg-[#242233] text-[#bbb0d3]" : "text-[#4e4b56]"}` 
        }
      >
        <Image /> Image{" "}
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => props.setFunction("Audio")}
        className={`text-md px-2 flex justify-start gap-3 items-center w-full hover:bg-[#242233] hover:text-[#4e4b56]  mt-1 ${props.page === "Audio" ? "bg-[#242233] text-[#bbb0d3]" : "text-[#4e4b56]"}`}
      >
        <FileMusic />
        Audio
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => props.setFunction("Video")}
        className={`text-md px-2 flex justify-start gap-3 items-center w-full hover:bg-[#242233] hover:text-[#4e4b56]  mt-1 ${props.page === "Video" ? "bg-[#242233] text-[#bbb0d3]" : "text-[#4e4b56]"}`}
      >
        {" "}
        <FileVideo /> Video
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => props.setFunction("Exe")}
        className={`text-md px-2 flex justify-start gap-3 items-center w-full hover:bg-[#242233] hover:text-[#4e4b56]  mt-1 ${props.page === "Exe" ? "bg-[#242233] text-[#bbb0d3]" : "text-[#4e4b56]"}`}
      >
        <File /> EXE
      </Button>
    </div>
  );
};
