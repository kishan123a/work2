import React, { useState, useEffect, useRef } from 'react';

// Reusable custom hook for scroll-triggered visibility (copied from previous components)
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

const GallerySection = () => {
  const [sectionRef, sectionIsVisible] = useSectionVisibility(0.2); // Overall section visibility
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [imageVisibleStates, setImageVisibleStates] = useState(Array(5).fill(false)); // State for the 5 images

  useEffect(() => {
    if (sectionIsVisible) {
      const timers = [];
      timers.push(setTimeout(() => setHeadlineVisible(true), 100));

      // Stagger individual images
      // Assuming 5 images in the layout: big left, top-middle, top-right, bottom-middle, rightmost big
      [0, 1, 2, 3, 4].forEach((index) => {
        timers.push(setTimeout(() => {
          setImageVisibleStates(prev => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
          });
        }, 300 + index * 150)); // Stagger each image by 150ms
      });

      return () => timers.forEach(timer => clearTimeout(timer));
    } else {
      // Hide all elements when the section scrolls out of view
      setHeadlineVisible(false);
      setImageVisibleStates(Array(5).fill(false)); // Reset all images to hidden
    }
  }, [sectionIsVisible]);

  // Common animation classes for headline (slide up/down)
  const staggeredAnimationClasses = 'transition-all duration-700 ease-out';
  const hiddenStateClassesY = 'opacity-0 translate-y-10';
  const visibleStateClassesY = 'opacity-100 translate-y-0';

  // Animation classes for images (slide from various directions)
  const hiddenStateClassesXLeft = 'opacity-0 -translate-x-10';
  const hiddenStateClassesXRight = 'opacity-0 translate-x-10';
  const hiddenStateClassesYBottom = 'opacity-0 translate-y-10';
  const visibleStateClasses = 'opacity-100 translate-x-0 translate-y-0'; // Combined visible state


  return (
    <section
      ref={sectionRef} // Attach ref for overall section visibility
      className={`bg-white py-16 px-4 sm:px-6 lg:px-24`}
    >
      {/* Headline and Subheading */}
      <div className={`max-w-7xl mx-auto flex flex-col justify-center items-center gap-4 sm:gap-6 mb-12 sm:mb-16 text-center
        ${staggeredAnimationClasses}
        ${headlineVisible ? visibleStateClassesY : hiddenStateClassesY}
      `}>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-gray-900">
          Our <span className="text-brandGreen">Gallery</span>
        </h2>
        <p className="text-base font-medium leading-6 text-gray-600 max-w-full lg:max-w-none">
          See our work in action on farms across Bharat, showcasing our dedication to excellence.
        </p>
      </div>

      {/* Gallery Grid Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 auto-rows-[1fr] lg:auto-rows-[minmax(200px, auto)]">
        {/* Left Big Image (Father and Son planting) - Index 0 */}
        <div className={`col-span-2 md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-xl overflow-hidden shadow-md
          ${staggeredAnimationClasses}
          ${imageVisibleStates[0] ? visibleStateClasses : hiddenStateClassesXLeft}
        `}>
          <img
            src="http://googleusercontent.com/file_content/0"
            alt="Father and son planting in a garden"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top-Middle Image (Person watering plants) - Index 1 */}
        <div className={`col-span-1 md:col-span-1 rounded-xl overflow-hidden shadow-md aspect-w-16 aspect-h-9 sm:aspect-auto
          ${staggeredAnimationClasses}
          ${imageVisibleStates[1] ? visibleStateClasses : hiddenStateClassesYBottom}
        `}>
          <img
            src="https://placehold.co/300x200/ADD8E6/000000?text=Watering+Plants"
            alt="Person watering potted plants"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top-Right Image (Person trimming bushes) - Index 2 */}
        <div className={`col-span-1 md:col-span-1 rounded-xl overflow-hidden shadow-md aspect-w-16 aspect-h-9 sm:aspect-auto
          ${staggeredAnimationClasses}
          ${imageVisibleStates[2] ? visibleStateClasses : hiddenStateClassesYBottom}
        `}>
          <img
            src="https://placehold.co/300x200/90EE90/000000?text=Trimming+Bushes"
            alt="Person trimming bushes"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom-Middle Horizontal Image (Red flower) - Index 3 */}
        <div className={`col-span-2 md:col-span-2 rounded-xl overflow-hidden shadow-md aspect-w-16 aspect-h-9 sm:aspect-auto
          ${staggeredAnimationClasses}
          ${imageVisibleStates[3] ? visibleStateClasses : hiddenStateClassesYBottom}
        `}>
          <img
            src="https://placehold.co/600x200/FF6347/FFFFFF?text=Red+Flower"
            alt="Close-up of a red flower"
            className="w-full h-full object-cover"
          />
        </div>
        
        
      </div>
    </section>
  );
};

export default GallerySection;