import React from "react";

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-green-600 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <h1 className="text-3xl font-bold text-white">EssayPrep</h1>
          <nav className="flex items-center space-x-6">
            <a href="/dashboard" className="text-white hover:text-gray-200">
              Dashboard
            </a>
            <a href="/courses" className="text-white hover:text-gray-200">
              Courses
            </a>
            <a href="/contact" className="text-white hover:text-gray-200">
              Contact
            </a>
            <a
              href="/signin"
              className="px-4 py-2 bg-white text-green-600 font-semibold rounded-lg shadow hover:bg-gray-100"
            >
              Sign In
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between">
          {/* Left Text */}
          <div className="text-center md:text-center max-w-lg">
            <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Write Your Best Essay with EssayPrep
            </h2>
            <p className="mt-6 text-lg text-gray-700">
              Empowering you to master essay-writing with expert guidance and
              comprehensive feedback tailored to your needs.
            </p>
            <div className="mt-8 space-x-4">
              <a
                href="/signin"
                className="px-6 py-3 bg-green-600 text-white text-lg rounded-lg shadow-md hover:bg-green-700"
              >
                Get Started
              </a>
              <a
                href="/learn-more"
                className="px-6 py-3 border border-gray-300 text-lg rounded-lg shadow-md hover:bg-gray-100"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-10 md:mt-0">
            <img
              src="./pages/images/welcome.jpeg"
              alt="Welcome Hero"
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* How It Works Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-3xl font-bold text-gray-900 text-center">
              How It Works
            </h3>
            <p className="text-gray-600 text-center mt-4">
              Follow these simple steps to excel with EssayPrep.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mt-12">
              {[
                { step: "Choose Your Exam", icon: "📝" },
                { step: "Write Your Essay", icon: "✍️" },
                { step: "Submit for Review", icon: "📤" },
                { step: "Get Detailed Feedback", icon: "📈" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-lg transition hover:shadow-xl"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    {item.step}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Exams Section */}
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-3xl font-bold text-gray-900 text-center">
              Popular Exams
            </h3>
            <p className="text-gray-600 text-center mt-4">
              Explore the exams we support and start practicing today.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-12">
              {["IELTS", "TOEFL", "GRE", "GMAT", "SAT"].map((exam) => (
                <div
                  key={exam}
                  className="p-6 bg-white rounded-lg shadow-md text-center transition hover:shadow-lg"
                >
                  <h4 className="font-bold text-gray-800 text-lg">{exam}</h4>
                  <p className="text-gray-600 mt-2">
                    Hone your skills and get expert feedback.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-600 py-6">
        <div className="max-w-7xl mx-auto text-center text-white">
          <p className="font-light">© 2024 EssayPrep. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
