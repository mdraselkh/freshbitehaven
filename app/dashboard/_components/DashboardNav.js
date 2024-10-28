"use client";

import {
  KeyRound,
  LayoutDashboard,
  LockKeyholeOpen,
  Package,
  PackagePlus,
  ShoppingCart,
  Truck,
  UserRoundPen,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { MdAddHomeWork, MdAssignmentAdd } from "react-icons/md";
import { CgWebsite } from "react-icons/cg";
import { IoMdImages } from "react-icons/io";
import { BiSolidCommentAdd } from "react-icons/bi";
import { TbBrandBlogger } from "react-icons/tb";
import { GrUserManager } from "react-icons/gr";

const DashboardNav = () => {
  const pathname = usePathname();
  const { data: session,status } = useSession();
  // const isAdmin = session?.user?.role === "admin";
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
        return; 
    }
    if (status === 'unauthenticated') {
        router.push('/login');
    }
}, [session, status, router]);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };


  return (
    <nav className="grid items-start px-2 font-medium lg:px-4 gap-1">
      <Link
        href={`/dashboard`}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          pathname === `/dashboard` && "bg-muted text-primary"
        } `}
      >
        <LayoutDashboard className="size-5" />
        <span className="inline lg:hidden xl:inline">Dashboard</span>
      </Link>

      <Link
        href={`/dashboard/orders`}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          pathname.includes("orders") && "bg-muted text-primary"
        }`}
      >
        <ShoppingCart className="size-5" />
        <span className="inline lg:hidden xl:inline">Orders</span>
      </Link>

      <>
        <Link
          href={`/dashboard/products`}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
            pathname.includes("products") && "bg-muted text-primary"
          }`}
        >
          <Package className="size-5" />
          <span className="inline lg:hidden xl:inline">Products</span>
        </Link>
        <Link
          href={`/dashboard/add-product`}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
            pathname.includes("add-product") && "bg-muted text-primary"
          }`}
        >
          <PackagePlus className="size-5" />
          <span className="inline lg:hidden xl:inline"> Add Product</span>
        </Link>
        <Link
        href={`/dashboard/add-category`}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          pathname.includes('add-category') && 'bg-muted text-primary'
        }`}
      >
        <MdAssignmentAdd  className='size-5' />
        <span className='inline lg:hidden xl:inline'>Add Category</span>
      </Link>
        <Link
        href={`/dashboard/add-subcategory`}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          pathname.includes('add-subcategory') && 'bg-muted text-primary'
        }`}
      >
        <MdAssignmentAdd  className='size-5' />
        <span className='inline lg:hidden xl:inline'>Add SubCategory</span>
      </Link>
        <Link
          href={`/dashboard/add-shipping-cost`}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
            pathname.includes("add-shipping-cost") && "bg-muted text-primary"
          }`}
        >
          <Truck className="size-5" />
          <span className="inline lg:hidden xl:inline">Add Shipping Cost</span>
        </Link>
        <Link
        href={`/dashboard/add-home-data`}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          pathname.includes('add-home-data') && 'bg-muted text-primary'
        }`}
      >
        <MdAddHomeWork  className='size-5' />
        <span className='inline lg:hidden xl:inline'>Add Home Data</span>
      </Link>
        <Link
        href={`/dashboard/add-blog-data`}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          pathname.includes('add-blog-data') && 'bg-muted text-primary'
        }`}
      >
        <BiSolidCommentAdd  className='size-5' />
        <span className='inline lg:hidden xl:inline'>Add Blog Post</span>
      </Link>
        <Link
        href={`/register`}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          pathname.includes('register') && 'bg-muted text-primary'
        }`}
      >
        <GrUserManager className='size-5' />
        <span className='inline lg:hidden xl:inline'>Create New Admin</span>
      </Link>
        <Link
        href={`/dashboard/blog-data`}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          pathname.includes('blog-data') && 'bg-muted text-primary'
        }`}
      >
        <TbBrandBlogger   className='size-5' />
        <span className='inline lg:hidden xl:inline'>Blog Posts</span>
      </Link>
        <Link
        href={`/dashboard/poster-images`}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          pathname.includes('poster-images') && 'bg-muted text-primary'
        }`}
      >
        <IoMdImages  className='size-5' />
        <span className='inline lg:hidden xl:inline'>Poster Images</span>
      </Link>
        <Link
          href={`/dashboard/users`}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
            pathname.includes("users") && "bg-muted text-primary"
          }`}
        >
          <Users className="size-5" />
          <span className="inline lg:hidden xl:inline">Users</span>
        </Link>
      </>

     
      
      <button
        onClick={handleSignOut}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary `}
      >
        <LockKeyholeOpen className="size-5" />
        <span className="inline lg:hidden xl:inline">Logout</span>
      </button>
    </nav>
  );
};

export default DashboardNav;
