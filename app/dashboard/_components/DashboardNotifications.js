'use client';

import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DashboardNotifications = ({ className }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/dashboard/notifications');
    };

    return (
        <Button onClick={handleClick} variant='outline' size='icon' className={cn(`ml-auto shrink-0 ${className}`)}>
            <span className='relative'>
                <Bell className='h-5 w-5' />
                <span className='w-2 h-2 rounded-full bg-red-500 absolute right-0 top-0'></span>
            </span>
            <span className='sr-only'>Toggle notifications</span>
        </Button>
    );
};

export default DashboardNotifications;
