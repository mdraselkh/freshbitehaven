import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <div className="mb-10">
      <div className="bg-white">
        <div className="container mx-auto max-w-7xl p-5  flex items-center justify-between">
          <div className=" w-full">
            <h1 className="sm:text-2xl text-lg font-semibold ">
              About FreshBite Haven
            </h1>
            <p className="py-2 mr-8 sm:text-sm text-xs text-justify">
              At FreshBite Haven, we’re passionate about bringing the freshest
              and finest products right to your door. Our commitment to quality,
              health, and convenience has driven us to establish a haven where
              freshness is not just a promise but a guarantee. Whether it&apos;s
              seafood, organic produce, or carefully curated pantry staples,
              every item in our selection meets rigorous standards, ensuring
              that you receive only the best. We’re more than just a
              marketplace; we’re your partner in enjoying wholesome,
              sustainable, and delicious food options.
            </p>
          </div>
          <div className="w-full px-5 flex items-center justify-center mt-5 sm:mt-0">
            <Image
              src="/logo.png"
              alt="logo.png"
              width={200}
              height={20}
              className="w-[250px] h-[250px] object-fit"
            />
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="container mx-auto max-w-7xl p-5 flex items-center justify-between">
          <div className="w-full px-5 flex items-center justify-center">
            <Image
              src="/mission.jpg"
              alt="logo.png"
              width={200}
              height={20}
              className="lg:h-full lg:w-72 object-cover"
            />
          </div>
          <div className="w-full ml-5">
            <h1 className="sm:text-2xl text-lg font-semibold mt-5 sm:mt-0">
              Our Mission
            </h1>
            <p className="py-2 sm:text-sm text-xs text-justify">
              Our mission is to make quality food accessible and enjoyable for
              everyone, fostering healthier lifestyles and a sustainable future.
              We believe in empowering our customers with options that promote
              well-being, all while being mindful of our environmental impact.
              By partnering with local producers and sustainable suppliers,
              FreshBite Haven works tirelessly to bring you products that are
              ethically sourced and of the highest quality. We’re committed to
              reshaping food experiences by connecting people with food they can
              trust and savor.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="container mx-auto max-w-7xl p-5 flex items-center justify-between">
          <div className=" w-full">
            <h1 className="sm:text-2xl text-lg font-semibold ">Our Services</h1>
            <p className="py-2 mr-8 sm:text-sm text-xs text-justify">
              FreshBite Haven offers a range of convenient services tailored to
              meet your lifestyle needs. From doorstep delivery to subscription
              plans and personalized product recommendations, we aim to make
              your shopping experience as seamless as possible. Our easy-to-use
              platform allows you to explore and choose from a wide variety of
              fresh products, with flexible delivery options that suit your
              schedule. Additionally, our customer support team is dedicated to
              assisting you every step of the way, ensuring a hassle-free,
              delightful shopping experience every time.
            </p>
          </div>
          <div className="w-full px-5 flex items-center justify-center mt-5 sm:mt-0">
            <Image
              src="/service.jpg"
              alt="service.jpg"
              width={200}
              height={20}
              className="w-[250px] h-[250px] object-fit"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
