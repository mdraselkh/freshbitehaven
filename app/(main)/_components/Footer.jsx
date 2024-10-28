import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Customer Service Section */}
          <div>
            <h4 className="font-bold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link className="footer-link hover:underline" href="/contact-us">
                  FAQ
                </Link>
              </li>
              <li>
                <Link className="footer-link hover:underline" href="#">
                  Returns
                </Link>
              </li>
              <li>
                <Link className="footer-link hover:underline" href="#">
                  Shipping
                </Link>
              </li>
              <li>
                <Link className="footer-link hover:underline" href="/contact-us">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link className="footer-link" href="/about-us">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/contact-us">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link className="footer-link" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/shop">
                  Shop
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/blogs">
                  Blogs
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="#">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup & Social Media Section */}
          <div className="flex flex-col">
            <h4 className="font-bold text-lg mb-4 text-center sm:text-left">
              Stay Connected
            </h4>

            <form className="flex md:flex-col xl:flex-row mb-4">
              <input
                type="email"
                placeholder="Your Email"
                className="p-2 border border-gray-300 sm:w-auto  "
                required
              />
              <button className="bg-[#7d9626] text-white p-2 focus:outline-none font-semibold w-full sm:w-auto">
                Subscribe
              </button>
            </form>

            <div className="flex gap-4 sm:gap-1 lg:gap-4 justify-center sm:justify-start">
              <Link
                href="https://facebook.com"
                className="social-icon p-2 rounded-full border-2 border-[#ffbd59]"
              >
                <FaFacebookF className="hover:text-[#ffbd59]" />
              </Link>
              <Link
                href="https://instagram.com"
                className="social-icon p-2 rounded-full border-2 border-[#ffbd59]"
              >
                <FaInstagram className="hover:text-[#ffbd59]" />
              </Link>
              <Link
                href="https://twitter.com"
                className="social-icon p-2 rounded-full border-2 border-[#ffbd59]"
              >
                <FaTwitter className="hover:text-[#ffbd59]" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="social-icon p-2 rounded-full border-2 border-[#ffbd59]"
              >
                <FaLinkedinIn className="hover:text-[#ffbd59]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="mt-10 text-center">
          <h4 className="font-bold text-lg mb-2">Payment Methods</h4>
          <div className="flex justify-center space-x-3">
            <Image src="/bkash.jpg" alt="bKash" width={50} height={30} />
            <Image src="/visa.jpg" alt="Visa" width={50} height={30} />
            <Image
              src="/mastercard.jpg"
              alt="mastercard"
              width={50}
              height={30}
            />
            <Image src="/nagad.jpg" alt="Nagad" width={50} height={30} />
            <Image src="/rocket.jpg" alt="rocket" width={50} height={30} />
            <Image src="/cod.jpg" alt="cash" width={50} height={30} />
          </div>
        </div>
      </div>
      {/* Footer Bottom Section */}
      <div className="mt-8 text-center border-t border-gray-600 pt-6">
        <p>© 2024 FreshBite Haven. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
