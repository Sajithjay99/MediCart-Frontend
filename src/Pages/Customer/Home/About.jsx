import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="text-gray-800">
      {/* ✅ Hero Section */}
      <div className="relative h-[400px] w-full">
        <img
          src="/about-hero.jpg"
          alt="About Medicart"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0  bg-opacity-60 flex items-center justify-center">
          <div className="text-center text-white px-6 absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent flex flex-col justify-center items-start md:px-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Medicart</h1>
            <p className="">
              Committed to delivering trusted healthcare right to your doorstep — faster, safer, and smarter.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Story Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Who We Are</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          At <span className="font-semibold text-blue-600">Medicart</span>, we're reshaping the way healthcare is accessed.
          Founded with the mission to make high-quality medicines easily available and affordable, we’ve built a seamless,
          tech-driven pharmacy experience that patients trust. Whether it's timely delivery, AI assistance, or round-the-clock
          support — we ensure your wellness is never delayed.
        </p>
      </div>

      {/* ✅ Mission / Vision / Values */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: 'Our Mission',
              desc: 'To empower every individual with accessible, affordable, and genuine healthcare at the click of a button.',
            },
            {
              title: 'Our Vision',
              desc: 'To become the most trusted and innovative digital pharmacy across the region.',
            },
            {
              title: 'Our Values',
              desc: 'Integrity, empathy, efficiency, and customer-first approach in everything we do.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border-b-4 border-blue-600"
            >
              <h4 className="text-xl font-semibold text-blue-700 mb-3">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Team Section (Names only) */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: 'Sajith Jayasooriya', img: '/team1.jpg' },
            { name: 'Lasitha Dissanayaka', img: '/team2.jpg' },
            { name: 'Akash Jayasuriya', img: '/team3.jpg' },
            { name: 'Oshan Wanasekara', img: '/team4.jpg' },
          ].map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 text-center"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-28 h-28 mx-auto object-cover rounded-full mb-4 border-2 border-blue-600"
              />
              <h4 className="font-semibold text-blue-700">{member.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ CTA */}
      <div className="bg-blue-500/90 py-14 text-white text-center ">
        <h2 className="text-3xl font-bold mb-3">Have Questions About Us?</h2>
        <p className="mb-6">Reach out to our support team or explore more through our chatbot!</p>
        <Link
          to="/contactus"
          className="bg-white text-blue-600 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}

export default About;
