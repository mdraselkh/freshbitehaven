'use client';
import React from 'react';
import { Card, CardContent } from './ui/card';
import { CircleUser } from 'lucide-react';
import { useSession } from 'next-auth/react';

const UserProfileCard = () => {
    const { data: session } = useSession(); 
    return (
        <section className='py-2'>
            <Card className='max-w-sm'>
                <CardContent className='p-4'>
                    <div className='flex items-center gap-3 relative'>
                        <CircleUser size={48} />
                        <span className='text-xl font-bold'>{session?.user?.fullname || 'Admin Dashboard'}</span>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

export default UserProfileCard;
