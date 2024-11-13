"use client";

import React, { useState } from "react";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export function Encryption1() {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [key, setKey] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setCoverFile(file || null);
    setCoverFileName(file ? file.name : null);
  };

  const handleEncrypt = async () => {
    if (!coverFile || !text || !key) {
      alert("Please provide all required inputs.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio_file", coverFile);
      formData.append("text", text);
      formData.append("password", key);

      const response = await fetch("http://localhost:8000/audio_txt/encode/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to encrypt and download the file.");
      }

      const blob = await response.blob();
      const filename = `encrypted_audio.wav`;
      saveAs(blob, filename);
      alert("File encrypted successfully! Download will start shortly.");
    } catch (error) {
      console.error("Encryption failed:", error);
      alert("Failed to encrypt and download the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100%] h-[100%] pt-2">
      <div className="flex w-[100%] mt-2 bg-[#24182a] p-3 rounded-xl border border-[#5f476b] text-[#9d83ab]">
        To encode a message into an audio file, choose the file you want to use,
        enter your text, and hit the Encode button.
        <br /> Save the audio file, as it will contain your hidden message.
        <br /> Neither the audio file nor the message will be transmitted over the web, as everything happens within your browser.
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
              Cover File (.wav)
            </Label>
            <div className="flex items-center gap-2">
              <input
                id="cover"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="audio/*"
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
            <Button
              onClick={handleEncrypt}
              className="bg-[#9d83ab]"
              disabled={loading}
            >
              {loading ? "Encrypting..." : "Encrypt"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
