'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Breadcrumbs = () => {
    const pathname = usePathname();
    const pathnames = pathname.split('/').filter((path) => path !== '');


  if (!pathname || pathname === '/') return null;

  const breadcrumbItems = [{ label: 'Home', href: '/' }];

  pathnames.forEach((pathname, index) => {
    const href = `/${pathnames.slice(0, index + 1).join('/')}`;
    breadcrumbItems.push({ label: pathname.replace(/-/g, ' '), href });
  });

  if (breadcrumbItems.length > 1 && breadcrumbItems[breadcrumbItems.length - 1].label === 'id') {
    breadcrumbItems.pop();
  }

  return (
    <nav className='bg-white'>
    <div className='text-xs md:text-base font-medium text-gray-800 container mx-auto flex  p-3 lg:px-10 lg:py-4 items-center capitalize '>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index === breadcrumbItems.length - 1 ? (
            <span className='text-[#7d9626]'>{item.label}</span>
          ) : (
            <Link href={item.href}>
              <p className='text-gray-600 hover:underline'>{item.label}</p>
            </Link>
          )}
          {index < breadcrumbItems.length - 1 && <span className='mx-2'>&gt;</span>}
        </React.Fragment>
      ))}
    </div>
    </nav>
  );
};

export default Breadcrumbs;

