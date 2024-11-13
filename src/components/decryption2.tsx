"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export function Decryption1() {
  const [sensitiveFileName, setSensitiveFileName] = useState<string | null>(null);
  const [key, setKey] = useState("");
  const [decryptedText, setDecryptedText] = useState<string | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFileName: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  const handleDecrypt = async () => {
    const fileInput = document.getElementById("sensitive") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file || !key) {
      alert("Please provide both a file and a key for decryption.");
      return;
    }

    const formData = new FormData();
    formData.append("audio_file", file);
    formData.append("password", key);

    try {
      const response = await fetch("http://localhost:8000/audio_txt/decode/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Decryption failed.");
      }

      const data = await response.json();
      setDecryptedText(data.extracted_text); 
    } catch (error) {
      console.error("Error decrypting text:", error);
      setDecryptedText("Decryption failed. Please check your file and key.");
    }
  };

  return (
    <div className="w-[100%] h-[100%] pt-2">
      <div className="flex max-w-[90%] mt-2 bg-[#24182a] p-3 rounded-xl border border-[#5f476b] text-[#9d83ab]">
        To decode a hidden message from an audio, just choose an audio and hit
        the Decode button.
        <br />
        Neither the audio nor the message that has been hidden will be at any
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
                onChange={(e) => handleFileChange(e, setSensitiveFileName)}
                accept="audio/*"
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
          <div className={"flex justify-between"}>
            <Button className={"bg-[#9d83ab]"} onClick={handleDecrypt}>
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
