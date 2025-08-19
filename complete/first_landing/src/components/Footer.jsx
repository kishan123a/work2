import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-brandGreen py-16 px-4 sm:px-6 lg:px-24 flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8 text-white">
      {/* Brand Info */}
      <div className="flex flex-col justify-start items-start gap-6 sm:gap-10 max-w-full lg:max-w-xs text-center lg:text-left">
        <div className="text-3xl sm:text-4xl font-semibold leading-tight">AgroIntel</div>
        <p className="text-sm sm:text-base font-medium leading-6">
          Building Bharat's Workforce.
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex flex-col justify-start items-start gap-6 sm:gap-10 text-center sm:text-left">
        <h3 className="text-xl sm:text-2xl font-semibold leading-6">Quick Links</h3>
        <nav className="flex flex-col justify-start items-start gap-3 sm:gap-4">
          <a href="#about-us" className="text-sm sm:text-base font-medium leading-6 hover:underline">About Us</a>
          <a href="#services" className="text-sm sm:text-base font-medium leading-6 hover:underline">Service</a>
          {/* <a href="#pricing" className="text-sm sm:text-base font-medium leading-6 hover:underline">Pricing</a> */}
          <a href="#faq" className="text-sm sm:text-base font-medium leading-6 hover:underline">FAQ</a>
          <a href="#blog" className="text-sm sm:text-base font-medium leading-6 hover:underline">Blog</a>
        </nav>
      </div>

      {/* Contact Info */}
     <div className="flex flex-col justify-start items-start gap-6 sm:gap-10 max-w-full sm:max-w-sm text-center sm:text-left">
    <h3 className="text-xl sm:text-2xl font-semibold leading-6">Contact Us</h3>
    <div className="flex flex-col justify-start items-start gap-4 sm:gap-6">
      
      {/* Clickable Email */}
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
        <a href="mailto:info@kisanmitra.ai" className="text-sm sm:text-base font-medium leading-6 hover:underline transition-colors">
          info@kisanmitra.ai
        </a>
      </div>

      {/* Clickable Address (links to Google Maps) */}
      <div className="flex items-start gap-2">
        <svg className="w-4 h-4 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
        <a 
          href="https://www.google.com/maps/search/?api=1&query=107+Jehangir+Villa%2C+Wodehouse+Road+Colaba%2C+Mumbai%2C+MH%2C+400005" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm sm:text-base font-medium leading-6 hover:underline transition-colors"
        >
          107 Jehangir Villa, Wodehouse Road Colaba, Mumbai, MH, 400005
        </a>
      </div>

      {/* Clickable Phone Number */}
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM8 3a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V3zM14 3a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V3zM2 9a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V9zM8 9a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V9zM14 9a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V9zM2 15a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2zM8 15a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1v-2zM14 15a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z"></path></svg>
        <a href="tel:+919892626745" className="text-sm sm:text-base font-medium leading-6 hover:underline transition-colors">
          +91 9892626745
        </a>
      </div>

    </div>
</div>

      {/* Social Media Links */}
      <div className="flex flex-col justify-start items-start gap-6 sm:gap-10 text-center sm:text-left">
        <h3 className="text-xl sm:text-2xl font-semibold leading-6">Follow Us</h3>
        <div className="flex justify-start items-center gap-4 sm:gap-8">
          <a href="#" className="p-2 bg-white rounded-lg hover:opacity-80 transition-opacity transform hover:scale-110">
            {/* Facebook Icon */}
            <svg className="w-6 h-6 text-brandGreen" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.746-1.344L3 17l1.378-3.238A8.999 8.999 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM12 9H8V7h4v2zm0 3H8v-2h4v2z" clipRule="evenodd"></path></svg>
          </a>
          <a href="#" className="p-2 bg-white rounded-lg hover:opacity-80 transition-opacity transform hover:scale-110">
            {/* Instagram Icon */}
            <svg className="w-6 h-6 text-brandGreen" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-3.5 6.5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
          </a>
          <a href="#" className="p-2 bg-white rounded-lg hover:opacity-80 transition-opacity transform hover:scale-110">
            {/* LinkedIn Icon */}
            <svg className="w-6 h-6 text-brandGreen" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.3 5.6a1 1 0 00-1.4 0L10 9.2l-4.9-3.6a1 1 0 00-1.4 1.4L8.6 10l-4.9 3.6a1 1 0 001.4 1.4L10 10.8l4.9 3.6a1 1 0 001.4-1.4L11.4 10l4.9-3.6z" clipRule="evenodd"></path></svg>
          </a>
          <a href="#" className="p-2 bg-white rounded-lg hover:opacity-80 transition-opacity transform hover:scale-110">
            {/* Twitter Icon */}
            <svg className="w-6 h-6 text-brandGreen" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6.29 18.27l-2.61-2.61a1 1 0 011.42-1.42l2.61 2.61a1 1 0 01-1.42 1.42zM10 14.58l-5-5a1 1 0 011.42-1.42l5 5a1 1 0 01-1.42 1.42zM15 10.58l-5-5a1 1 0 011.42-1.42l5 5a1 1 0 01-1.42 1.42z"></path></svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;