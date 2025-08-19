import React, { useState, useEffect, useRef } from 'react';

// Reusable custom hook for scroll-triggered visibility
function useSectionVisibility(threshold = 0.2) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
}


// Icon for Our Mission (e.g., Target/Goal - more distinct)
const MissionIcon = ({ colorClass }) => (
  <svg className={`w-10 h-10 sm:w-14 sm:h-14 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 12v10a1 1 0 001 1h3m10-11l2 2m-2 2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
  </svg>
);

// Icon for Our Vision (e.g., Eye/Future - more distinct)
const VisionIcon = ({ colorClass }) => (
  <svg className={`w-10 h-10 sm:w-14 sm:h-14 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
  </svg>
);


const AboutSection = () => {
  const [sectionRef, sectionIsVisible] = useSectionVisibility(0.2); // Overall section visibility
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [missionCardVisible, setMissionCardVisible] = useState(false);
  const [visionCardVisible, setVisionCardVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    if (sectionIsVisible) {
      // Stagger animations when the section becomes visible
      const timers = [];
      timers.push(setTimeout(() => setHeadlineVisible(true), 100));
      timers.push(setTimeout(() => setMissionCardVisible(true), 300));
      timers.push(setTimeout(() => setVisionCardVisible(true), 500));
      timers.push(setTimeout(() => setImageVisible(true), 700));

      return () => timers.forEach(timer => clearTimeout(timer));
    } else {
      // Hide all elements when the section scrolls out of view
      setHeadlineVisible(false);
      setMissionCardVisible(false);
      setVisionCardVisible(false);
      setImageVisible(false);
    }
  }, [sectionIsVisible]); // Trigger this effect when sectionIsVisible changes

  const iconColorClass = 'text-white'; // Icons will be white inside the green circles

  // Common animation classes for staggered elements
  const staggeredAnimationClasses = 'transition-all duration-700 ease-out';
  const hiddenStateClasses = 'opacity-0 translate-x-10';
  const visibleStateClasses = 'opacity-100 translate-x-0';


  return (
    <section
      ref={sectionRef} // Attach ref for overall section visibility
      className={`bg-white py-16 px-4 sm:px-6 lg:px-24`}
      id = 'about-us'
    >
      {/* Headline and Subheading */}
      <div className={`max-w-7xl mx-auto flex flex-col justify-center items-start gap-4 sm:gap-6 text-center lg:text-left mb-12 sm:mb-16
        ${staggeredAnimationClasses}
        ${headlineVisible ? visibleStateClasses : hiddenStateClasses}
      `}>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-gray-900">
          Caring For Your <span className="text-brandGreen">Fields</span>
        </h2>
        <p className="text-base font-medium leading-6 text-gray-600 max-w-full lg:max-w-none">
          We’re building the future of rural labour — ensuring every farm has the hands it needs, and every worker has the dignity they deserve.
        </p>
      </div>

      {/* Main Content Area: Cards on left, Image on right */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        {/* Left Column: Mission and Vision Cards stacked */}
        <div className="flex-1 flex flex-col gap-8 w-full lg:w-1/2">
          {/* Our Mission Card */}
          <div className={`p-6 sm:p-8 bg-white shadow-xl rounded-xl flex flex-col justify-center items-start gap-4 sm:gap-6 text-center md:text-left
            ${staggeredAnimationClasses}
            ${missionCardVisible ? visibleStateClasses : hiddenStateClasses}
          `}>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brandGreen rounded-lg flex items-center justify-center mx-auto md:mx-0">
              <MissionIcon colorClass={iconColorClass} /> {/* Render Mission Icon */}
            </div>
            <div className="flex flex-col justify-center items-center md:items-start gap-3 sm:gap-4">
              <h3 className="text-2xl sm:text-3xl font-semibold leading-8 text-gray-900">
                Our <span className="text-brandGreen">Mission</span>
              </h3>
              <p className="text-sm sm:text-base font-medium leading-6 text-gray-600">
                We’re here to end India’s farm labour crisis — bringing dignity, structure, and reliability to agricultural work, so farmers never have to scramble for help again.
              </p>
            </div>
          </div>

          {/* Our Vision Card */}
          <div className={`p-6 sm:p-8 bg-white shadow-xl rounded-xl flex flex-col justify-center items-start gap-4 sm:gap-6 text-center md:text-left
            ${staggeredAnimationClasses}
            ${visionCardVisible ? visibleStateClasses : hiddenStateClasses}
          `}>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brandGreen rounded-lg flex items-center justify-center mx-auto md:mx-0">
              <VisionIcon colorClass={iconColorClass} /> {/* Render Vision Icon */}
            </div>
            <div className="flex flex-col justify-center items-center md:items-start gap-3 sm:gap-4">
              <h3 className="text-2xl sm:text-3xl font-semibold leading-8 text-gray-900">
                Our <span className="text-brandGreen">Vision</span>
              </h3>
              <p className="text-sm sm:text-base font-medium leading-6 text-gray-600">
                We see a future where every farmer in Bharat can find skilled workers with a single WhatsApp message — and where every labourer is paid fairly and on time.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className={`flex-1 rounded-xl overflow-hidden shadow-lg h-96 lg:h-[616px] max-h-[400px] lg:max-h-none w-full lg:w-1/2 bg-gray-600 order-first lg:order-last
          ${staggeredAnimationClasses}
          ${imageVisible ? visibleStateClasses : hiddenStateClasses}
        `}>
          <img
            src="IMG-20250730-WA0005.jpg" // Replace with your actual image
            alt="Farm fields"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;