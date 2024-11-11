"use client";

import React from "react";
import { Encryption1 } from "@/components/encryption4";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Decryption1 } from "@/components/decryption4";

export default function Audio() {
  return (
    <div className="flex h-[30rem] items-start justify-center p-4 px-9">
      <Tabs defaultValue="Encryption" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 bg-[#19182a] min-h-fit min-w-fit p-3 py-2">
          <TabsTrigger value="Encryption">Encryption</TabsTrigger>
          <TabsTrigger value="Decryption">Decryption</TabsTrigger>
        </TabsList>
        <TabsContent value="Encryption">
          <Encryption1 />
        </TabsContent>
        <TabsContent value="Decryption">
          <Decryption1 />
        </TabsContent>
      </Tabs>
    </div>
  );
}
