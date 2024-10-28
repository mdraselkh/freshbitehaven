'use client';
import { useSession } from "next-auth/react";
import Dashboard from "./_components/Dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const { data: session, status } = useSession(); 
    console.log("status",status);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if (status === 'authenticated') {
            return; 
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-2">
            {/* <h1 className='text-2xl font-semibold'>Dashboard</h1>
            <p className='mt-2 text-sm text-gray-500'>Welcome back, John Doe!</p> */}
            <h1 className='text-2xl font-semibold px-6'>My Dashboard</h1>
            <Dashboard/>
        </div>
    );
}
