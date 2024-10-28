"use client";
// components/ContactSection.js

import { useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const faqData = [
  {
    question: "How do I place an order?",
    answer:
      "Simply browse our products, add items to your cart, and proceed to checkout.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards, PayPal, and online banking.",
  },
  {
    question: "Can I change my order after placing it?",
    answer:
      "Yes, contact us within 24 hours of placing your order to make changes.",
  },
];

const Contact = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-semibold text-gray-800 mb-4">
          Contact FreshBite Haven
        </h2>
        <p className="text-gray-600 mb-10">
          We’re here to help! Reach out with any questions, feedback, or support
          needs.
        </p>

        {/* Contact Form and Information */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <form className="bg-white shadow-lg rounded-lg p-6 space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300"
            />
            <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300">
              <option>Order Inquiry</option>
              <option>Product Feedback</option>
              <option>General Question</option>
            </select>
            <textarea
              placeholder="Your Message"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 h-32"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-[#7d9626] text-white font-semibold py-3 rounded-md hover:bg-[#6b7e27] transition duration-300"
            >
              Send Message
            </button>
          </form>

          {/* Quick Contact Information */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-left space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              Quick Contact Information
            </h3>
            <p className="text-gray-600">
              <strong>Email:</strong> contact@freshbitehaven.com
            </p>
            <p className="text-gray-600">
              <strong>Phone:</strong> 01932 587313
            </p>
            <p className="text-gray-600">
              <strong>Office Address:</strong> <br />
              FreshBite Haven Shop, <br />
              Beside Dhour Primary School, <br />
              Dhour, Turag, Dhaka
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-4 text-gray-600">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="w-6 h-6 hover:text-blue-600 transition duration-300" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="w-6 h-6 hover:text-pink-500 transition duration-300" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="w-6 h-6 hover:text-blue-400 transition duration-300" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="w-6 h-6 hover:text-blue-700 transition duration-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h3 className="text-2xl font-semibold text-gray-800">
            Operating Hours
          </h3>
          <p className="text-gray-600 mt-2">Monday - Friday: 9 AM - 6 PM</p>
          <p className="text-gray-600">Saturday: 10 AM - 4 PM</p>
          <p className="text-gray-600">Sunday: Closed</p>
        </div>

        {/* Location Map */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Find Us Here
          </h3>
          <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.080297133828!2d90.3672509261817!3d23.886771183525784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c38c0ec8e1ad%3A0x4fead09ae846aad4!2sDhour%2C%20Dhaka%201230!5e0!3m2!1sen!2sbd!4v1730101458286!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              title="Office Location Map"
            ></iframe>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="mt-12 bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            What Our Customers Say
          </h3>
          <p className="text-gray-600 italic">
            &quot;FreshBite Haven always delivers top quality! Highly
            recommend!&quot;
          </p>
          <p className="text-gray-600 italic mt-2">
            &quot;Customer service is friendly and prompt.&quot;
          </p>
          <p className="text-gray-600 italic mt-2">
            &quot;Fresh produce and great prices! Love it.&quot;
          </p>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-12 text-left">
          <h3 className="text-3xl font-semibold text-gray-800 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left text-lg font-medium text-gray-800 flex justify-between items-center focus:outline-none"
                >
                  {faq.question}
                  <span className="text-gray-500 transition-transform duration-300">
                    {activeFAQ === index ? "-" : "+"}
                  </span>
                </button>
                {activeFAQ === index && (
                  <p className="mt-2 text-gray-600 transition-opacity duration-300 ease-in-out">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Chat Support Button */}
      <button
        className="fixed bottom-8 right-8 bg-[#7d9626] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#6b7e27] transition duration-300"
        onClick={() => window.open("https://livechatprovider.com", "_blank")}
      >
        Chat with Us
      </button>
    </section>
  );
};

export default Contact;
