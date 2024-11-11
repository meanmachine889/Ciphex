"use client";

import React, { useState } from "react";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export function Encryption1() {
  const [exeFile, setExeFile] = useState<File | null>(null);
  const [exeFileName, setExeFileName] = useState<string | null>(null);
  const [key, setKey] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setExeFile(file || null);
    setExeFileName(file ? file.name : null);
  };

  const handleEncrypt = async () => {
    if (!exeFile || !text || !key) {
      alert("Please provide all required inputs.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("exe_file", exeFile);
      formData.append("text", text);
      formData.append("password", key);

      const response = await fetch("http://localhost:8000/exe_txt/encode/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to encrypt and download the file.");
      }

      const blob = await response.blob();
      const filename = `encrypted_${exeFileName}`;
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
    <div className="min-w-[80vw] h-[100%] pt-2">
      <div className="flex max-w-[90%] mt-2 bg-[#24182a] p-3 rounded-xl border border-[#5f476b] text-[#9d83ab]">
        To encode a message into an EXE file, choose the file you want to use,
        enter your text, and hit the Encode button.
        <br /> Save the EXE file, as it will contain your hidden message.
        <br /> Neither the EXE file nor the message will be transmitted over the web, as everything happens within your browser.
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
            <Label htmlFor="exe" className="text-sm font-medium text-[#9d83ab]">
              EXE File
            </Label>
            <div className="flex items-center gap-2">
              <input
                id="exe"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept=".exe"
              />
              <Button
                variant="ghost"
                className="w-full border justify-start items-center text-gray-500 hover:bg-gray-700 py-6 border-gray-700"
                onClick={() => document.getElementById("exe")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {exeFileName || "Choose EXE File"}
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
