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
        To decode a hidden message from an image, just choose an image and hit
        the Decode button.
        <br />
        Neither the image nor the message that has been hidden will be at any
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
                accept="image/*"
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
            <Button className={"bg-[#9d83ab]"}>Decrypt</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
