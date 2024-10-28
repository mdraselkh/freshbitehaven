import { Grid2X2, Menu } from 'lucide-react';
import UserProfileCard from '@/components/UserProfileCard';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import DashboardGoHomeBtn from './_components/DashboardGoHomeBtn';
import DashboardNav from './_components/DashboardNav';
import DashboardNotifications from './_components/DashboardNotifications';

export default function DashboardLayout({ children }) {

    return (
        <div className='container mx-auto px-2 sm:px-4 md:px-8'>
            <UserProfileCard />
            <section>
                <div className='grid min-h-screen w-full grid-cols-1 lg:grid-cols-[80px_1fr] xl:grid-cols-[280px_1fr]'>
                    <aside className='hidden border-r bg-muted/40 lg:block'>
                        <div className='flex h-full max-h-screen flex-col gap-2'>
                            <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
                                <Grid2X2 className='h-5 w-5 hidden lg:inline-block xl:hidden' />
                                <span className='font-semibold xl:inline-block hidden'>Dashboard</span>
                            </div>
                            <div className='flex-1'>
                                <DashboardNav />
                            </div>
                        </div>
                    </aside>
                    <div className='flex flex-col'>
                        <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-2 lg:h-[60px] lg:px-6'>
                            <Sheet>
                                <div className='space-x-3'>
                                    <SheetTrigger asChild>
                                        <Button variant='outline' size='icon' className='shrink-0 lg:hidden'>
                                            <Menu className='h-5 w-5' />
                                            <span className='sr-only'>Toggle navigation menu</span>
                                        </Button>
                                    </SheetTrigger>
                                </div>
                                <SheetContent side='left' className='flex flex-col'>
                                    <span className='font-semibold pl-6'>Dashboard</span>
                                    <DashboardNav />
                                </SheetContent>
                            </Sheet>
                            <div className='ml-auto flex items-center gap-3'>
                                <DashboardGoHomeBtn />
                                <DashboardNotifications />
                            </div>
                        </header>
                        <main className='px-2 sm:px-4 lg:px-6 md:pt-0 pb-20'>{children}</main>
                    </div>
                </div>
            </section>
        </div>
    );
}
