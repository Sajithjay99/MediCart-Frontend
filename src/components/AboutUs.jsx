import React from 'react';

function AboutUs() {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      
      {/* Header Section */}
      <div className="w-full bg-white text-gray-900 p-8 text-center shadow-md">
        <h1 className="text-4xl font-semibold">About Us</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Welcome to MediCart, your trusted online pharmacy offering quality medicines and quick delivery.
        </p>
      </div>

      {/* Company Overview Section */}
      <div className="w-full bg-gray-100 text-gray-900 py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            {/* Adjusted "How We Make a Difference" Heading */}
            <h2 className="text-3xl font-semibold mb-4 pl-6">
              How We Make a Difference
            </h2>
            <p className="text-lg max-w-3xl mx-auto pl-6">
              MediCart provides real-time customer support, secure and verified medicine ordering, 
              and a seamless shopping experience, ensuring the highest level of customer satisfaction.
            </p>
            <p className="text-lg max-w-3xl mx-auto pl-6 mt-4">
              Our platform makes it easy for customers to get their medications delivered swiftly and securely. 
              We prioritize safety and efficiency, offering reliable service and user-friendly navigation.
            </p>
          </div>
          <img src="/CompanyOverview.png" alt="Company Overview" className="rounded-lg shadow-lg w-full max-w-md mx-auto" />
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="w-full bg-white text-gray-900 py-12">
        <div className="container mx-auto flex flex-col items-center text-center">
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-xl max-w-3xl mx-auto">
            We strive to provide innovative, high-quality products that bring excitement and joy to our customers, 
            while ensuring the safety and convenience of every transaction.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="w-full bg-gray-100 text-gray-900 py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <img src="/OurStory.png" alt="Our Story" className="rounded-lg shadow-lg w-full max-w-md mx-auto" />
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
            <p className="text-lg max-w-3xl mx-auto">
              In 2025, fellow Sllit University students Lasitha, Sajith, Oshan, and Akash noticed a major shift in the way people shop and purchase products. Buyers didn’t want to be interrupted by ads; they wanted helpful information. In 2025, they founded MediCart, an online pharmacy, to help companies use that shift to grow better with inbound marketing.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="w-full bg-gray-50 text-gray-900 py-8">
        <div className="container mx-auto text-center">
          <p className="text-lg">&copy; 2025 MediCart. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
