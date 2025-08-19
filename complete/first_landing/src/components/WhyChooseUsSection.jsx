import React, { useState, useEffect, useRef } from 'react';

// Reusable custom hook for scroll-triggered visibility (copied from AboutSection)
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

// Reusable FeatureItem component to handle icon and text
const FeatureItem = ({ icon, text, isVisible, animationDirection }) => {
  const staggeredAnimationClasses = 'transition-all duration-700 ease-out';
  const hiddenStateClassesXLeft = 'opacity-0 -translate-x-10';
  const hiddenStateClassesXRight = 'opacity-0 translate-x-10';
  const visibleStateClassesX = 'opacity-100 translate-x-0';

  return (
    <div className={`flex items-start sm:items-center gap-4 sm:gap-6 w-full
      ${staggeredAnimationClasses}
      ${isVisible ? visibleStateClassesX : (animationDirection === 'left' ? hiddenStateClassesXLeft : hiddenStateClassesXRight)}
    `}>
      {/* Icon */}
      <span className="w-8 h-8 flex-shrink-0 text-teal-600 text-3xl flex items-center justify-center"> {/* Adjusted size and color for emoji */}
        {icon}
      </span>
      {/* Text */}
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight sm:leading-8 text-gray-900 text-left">
        {text}
      </h3>
    </div>
  );
};


const WhyChooseUsSection = () => {
  const [sectionRef, sectionIsVisible] = useSectionVisibility(0.2); // Overall section visibility
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [featureItemVisibleStates, setFeatureItemVisibleStates] = useState(Array(4).fill(false)); // State for each of the 4 feature items


  useEffect(() => {
    if (sectionIsVisible) {
      // Stagger animations when the section becomes visible
      const timers = [];
      timers.push(setTimeout(() => setHeadlineVisible(true), 100));
      timers.push(setTimeout(() => setImageVisible(true), 300)); // Image slides in from left

      // Stagger individual feature items
      [0, 1, 2, 3].forEach((index) => {
        timers.push(setTimeout(() => {
          setFeatureItemVisibleStates(prev => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
          });
        }, 500 + index * 150)); // Feature items start animating after 500ms, staggered by 150ms
      });


      return () => timers.forEach(timer => clearTimeout(timer));
    } else {
      // Hide all elements when the section scrolls out of view
      setHeadlineVisible(false);
      setImageVisible(false);
      setFeatureItemVisibleStates(Array(4).fill(false)); // Reset all feature items to hidden
    }
  }, [sectionIsVisible]);

  // Common animation classes for staggered elements
  const staggeredAnimationClasses = 'transition-all duration-700 ease-out';
  const hiddenStateClassesY = 'opacity-0 translate-y-10'; // For headline (slide up/down)
  const visibleStateClassesY = 'opacity-100 translate-y-0';

  const hiddenStateClassesXLeft = 'opacity-0 -translate-x-10'; // For image (slide from left)
  const hiddenStateClassesXRight = 'opacity-0 translate-x-10'; // For feature list (slide from right)
  const visibleStateClassesX = 'opacity-100 translate-x-0';

  const features = [
    { id: 1, icon: '✅', text: 'Expertise – Trained labour for every agri task.' },
    { id: 2, icon: '⏳', text: 'Timeliness – Book labour exactly when you need them.' },
    { id: 3, icon: '�', text: 'Customization – Pruning, harvesting, packhouse – we cover it all.' },
    { id: 4, icon: '🌾', text: 'Trust & Transparency – Payments handled securely & fairly.' },
  ];


  return (
    <section
      ref={sectionRef} // Attach ref for overall section visibility
      className={`bg-white py-16 px-4 sm:px-6 lg:px-24`}
    >
      {/* Headline and Subheading - Always full width at the top */}
      <div className={`max-w-7xl mx-auto flex flex-col justify-center items-center gap-4 sm:gap-6 text-center mb-12 sm:mb-16
        ${staggeredAnimationClasses}
        ${headlineVisible ? visibleStateClassesY : hiddenStateClassesY}
      `}>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-gray-900">
          They <span className="text-brandGreen">Choose Us</span>
        </h2>
        <p className="text-base font-medium leading-6 text-gray-600 max-w-full lg:max-w-none">
          Discover why farmers across Bharat trust us for their agri workforce needs.
        </p>
      </div>

      {/* Main Content Area: Image and Feature List */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
        {/* Left Side - Image Placeholder (on desktop) / Top (on mobile) */}
        <div className={`w-full lg:w-1/2 rounded-xl overflow-hidden shadow-lg h-64 sm:h-96 max-h-[400px] lg:h-[560px] lg:max-h-none bg-gray-600 order-first lg:order-none
          ${staggeredAnimationClasses}
          ${imageVisible ? visibleStateClassesX : hiddenStateClassesXLeft}
        `}>
          <img
            src="https://placehold.co/853x560"
            alt="Why Choose Us"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Feature List (on desktop) / Bottom (on mobile) */}
        <div className={`w-full lg:w-1/2 flex flex-col justify-start items-start gap-6 sm:gap-10 text-center lg:text-left order-last lg:order-none`}>
          {features.map((feature, index) => (
            <FeatureItem
              key={feature.id}
              icon={feature.icon}
              text={feature.text}
              isVisible={featureItemVisibleStates[index]}
              animationDirection={index % 2 === 0 ? 'left' : 'right'} // Alternate direction for items
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;