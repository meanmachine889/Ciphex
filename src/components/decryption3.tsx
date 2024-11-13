"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export function Decryption1() {
  const [sensitiveFileName, setSensitiveFileName] = useState<string | null>(
    null
  );
  const [key, setKey] = useState("");
  const [sensitiveFile, setSensitiveFile] = useState<File | null>(null);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setSensitiveFile(file || null);
    setSensitiveFileName(file ? file.name : null);
  };

  const handleDecrypt = async () => {
    if (!sensitiveFile || !key) {
      alert("Please fill in all fields and select a file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("video_file", sensitiveFile);
    formData.append("password", key);
  
    try {
      const response = await fetch("http://localhost:8000/video_txt/decode/", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Decryption failed.");
      }
  
      const result = await response.json();
      setDecryptedText(result.extracted_text); 
    } catch (error) {
      console.error("Decryption failed:", error);
      alert("Decryption failed. Please try again.");
    }
  };
  

  return (
    <div className="w-[100%] h-[100%] pt-2">
      <div className="flex w-[100%] mt-2 bg-[#24182a] p-3 rounded-xl border border-[#5f476b] text-[#9d83ab]">
        To decode a hidden message from an video, just choose an video and hit
        the Decode button.
        <br />
        Neither the video nor the message that has been hidden will be at any
        moment transmitted over the web, all the magic happens within your
        browser.
      </div>
      <Card className="w-full max-w-md mt-5 border-gray-700 bg-[#151423] border-none shadow-sm">
        <CardContent className="space-y-6 py-5">
          <div className="space-y-2">
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
            <Label
              htmlFor="sensitive"
              className="text-sm font-medium text-[#9d83ab]"
            >
              Encrypted File
            </Label>
            <div className="flex items-center gap-2">
              <input
                id="sensitive"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="video/*"
              />
              <Button
                variant="ghost"
                className="w-full border justify-start items-center text-gray-500 hover:bg-gray-700 py-6 border-gray-700"
                onClick={() => document.getElementById("sensitive")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {sensitiveFileName || "Choose File"}
              </Button>
            </div>
          </div>

          <div className="flex justify-between">
            <Button onClick={handleDecrypt} className="bg-[#9d83ab]">
              Decrypt
            </Button>
          </div>

          {decryptedText && (
            <div className="mt-4 p-4 bg-[#24182a] text-[#9d83ab] rounded-lg">
              <Label className="text-sm font-medium text-[#9d83ab]">Decrypted Text</Label>
              <p className="text-white">{decryptedText}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
