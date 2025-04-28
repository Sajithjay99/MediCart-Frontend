import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for contacting Medicart Pharmacy!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="bg-gray-50 px-4 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-800">Contact Medicart Team</h2>
          <p className="text-gray-600 mt-4 text-lg">
            Have questions or need help? Reach out to us anytime.
          </p>
        </div>

        {/* Card Layout */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row gap-10 md:gap-0">
          
          {/* Left: Contact Info & Map */}
          <div className="flex-1 p-6 md:p-10 bg-blue-500/90 text-white flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Get in Touch</h3>
              <p className="text-blue-100">We're always happy to hear from you.</p>
              <ul className="space-y-2 text-blue-100 text-sm md:text-base">
                <li><i className="fas fa-envelope mr-2"></i> support@medicart.lk</li>
                <li><i className="fas fa-phone mr-2"></i> +94 77 123 4567</li>
                <li><i className="fas fa-map-marker-alt mr-2"></i> Colombo, Sri Lanka</li>
              </ul>
            </div>

            <div className="mt-8">
              <iframe
                title="Medicart Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.87089882005!2d79.77380947944126!3d6.9270786162328405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2595c4ff6d1cb%3A0x9e0e3b8f2a1e6bb1!2sColombo!5e0!3m2!1sen!2slk!4v1711694860223!5m2!1sen!2slk"
                className="w-full aspect-video rounded-lg border-none h-[200px]"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Right: Form */}
          <div className="flex-1 p-6 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we assist you?"
                  className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500/90 text-white font-semibold py-3 rounded-md hover:bg-black transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
