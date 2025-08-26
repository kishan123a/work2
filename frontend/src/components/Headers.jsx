import React, { useState, useEffect } from 'react';
import { Button } from '../pages/ui/button'; // Adjust path if needed

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const handleScroll = () => {
      let currentSectionId = 'hero';
      const scrollPosition = window.scrollY + 150;

      sections.forEach((section) => {
        if (
          scrollPosition >= section.offsetTop &&
          scrollPosition < section.offsetTop + section.offsetHeight
        ) {
          currentSectionId = section.getAttribute("id");
        }
      });
      setActiveSection(currentSectionId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="fixed top-0 left-0 w-full px-4 sm:px-6 lg:px-24 py-4 flex justify-between items-center z-50 
                     bg-gradient-to-t from-black/50 to-transparent backdrop-blur-sm">
      {/* Logo */}
      <a href="#hero">
        <img src="l.png" alt="Company Logo" className="max-w-[135px]" />
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
        <a
          href="#about-us"
          className={`text-base font-semibold leading-6 ${
            activeSection === "about-us" ? "text-brandGreen" : "text-white"
          } hover:text-brandGreen transition-colors`}
        >
          About Us
        </a>
        <a
          href="#services"
          className={`text-base font-semibold leading-6 ${
            activeSection === "services" ? "text-brandGreen" : "text-white"
          } hover:text-brandGreen transition-colors`}
        >
          Our Services
        </a>
        <a
          href="#faq"
          className={`text-base font-semibold leading-6 ${
            activeSection === "faq" ? "text-brandGreen" : "text-white"
          } hover:text-brandGreen transition-colors`}
        >
          FAQ's
        </a>
        <a
          href="#contact"
          className={`text-base font-semibold leading-6 ${
            activeSection === "contact" ? "text-brandGreen" : "text-white"
          } hover:text-brandGreen transition-colors`}
        >
          Contact Us
        </a>
      </nav>

      {/* Mobile Menu Button */}
      {/* <div className="md:hidden">
        <Button
          onClick={toggleMobileMenu}
          className="text-white focus:outline-none bg-transparent hover:bg-white/10 p-2 rounded-md"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </Button>
      </div> */}

      {/* Mobile Menu */}
       <div className="md:hidden">
              <Button onClick={toggleMobileMenu} className="text-black focus:outline-none">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </Button>
            </div>
      
            {/* Mobile Menu Overlay */}
            {/* Changed transform translate-x to opacity for fade-in/out effect */}
            <div className={`fixed inset-0 bg-teal-800 bg-opacity-90 z-50 transition-opacity duration-300 ease-in-out md:hidden h-screen
              ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
            `}>
              <div className="flex justify-end p-6">
                <Button onClick={toggleMobileMenu} className="text-white focus:outline-none">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </Button>
              </div>
        <nav className="flex flex-col items-center space-y-8 mt-16">
          <a
            href="#about-us"
            onClick={toggleMobileMenu}
            className={`text-xl font-semibold leading-6 ${
              activeSection === "about-us" ? "text-yellow-400" : "text-white"
            } hover:text-yellow-400`}
          >
            About Us
          </a>
          <a
            href="#Services"
            onClick={toggleMobileMenu}
            className={`text-xl font-semibold leading-6 ${
              activeSection === "services" ? "text-yellow-400" : "text-white"
            } hover:text-yellow-400`}
          >
            Our Services
          </a>
          <a
            href="#Faq"
            onClick={toggleMobileMenu}
            className={`text-xl font-semibold leading-6 ${
              activeSection === "faq" ? "text-yellow-400" : "text-white"
            } hover:text-yellow-400`}
          >
            FAQ's
          </a>
          <a
            href="#contact"
            onClick={toggleMobileMenu}
            className={`text-xl font-semibold leading-6 ${
              activeSection === "contact" ? "text-yellow-400" : "text-white"
            } hover:text-yellow-400`}
          >
            Contact Us
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
