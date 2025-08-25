import React, { useState, useEffect, useRef } from 'react';
import Headers from './Headers'; // Corrected import path and component name
import { Link } from 'react-router-dom';

// AnimatedCounter component for number animation
const AnimatedCounter = ({ endValue, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null); // Ref to observe element visibility

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start animation when element is in view
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * endValue));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          // Do NOT disconnect here if you want it to re-animate on re-entry
          // observer.disconnect();
        } else {
            // Reset count if it goes out of view, so it re-animates on re-entry
            setCount(0);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [endValue, duration]); // Depend on endValue and duration to re-run if they change

  return <span ref={ref}>{count}</span>;
};


const HeroSection = () => {
  const sectionRef = useRef(null);
  // Initial state is false, so it starts hidden.
  // We'll rely on the IntersectionObserver to set it to true.
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update isVisible based on intersection.
        // This makes it hide when scrolled out of view.
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 } // Adjust threshold as needed (e.g., 0.2 means 20% visible)
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        // Corrected: Changed 'ref.current' to 'sectionRef.current'
        observer.unobserve(sectionRef.current);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <section
      id='hero'
      ref={sectionRef}
      className={`relative w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white p-4 sm:p-6 lg:p-0
        transition-all duration-1000 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
      style={{
        backgroundImage: 'linear-gradient(0deg, rgba(58, 58, 58, 0.42) 0%, rgba(58, 58, 58, 0.42) 100%), url(IMG-20250730-WA0010.jpg)',
        // This is the new part
        backgroundPosition: 'top center' // Keep the top of the image visible
      }}
    >
       {/* Render the Header component */}

      <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 mt-32 text-center px-4 sm:px-0">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold leading-tight max-w-full lg:max-w-5xl">
          Building Bharat’s Workforce
        </h1>
        <p className="text-sm sm:text-base font-medium leading-6 max-w-full lg:max-w-2xl">
          Connecting horticulture farmers with skilled labour.
        </p>
      </div>

      {/* Buttons: Now always in one row with reduced spacing on small screens */}
      <div className="flex flex-row justify-center items-center gap-2 sm:gap-4 lg:gap-10 mt-12 sm:mt-16 px-2 sm:px-0 xl:mt-12"> {/* Changed flex-col sm:flex-row to flex-row and reduced gap/padding */}
        <button className="px-4 py-3 sm:px-6 sm:py-4 lg:px-10 lg:py-8 bg-brandGreen rounded-full text-white text-xs sm:text-base lg:text-xl font-semibold leading-6 text-center shadow-md hover:bg-teal-700 transition-colors duration-300 flex-shrink-0"> {/* Reduced padding and font size, added flex-shrink-0 */}
          <a href = "#contact">Get Labour Now</a>
        </button>
         <Link to="/partner-us">
        <button className="px-4 py-3 sm:px-6 sm:py-4 lg:px-10 lg:py-8 bg-white rounded-full text-brandGreen text-xs sm:text-base lg:text-xl font-semibold leading-6 text-center shadow-md hover:bg-gray-100 transition-colors duration-300 flex-shrink-0"> {/* Reduced padding and font size, added flex-shrink-0 */}
        Partner With Us{/* <a href = "https://remarkable-faloodeh-001911.netlify.app/" >Partner With Us</a>  */}
        </button>
        </Link>
      </div>

      {/* Stats Section: Adjusted positioning to avoid overlap */}
      <div className="relative w-full px-2 py-4 bg-white rounded-t-xl sm:rounded-xl shadow-lg flex flex-row justify-around items-center gap-1 mb-0 sm:mb-16 max-w-full lg:max-w-4xl mt-12 sm:mt-24 lg:mt-16">
        <div className="flex flex-col items-center justify-center gap-0.5 flex-1 p-1">
          <div className="text-xl sm:text-3xl lg:text-5xl font-semibold leading-tight text-gray-900 text-center">
            <AnimatedCounter endValue={5} />
            <span className="text-brandGreen">+</span>
          </div>
          <div className="text-[0.6rem] sm:text-xs lg:text-base font-medium leading-3 sm:leading-4 lg:leading-6 text-gray-600 text-center">
            Tehsils Covered
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-0.5 flex-1 p-1">
          <div className="text-xl sm:text-3xl lg:text-5xl font-semibold leading-tight text-gray-900 text-center">
            <AnimatedCounter endValue={2} />K<span className="text-brandGreen">+</span>
          </div>
          <div className="text-[0.6rem] sm:text-xs lg:text-base font-medium leading-3 sm:leading-4 lg:leading-6 text-gray-600 text-center">
            Labourers Onboarded
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-0.5 flex-1 p-1">
          <div className="text-xl sm:text-3xl lg:text-5xl font-semibold leading-tight text-gray-900 text-center">
            <AnimatedCounter endValue={5} />K<span className="text-brandGreen">+</span>
          </div>
          <div className="text-[0.6rem] sm:text-xs lg:text-base font-medium leading-3 sm:leading-4 lg:leading-6 text-gray-600 text-center">
            Farmers Served
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-0.5 flex-1 p-1">
          <div className="text-xl sm:text-3xl lg:text-5xl font-semibold leading-tight text-gray-900 text-center">
            <AnimatedCounter endValue={14} />
            <span className="text-brandGreen">K</span>
          </div>
          <div className="text-[0.6rem] sm:text-xs lg:text-base font-medium leading-3 sm:leading-4 lg:leading-6 text-gray-600 text-center">
            Acres
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;