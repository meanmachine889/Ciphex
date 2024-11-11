"use client";

import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/usecurruser';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from "lucide-react";
import { NavBar } from "@/components/navbar";
import ImageComponent from '@/components/ImageComponent';
import Audio from '@/components/Audio';
import Video from '@/components/Video';
import Exe from '@/components/Exe';

export default function Home() {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [page, setPage] = useState<string>("Image");
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const { fetchCurrentUser } = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            try {
                const result = await fetchCurrentUser();
                if (result.success) {
                    setCurrentUser(result.message);
                    toast({
                        title: "Success",
                        description: `Welcome, ${result.message}!`,
                        duration: 3
                    });
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: `Failed to fetch user data ${error}`,
                });
                setCurrentUser(null);
                router.push('/auth');
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    if (loading) {
        return (
            <div className={"w-[100%] h-[100vh] flex items-center justify-center"}>
                <Loader2 size={40} className={"animate-spin text-gray-400"} />
            </div>
        );
    }

    return (
        <div>
            {currentUser ? (
                <div className={"flex justify-between w-[100%] bg-gradient-to-r from-[#19182a] to-[#24182a] font-[family-name:var(--font-geist-mono)]"}>
                    <NavBar name={currentUser} setFunction={setPage} page={page} />
                    <div className='h-[100vh] flex-1 items-center justify-center flex p-3 py-5'>
                        <div className='h-[100%] rounded-xl shadow-xl w-[100%] flex bg-gradient-to-r from-[#292435] to-[#312435]'>
                            {page === "Image" ? (
                                <ImageComponent />
                            ) : page === "Audio" ? (
                                <Audio />
                            ) : page === "Video" ? (
                                <Video />
                            ) : page === "Exe" ? (
                                <Exe />
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
