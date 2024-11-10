"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export function Encryption1() {
  const [CoverFileName, setCoverFileName] = useState<string | null>(null);
  const [key, setKey] = useState("");
  const [text, setText] = useState("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFileName: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : null);
  };
  return (
    <div className="min-w-[80vw] h-[100%] pt-2">
      <div className="flex min-w-[100%] mt-2 bg-[#24182a] p-3 rounded-xl border border-[#5f476b] text-[#9d83ab]">
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
        <CardContent className="space-y-6 py-5 ">
          <div className="space-y-2 ">
            <Label htmlFor="key" className="text-sm font-medium text-[#9d83ab]">
              Key
            </Label>
            <Input
              id="key"
              type="text"
              placeholder="Enter your key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full border-gray-700 rounded-lg bg-transparent border p-3 text-white placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key" className="text-sm font-medium text-[#9d83ab]">
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
            <Label
              htmlFor="sensitive"
              className="text-sm font-medium text-[#9d83ab]"
            >
              Cover File
            </Label>
            <div className="flex items-center gap-2">
              <input
                id="cover"
                type="file"
                className="sr-only"
                onChange={(e) => handleFileChange(e, setCoverFileName)}
                accept="image/*"
              />
              <Button
                variant="ghost"
                className="w-full border justify-start items-center text-gray-500 hover:bg-gray-700 py-6 border-gray-700"
                onClick={() => document.getElementById("sensitive")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {CoverFileName || "Choose File"}
              </Button>
            </div>
          </div>
          <div className={"flex justify-between"}>
            <Button className={"bg-[#9d83ab]"}>Encrypt</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
