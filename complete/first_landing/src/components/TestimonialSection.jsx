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

// StarRating Component (reusable for displaying stars)
const StarRating = ({ rating, totalStars = 5, filledColor = 'text-yellow-400', emptyColor = 'text-gray-300' }) => {
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? filledColor : emptyColor}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
        </svg>
      ))}
    </div>
  );
};

// Reusable TestimonialCard Component
const TestimonialCard = ({ quote, name, title, avatarUrl, rating, isDefaultFeatured, onMouseEnter, onMouseLeave, isHovered, isVisible, animationDirection }) => {
  const isActive = isDefaultFeatured || isHovered;

  const cardBgClass = isActive ? 'bg-brandGreen' : 'bg-white';
  const quoteColorClass = isActive ? 'text-white' : 'text-gray-600';
  const nameColorClass = isActive ? 'text-white' : 'text-gray-900';
  const titleColorClass = isActive ? 'text-white' : 'text-gray-600';
  const starFilledColorClass = isActive ? 'text-yellow-400' : 'text-yellow-400';
  const starEmptyColorClass = isActive ? 'text-gray-300' : 'text-gray-300'; // Keep empty stars grey or adjust as needed

  // Animation classes for individual card
  const slideInClass = isVisible
    ? 'opacity-100 translate-x-0'
    : (animationDirection === 'left' ? 'opacity-0 -translate-x-10' : 'opacity-0 translate-x-10');

  return (
    <div
      className={`relative p-8 pl-16 shadow-xl rounded-xl flex flex-col justify-start items-start gap-8
        transition-all duration-700 ease-out cursor-pointer
        ${cardBgClass}
        ${isDefaultFeatured ? '' : 'hover:bg-brandGreen hover:text-white'}
        ${slideInClass}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Avatar positioned vertically centered and half to the left/forward */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-8 w-20 h-20 rounded-full overflow-hidden bg-gray-300 shadow-md border-4 border-white">
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Adjusted padding-left to account for the overlapping avatar */}
      <p className={`text-base font-medium leading-6 ${quoteColorClass} pl-0 sm:pl-4`}>
        “{quote}”
      </p>

      <div className="flex flex-col justify-center items-start w-full">
        <h3 className={`text-3xl font-semibold leading-8 ${nameColorClass}`}>
          {name}
        </h3>
        <p className={`text-sm font-normal leading-4 ${titleColorClass} mb-2`}>
          {title}
        </p>
        <StarRating
          rating={rating}
          filledColor={starFilledColorClass}
          emptyColor={starEmptyColorClass}
        />
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [sectionRef, sectionIsVisible] = useSectionVisibility(0.2); // Overall section visibility
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [cardVisibleStates, setCardVisibleStates] = useState(Array(4).fill(false)); // State for the 4 testimonial cards
  const [hoveredCard, setHoveredCard] = useState(null); // State to track which card is hovered

  const testimonials = [
    {
      id: 1,
      quote: "Earlier, we wasted weeks chasing labour for pruning. Even after paying an advance, there was no guarantee they’d show up.",
      name: "Ganesh",
      title: "Crimson, Nashik",
      avatarUrl: "https://placehold.co/80x98/FFD700/000000?text=Vilas", // Placeholder with unique color
      rating: 5,
    },
    {
      id: 2,
      quote: "Before, I had to wait at the chowk for labourers. Now, I get steady labour at the click of a button.",
      name: "Shankar",
      title: "Sharad Seedless, Ahilyanagar",
      avatarUrl: "https://placehold.co/80x98/87CEEB/000000?text=Shankar", // Placeholder with unique color
      rating: 4,
    },
    {
      id: 3,
      quote: "As a small farmer I worried about reliability. Now I get trained, supervised labour that finishes the job on time",
      name: "Arvind",
      title: "Arra 15, Nashik",
      avatarUrl: "https://placehold.co/80x98/FFB6C1/000000?text=Arvind", // Placeholder with unique color
      rating: 5,
    },
    {
      id: 4,
      quote: "This service is a game-changer for specialist tasks like pruning, dipping and thinning.",
      name: "Priya",
      title: "Thomson Seedless, Sangli",
      avatarUrl: "https://placehold.co/80x98/98FB98/000000?text=Priya", // Placeholder with unique color
      rating: 4,
    },
  ];

  useEffect(() => {
    if (sectionIsVisible) {
      const timers = [];
      timers.push(setTimeout(() => setHeadlineVisible(true), 100));

      // Stagger individual cards
      testimonials.forEach((_, index) => {
        timers.push(setTimeout(() => {
          setCardVisibleStates(prev => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
          });
        }, 300 + index * 150)); // Stagger each card by 150ms
      });

      return () => timers.forEach(timer => clearTimeout(timer));
    } else {
      // Hide all elements when the section scrolls out of view
      setHeadlineVisible(false);
      setCardVisibleStates(Array(testimonials.length).fill(false)); // Reset all cards to hidden
    }
  }, [sectionIsVisible, testimonials.length]);

  // Common animation classes for headline (slide up/down)
  const staggeredAnimationClasses = 'transition-all duration-700 ease-out';
  const hiddenStateClassesY = 'opacity-0 translate-y-10';
  const visibleStateClassesY = 'opacity-100 translate-y-0';


  return (
    <section
      ref={sectionRef} // Attach ref for overall section visibility
      className={`bg-white py-16 px-4 sm:px-6 lg:px-24`}
    >
      {/* Headline and Subheading */}
      <div className={`max-w-5xl mx-auto flex flex-col justify-center items-center gap-4 sm:gap-6 mb-12 sm:mb-16 text-center
        ${staggeredAnimationClasses}
        ${headlineVisible ? visibleStateClassesY : hiddenStateClassesY}
      `}>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-gray-900">
          Hear it Through the <span className="text-brandGreen">Grape Vine</span>
        </h2>
        <p className="text-base font-medium leading-6 text-gray-600 max-w-full lg:max-w-none">
          Real voices on how we make labour simple, reliable, and stress‑free.
        </p>
      </div>

      {/* Testimonial Cards Grid */}
      <div className="max-w-7xl mx-auto ml-4 md:ml-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-20">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            quote={testimonial.quote}
            name={testimonial.name}
            title={testimonial.title}
            avatarUrl={testimonial.avatarUrl}
            rating={testimonial.rating}
            isDefaultFeatured={hoveredCard === null && testimonial.id === 1} // First card is featured by default
            isHovered={hoveredCard === testimonial.id}
            onMouseEnter={() => setHoveredCard(testimonial.id)}
            onMouseLeave={() => setHoveredCard(null)}
            // Animation props for individual card
            isVisible={cardVisibleStates[index]}
            animationDirection={index % 2 === 0 ? 'left' : 'right'} // Alternate direction for cards
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;