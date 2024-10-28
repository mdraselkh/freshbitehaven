'use client';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BlogCard = ({ title, image, date, blogSlug }) => {
  const router = useRouter();
  const handleReadMore = () => {
    router.push(`/blogs/${blogSlug}`);
  };

  return (
    <Link
      href={`/blogs/${blogSlug}`}
      className="flex flex-col items-center cursor-pointer border hover:shadow-lg mb-4"
    >
      <div className="w-full h-52 relative">
        <Image
          src={image} // Use dynamic image
          alt={title} // Use dynamic alt text
          width={160}
          height={144}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 border bg-[#7d9626] text-white text-sm px-3 py-1">
          {date} {/* Dynamically show the date */}
        </div>
      </div>
      <div className="mt-3 flex flex-col items-center justify-center">
        <div className="h-[100px]"><h3 className="text-lg font-bold text-center p-2">{title}</h3></div>
        <button
          onClick={handleReadMore}
          className="my-4 px-4 py-2 text-center bg-[#ffbd59] text-white font-semibold hover:border-2 hover:border-[#ffbd59] hover:bg-white hover:text-[#ffbd59]"
        >
          Read More
        </button>
      </div>
    </Link>
  );
};

export default BlogCard;
