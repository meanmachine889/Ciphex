"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export function Encryption1() {
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [key, setKey] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCoverFileName(selectedFile.name);
    }
  };

  const handleEncrypt = async () => {
    if (!file || !text) {
      alert("Please select a file and enter the sensitive text.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", text);
    formData.append("password", key);

    try {
      const response = await fetch("http://localhost:8000/img_text/encode/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      alert("File encrypted successfully! Download will start shortly.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.split(".")[0]}-enc.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error during encryption:", error);
      alert("Failed to encrypt the image. Please try again.");
    }
  };

  return (
    <div className="w-[100%] h-[100%] pt-2">
      <div className="flex w-[100%] mt-2 bg-[#24182a] p-3 rounded-xl border border-[#5f476b] text-[#9d83ab]">
        To encode a message into an image, choose the image you want to use,
        enter your text and hit the Encode button.
        <br /> Save the last image, it will contain your hidden message.
        Remember, the more text you want to hide, the larger the image has to
        be.
        <br /> In case you chose an image that is too small to hold your message
        you will be informed.
        <br /> Neither the image nor the message you hide will be at any moment
        transmitted over the web, all the magic happens within your browser.
      </div>
      <Card className="w-full max-w-md border-gray-700 bg-[#151423] mt-5 border-none shadow-sm">
        <CardContent className="space-y-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="key" className="text-sm font-medium text-[#9d83ab]">
              Key
            </Label>
            <Input
              id="key"
              type="password"
              placeholder="Enter your key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full border-gray-700 rounded-lg bg-transparent border p-3 text-white placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="text" className="text-sm font-medium text-[#9d83ab]">
              Sensitive Text
            </Label>
            <Input
              id="text"
              type="text"
              placeholder="Enter your text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border-gray-700 rounded-lg bg-transparent border p-3 text-white placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover" className="text-sm font-medium text-[#9d83ab]">
              Cover File
            </Label>
            <div className="flex items-center gap-2">
              <input
                id="cover"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="image/*"
              />
              <Button
                variant="ghost"
                className="w-full border justify-start items-center text-gray-500 hover:bg-gray-700 py-6 border-gray-700"
                onClick={() => document.getElementById("cover")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {coverFileName || "Choose File"}
              </Button>
            </div>
          </div>
          <div className="flex justify-between">
            <Button className="bg-[#9d83ab]" onClick={handleEncrypt}>
              Encrypt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
