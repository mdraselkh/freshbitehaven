"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image"; // To display the poster image
import { toast } from "react-toastify"; // Optional for notifications
import { AiOutlineCloseSquare } from "react-icons/ai";

const PopUpModal = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [popupImage, setPopupImage] = useState(null);

  useEffect(() => {
    const fetchPosterImage = async () => {
      // try {
      //   const response = await fetch("/api/popupimg");
      //   if (!response.ok) {
      //     throw new Error("Failed to fetch the poster image.");
      //   }
      //   const data = await response.json();
      //   setPopupImage(data.image);
      // } catch (error) {
      //   console.error(error.message);
      // }
    };

    fetchPosterImage();
  }, []);

  if (!popupImage || !showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white m-4 sm:m-0 p-5 rounded-lg shadow-lg w-full max-w-lg sm:max-w-sm md:max-w-md lg:max-w-lg ">
       
        <button
          className="absolute top-1 right-1 text-gray-600 hover:text-gray-800"
          onClick={() => setShowPopup(false)}
        >
          <AiOutlineCloseSquare className="text-lg" />
        </button>

        {/* Poster image container */}
        <div className="w-full h-72 sm:h-56 md:h-64 lg:h-72 relative p-2">
          {popupImage && (
            <Image
              src={popupImage}
              alt="Discount Poster"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUpModal;
