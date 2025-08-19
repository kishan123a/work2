import React, { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to toggle the mobile menu state
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full px-4 sm:px-6 lg:px-24 py-6 border-b border-white flex justify-between items-center z-50">
      {/* Logo */}
      <div className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight">AgroIntel</div> {/* Adjusted font size for responsiveness */}

      {/* Desktop Navigation (hidden on small screens) */}
      <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
        <a href="#hero" className="text-white text-base font-semibold leading-6 hover:underline">Home</a>
        <a href="#about-us" className="text-white text-base font-semibold leading-6 hover:underline">About Us</a>
        <a href="#contact" className="text-white text-base font-semibold leading-6 hover:underline">Contact Us</a>
        {/* <div className="flex items-center space-x-2 cursor-pointer group">
          <span className="text-white text-base font-semibold leading-6 group-hover:underline">Pages</span>
         
          <svg className="w-4 h-4 text-white transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div> */}
      </nav>

      {/* Desktop Auth Buttons (hidden on small screens) */}
      {/* <div className="hidden md:flex items-center space-x-8">
        <button className="px-6 py-3 lg:px-10 lg:py-4 bg-brandGreen rounded-full text-white text-base lg:text-xl font-semibold leading-6 text-center shadow-md hover:bg-teal-700 transition-colors duration-300">Login</button>
        <button className="px-6 py-3 lg:px-10 lg:py-4 bg-white rounded-full text-brandGreen text-base lg:text-xl font-semibold leading-6 text-center shadow-md hover:bg-gray-100 transition-colors duration-300">Sign up</button>
      </div> */}

      {/* Mobile Menu Button (Hamburger Icon) */}
      <div className="md:hidden">
        <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {/* Changed transform translate-x to opacity for fade-in/out effect */}
      <div className={`fixed inset-0 bg-teal-800 bg-opacity-90 z-50 transition-opacity duration-300 ease-in-out md:hidden
        ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
      `}>
        <div className="flex justify-end p-6">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <nav className="flex flex-col items-center space-y-8 mt-16">
          <a href="#hero" onClick={toggleMobileMenu} className="text-white text-xl font-semibold leading-6 hover:underline">Home</a>
          <a href="#about-us" onClick={toggleMobileMenu} className="text-white text-xl font-semibold leading-6 hover:underline">About Us</a>
          <a href="#contact" onClick={toggleMobileMenu} className="text-white text-xl font-semibold leading-6 hover:underline">Contact us</a>
          {/* <button onClick={toggleMobileMenu} className="px-8 py-3 bg-white rounded-full text-brandGreen text-lg font-semibold leading-6 text-center shadow-md hover:bg-gray-100 transition-colors duration-300">Login</button>
          <button onClick={toggleMobileMenu} className="px-8 py-3 bg-brandGreen rounded-full text-white text-lg font-semibold leading-6 text-center shadow-md hover:bg-teal-700 transition-colors duration-300">Sign up</button> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;