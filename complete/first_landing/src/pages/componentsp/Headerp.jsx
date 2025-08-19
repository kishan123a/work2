"use client"; // This directive is necessary for client-side components in Next.js

import React, { useState } from 'react';
import {Button} from "../ui/button"; // Correct import for shadcn/ui Button component
import { Menu, X } from 'lucide-react'; // Icons for the hamburger and close buttons

const Header = () => {
  // State to manage the visibility of the mobile menu
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to toggle the menu state

   const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
     <header className="fixed top-0 left-0 w-full px-4 sm:px-6 lg:px-24 py-6 border-b border-white flex justify-between items-center z-50">
      {/* Logo */}
      <div className="text-black text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight">AgroIntel</div> {/* Adjusted font size for responsiveness */}

      {/* Desktop Navigation (hidden on small screens) */}
      <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
         <a href="#how-it-works" onClick={toggleMobileMenu} className="text-black-500 text-xl font-semibold leading-6 hover:underline">How it works</a>
          <a href="#join-steps" onClick={toggleMobileMenu} className="text-black-500 text-xl font-semibold leading-6 hover:underline">How to Join</a>
          <a href="#faq" onClick={toggleMobileMenu} className="text-black-500 text-xl font-semibold leading-6 hover:underline">FAQ</a>
         
      </nav>

      {/* Desktop Auth Buttons (hidden on small screens) */}
      <div className="hidden md:flex items-center space-x-8">
       <Button variant="hero" size="sm">
              <a href="/register/">
                 Register as a Worker
               </a>
       </Button>
             </div>

      {/* Mobile Menu Button (Hamburger Icon) */}
      <div className="md:hidden">
        <Button onClick={toggleMobileMenu} className="text-black focus:outline-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </Button>
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
          <a href="#how-it-works" onClick={toggleMobileMenu} className="text-white text-xl font-semibold leading-6 hover:underline">How it works</a>
          <a href="#join-steps" onClick={toggleMobileMenu} className="text-white text-xl font-semibold leading-6 hover:underline">How to Join</a>
          <a href="#FAQ" onClick={toggleMobileMenu} className="text-white text-xl font-semibold leading-6 hover:underline">FAQ</a>
              <button
              
              variant="hero" >
              <a href="/register/">
                 Register as a Worker
               </a>
             </button>
          
        </nav>

      
      </div>
    </header>
  );
};

export default Header;
