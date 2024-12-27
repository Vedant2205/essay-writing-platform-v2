import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the form data to a server or API
    console.log('Form submitted:', formData);
    // For now, just log the form data
    // You can also clear the form after submission if you want:
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-green-600">EssayPrep</div>
        <nav className="space-x-4">
          <a href="/" className="text-gray-700 hover:text-green-600">Home</a>
          <a href="/dashboard" className="text-gray-700 hover:text-green-600">Dashboard</a>
        </nav>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-8">Have questions? Reach out to us using the form below!</p>
        <form onSubmit={handleSubmit} className="bg-white p-6 border rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-4 py-2"
              placeholder="Type your message"
            ></textarea>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Send Message
          </button>
        </form>
      </main>
    </div>
  );
};

export default ContactPage;
