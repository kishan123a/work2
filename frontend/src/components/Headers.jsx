import React, { useState, useEffect } from 'react';
import { Button } from '../pages/ui/button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null); // ✅ fi
  // Function to toggle mobile menu state
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Observe which section is currently in viewport
 useEffect(() => {
  const sections = document.querySelectorAll("section[id]");

  const handleScroll = () => {
    let current = null;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        current = section.getAttribute("id");
      }
    });
    setActiveSection(current);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  return (
     <header className="fixed top-0 left-0 w-full px-4 sm:px-6 lg:px-24 py-6 border-b border-white flex justify-between items-center z-50">
      {/* Logo */}
      <a
        href="#hero"
        className="text-black text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight"
      >
        AgroIntel
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
        <a
          href="#about-us"
          className={`text-base font-semibold leading-6 ${
            activeSection === "about-us"
              ? "text-teal-600 underline"
              : "text-black hover:underline"
          }`}
        >
          About Us
        </a>
        <a
          href="#Services"
          className={`text-base font-semibold leading-6 ${
            activeSection === "Services"
              ? "text-teal-600 underline"
              : "text-black hover:underline"
          }`}
        >
          Our Services
        </a>
        <a
          href="#Faq"
          className={`text-base font-semibold leading-6 ${
            activeSection === "Faq"
              ? "text-teal-600 underline"
              : "text-black hover:underline"
          }`}
        >
          FAQ's
        </a>
        <a
          href="#contact"
          className={`text-base font-semibold leading-6 ${
            activeSection === "contact"
              ? "text-teal-600 underline"
              : "text-black hover:underline"
          }`}
        >
          Contact Us
        </a>
        
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button onClick={toggleMobileMenu} className="text-black focus:outline-none">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-teal-800 bg-opacity-90 z-50 transition-opacity duration-300 ease-in-out md:hidden
        ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
      >
        <div className="flex justify-end p-6">
          <button onClick={toggleMobileMenu} className="text-black focus:outline-none">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <nav className="flex flex-col items-center space-y-8 mt-16">
          <a
            href="#about-us"
            onClick={toggleMobileMenu}
            className={`text-xl font-semibold leading-6 ${
              activeSection === "about-us"
                ? "text-yellow-400 underline"
                : "text-white hover:underline"
            }`}
          >
            About Us
          </a>
           <a
            href="#Servvices"
            onClick={toggleMobileMenu}
            className={`text-xl font-semibold leading-6 ${
              activeSection === "about-us"
                ? "text-yellow-400 underline"
                : "text-white hover:underline"
            }`}
          >
            Our Services
          </a>
           <a
            href="#Faq"
            onClick={toggleMobileMenu}
            className={`text-xl font-semibold leading-6 ${
              activeSection === "about-us"
                ? "text-yellow-400 underline"
                : "text-white hover:underline"
            }`}
          >
            FAQ's
          </a>
          
          <a
            href="#contact"
            onClick={toggleMobileMenu}
            className={`text-xl font-semibold leading-6 ${
              activeSection === "contact"
                ? "text-yellow-400 underline"
                : "text-white hover:underline"
            }`}
          >
            Contact Us
          </a>
           
        </nav>
      </div>
    </header>
  );
};

export default Header;
