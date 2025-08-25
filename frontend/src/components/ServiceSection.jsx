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


// Reusable ServiceCard Component
const ServiceCard = ({ title, description, isFeatured = false, onMouseEnter, onMouseLeave, isHovered }) => {
  const isActive = isFeatured || isHovered; // Card is active if featured by default OR currently hovered

  const cardBgClass = isActive ? 'bg-brandGreen' : 'bg-white';
  const titleColorClass = isActive ? 'text-white' : 'text-gray-900';
  const descriptionColorClass = isActive ? 'text-white' : 'text-gray-600';
  const iconBgClass = isActive ? 'bg-white' : 'bg-brandGreen'; // Background of the icon circle
  const iconColorClass = isActive ? 'text-brandGreen' : 'text-white'; // Color of the text icon itself

  // Extract the emoji/icon from the title
  const emojiIcon = title.split(' ')[0]; // Assumes the first word is the emoji/icon
  const cleanTitle = title.substring(title.indexOf(' ') + 1); // Get the rest of the title

  return (
    <div
    
      className={`p-6 sm:p-8 shadow-xl rounded-xl flex flex-col justify-center items-start gap-4 sm:gap-6
        transition-all duration-300 ease-in-out cursor-pointer
        ${cardBgClass}
        ${isFeatured ? '' : 'hover:bg-brandGreen hover:text-white'}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`w-12 h-12 sm:w-16 sm:h-16 ${iconBgClass} rounded-lg flex items-center justify-center`}>
        {/* Render the emoji/text icon from the title here */}
        <span className={`text-2xl sm:text-3xl font-bold ${iconColorClass}`}>
          {emojiIcon}
        </span>
      </div>
      <div className="flex flex-col justify-center items-start gap-3 sm:gap-4">
        <h3 className={`text-2xl sm:text-3xl font-semibold leading-8 ${titleColorClass}`}>
          {cleanTitle} {/* Display the title without the emoji */}
        </h3>
        <p className={`text-sm sm:text-base font-medium leading-6 ${descriptionColorClass}`}>
          {description}
        </p>
      </div>
    </div>
  );
};

const ServicesSection = () => {
  const [sectionRef, sectionIsVisible] = useSectionVisibility(0.2); // Overall section visibility
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null); // State to track which card is hovered

  useEffect(() => {
    if (sectionIsVisible) {
      // Stagger animations when the section becomes visible
      const timers = [];
      timers.push(setTimeout(() => setHeadlineVisible(true), 100));
      timers.push(setTimeout(() => setCardsVisible(true), 300)); // Cards appear after headline

      return () => timers.forEach(timer => clearTimeout(timer));
    } else {
      // Hide all elements when the section scrolls out of view
      setHeadlineVisible(false);
      setCardsVisible(false);
    }
  }, [sectionIsVisible]);

  const services = [
    {
      id: 1,
      title: "📋 Labour Booking",
      description: "RReliable, skilled labour for pruning, harvesting, and spraying — whenever you need them.",
      isFeatured: true, // This card will be featured by default
    },
    {
      id: 2,
      title: "👨‍🏫 Training & Upskilling",
      description: "Crop-specific programs that turn labourers into craftsmen.",
    },
    {
      id: 3,
      title: "📍 On-Ground Support",
      description: "Local mukadams and field teams keep tasks on track, quality high, and issues solved fast.",
    },
    {
      id: 4,
      title: "🚚 Transport & Logistics",
      description: "Door-to-farm transport arranged end-to-end, so crews arrive fresh and on schedule.",
    },
    {
      id: 5,
      title: "📲 Digital Records",
      description: "Bookings, wages, and worker history — securely stored and searchable in one dashboard.",
    },
    {
      id: 6,
      title: "📞 Indic Support",
      description: "Book, reschedule, or get real-time updates in your local dialect.",
    },
  ];

  // Common animation classes for staggered elements
  const staggeredAnimationClasses = 'transition-all duration-700 ease-out';
  const hiddenStateClassesY = 'opacity-0 translate-y-10'; // For headline (slide up/down)
  const visibleStateClassesY = 'opacity-100 translate-y-0';

  const hiddenStateClassesX = 'opacity-0 -translate-x-10'; // For cards (slide from left)
  const visibleStateClassesX = 'opacity-100 translate-x-0';


  return (
    <section
    id = 'Services'
      ref={sectionRef} // Attach ref for overall section visibility
      className={`bg-white py-16 px-4 sm:px-6 lg:px-24`}
    >
      {/* Headline and Subheading */}
      <div className={`max-w-7xl mx-auto flex flex-col justify-center items-center gap-4 sm:gap-6 mb-12 sm:mb-16 text-center
        ${staggeredAnimationClasses}
        ${headlineVisible ? visibleStateClassesY : hiddenStateClassesY}
      `}>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-gray-900">
          Our labour solutions and <span className="text-brandGreen">services</span>
        </h2>
        <p className="text-base font-medium leading-6 text-gray-600 max-w-full lg:max-w-none">
          From finding skilled hands to managing smooth operations — we take care of it all.
        </p>
      </div>

      {/* Services Grid */}
      <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch
        ${staggeredAnimationClasses}
        ${cardsVisible ? visibleStateClassesX : hiddenStateClassesX}
      `}>
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title} // Pass the full title
            description={service.description}
            isFeatured={hoveredCard === null && service.id === 1} // First card is featured by default
            isHovered={hoveredCard === service.id}
            onMouseEnter={() => setHoveredCard(service.id)}
            onMouseLeave={() => setHoveredCard(null)}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;