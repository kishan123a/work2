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


// Reusable PricingCard Component
const PricingCard = ({ planName, price, unit, features, isHighlighted = false, onMouseEnter, onMouseLeave, isHovered, isVisible, animationDirection }) => {
  // Determine if the card is currently active (highlighted by default or hovered)
  const isActive = isHighlighted || isHovered;

  // Define base colors and then apply active/hovered state
  const baseBg = 'bg-white';
  const baseText = 'text-brandGreen';
  const baseBorder = 'border-brandGreen';

  const activeBg = 'bg-brandGreen';
  const activeText = 'text-white';
  const activeBorder = 'border-white';

  // Determine classes based on isActive
  const cardBgClass = isActive ? activeBg : baseBg;
  const headerBgClass = isActive ? activeBg : baseBg;
  const priceSectionBgClass = isActive ? activeBg : baseBg;
  const featuresSectionBgClass = isActive ? activeBg : baseBg;

  const headerTextColorClass = isActive ? activeText : baseText;
  const priceColorClass = isActive ? activeText : baseText;
  const unitColorClass = isActive ? activeText : baseText;
  const featureCheckColorClass = isActive ? activeText : baseText;
  const featureSeparatorColorClass = isActive ? activeBorder : 'bg-gray-200'; // Separator is white when active, gray when inactive

  // Button colors are inverted relative to card background
  const packageButtonBgClass = isActive ? baseBg : activeBg;
  const packageButtonTextColorClass = isActive ? baseText : activeText;
  const purchaseButtonBgClass = isActive ? baseBg : activeBg;
  const purchaseButtonTextColorClass = isActive ? baseText : activeText;

  // Border color for price section
  const borderColorClass = isActive ? `border-b-4 ${activeBorder}` : `border-b ${baseBorder}`;


  // Determine minimum height for the features container based on planName
  let featureMinHeightClass = '';
  switch (planName) {
    case 'Basic Plan':
      featureMinHeightClass = 'min-h-[120px] sm:min-h-[150px] lg:min-h-[180px]';
      break;
    case 'Standard Plan':
      featureMinHeightClass = 'min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]';
      break;
    case 'Premium Plan':
      featureMinHeightClass = 'min-h-[280px] sm:min-h-[350px] ';
      break;
    default:
      featureMinHeightClass = 'min-h-[150px]';
  }

  // Animation classes for individual card
  const slideInClass = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-10';


  return (
    <div
      className={`flex flex-col shadow-xl rounded-xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-out
        ${slideInClass}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Card Header */}
      <div className={`w-full px-6 pb-0 sm:px-8 sm:pb-0 py-6 sm:py-8 ${headerBgClass} pl-0.5 flex flex-row justify-between items-center gap-2 sm:gap-4 rounded-t-xl`}>
        {/* Plan Name */}
        <div className={`flex-1 ${headerTextColorClass} text-xl sm:text-2xl font-semibold leading-6 text-left`}>
          {planName}
        </div>
        {/* Package Button */}
        <div className={`px-4 py-2 sm:px-6 sm:py-3 ${packageButtonBgClass} rounded-full flex justify-center items-center flex-shrink-0`}>
          <div className={`text-center ${packageButtonTextColorClass} text-base sm:text-xl font-semibold leading-6`}>
            {planName === 'Premium Plan' ? 'Promo' : 'Package'}
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className={`w-full sm:p-5 ${borderColorClass} ${priceSectionBgClass} flex flex-col justify-start items-start gap-2`}>
        <div className="w-full flex flex-col justify-center items-center gap-3 sm:gap-4">
          <div className={`w-full text-center ${priceColorClass} text-5xl sm:text-7xl font-semibold leading-tight`}>
            ₹{price}
          </div>
          <div className={`w-full text-center ${unitColorClass} text-sm sm:text-base font-medium leading-6`}>
            {unit}
          </div>
        </div>
      </div>

      {/* Features and Purchase Button */}
      <div className={`w-full p-8 sm:p-5 ${featuresSectionBgClass} rounded-b-xl flex flex-col justify-between items-center flex-grow`}>
        <div className={`w-full flex flex-col justify-start items-start gap-4 mb-8 ${featureMinHeightClass}`}>
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              <div className="w-full flex justify-start items-start gap-4">
                {/* Checkmark Icon */}
                <div className={`w-6 h-6 border-2 ${isActive ? 'border-white' : 'border-brandGreen'} flex items-center justify-center rounded-full flex-shrink-0`}>
                    <svg className={`w-4 h-4 ${featureCheckColorClass}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                </div>
                <div className={`flex-1 ${featureCheckColorClass} text-sm sm:text-base font-medium leading-6`}>
                  {feature}
                </div>
              </div>
              {/* Horizontal line separator with glowing effect on hover */}
              {index < features.length - 1 && (
                <div className={`w-full h-px ${featureSeparatorColorClass} transition-all duration-300 ease-in-out ${isActive ? 'shadow-glow-white' : 'shadow-none'} my-2`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <button className={`w-full px-4 py-2 sm:px-5 sm:py-3 ${purchaseButtonBgClass} rounded-full flex justify-center items-center shadow-md hover:opacity-90 transition-opacity`}>
          <div className={`flex-1 text-center ${purchaseButtonTextColorClass} text-xl sm:text-2xl font-semibold leading-6`}>
            📥 Purchase
          </div>
        </button>
      </div>
    </div>
  );
};

const PricingSection = () => {
  const [sectionRef, sectionIsVisible] = useSectionVisibility(0.2); // Overall section visibility
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [cardVisibleStates, setCardVisibleStates] = useState(Array(3).fill(false)); // State for each of the 3 cards
  const [hoveredCard, setHoveredCard] = useState(null); // State to track which card is hovered

  useEffect(() => {
    if (sectionIsVisible) {
      const timers = [];
      timers.push(setTimeout(() => setHeadlineVisible(true), 100));

      [0, 1, 2].forEach((index) => {
        timers.push(setTimeout(() => {
          setCardVisibleStates(prev => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
          });
        }, 300 + index * 150));
      });

      return () => timers.forEach(timer => clearTimeout(timer));
    } else {
      setHeadlineVisible(false);
      setCardVisibleStates(Array(3).fill(false));
    }
  }, [sectionIsVisible]);

  const basicFeatures = [
    'For small farmers needing occasional labour.',
    'Basic digital record keeping.',
    'WhatsApp support for booking.',
  ];
  const standardFeatures = [
    'Includes skilled workers, scheduling & digital tracking.',
    'Priority booking during peak season.',
    'On-ground support from Mukadams.',
    'Arrangement for worker transport (extra cost).',
  ];
  const premiumFeatures = [
    'Full-service support: sourcing, training, logistics, & on-site supervision.',
    'Dedicated account manager.',
    'Customized training programs.',
    'All-inclusive transport & logistics.',
    'Advanced analytics & insights.',
  ];

  const staggeredAnimationClasses = 'transition-all duration-700 ease-out';
  const hiddenStateClassesY = 'opacity-0 translate-y-10';
  const visibleStateClassesY = 'opacity-100 translate-y-0';


  return (
    <section
      ref={sectionRef}
      className={`bg-white py-16 px-4 sm:px-6 lg:px-24`}
    >
      {/* Headline and Subheading */}
      <div className={`max-w-3xl mx-auto flex flex-col justify-center items-center gap-4 sm:gap-6 mb-12 sm:mb-16 text-center
        ${staggeredAnimationClasses}
        ${headlineVisible ? visibleStateClassesY : hiddenStateClassesY}
      `}>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-gray-900">
          Pricing <span className="text-brandGreen">Table</span>
        </h2>
        <p className="text-base font-medium leading-6 text-gray-600 max-w-full lg:max-w-none">
          Choose the plan that best fits your farm's needs.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {[
          { id: 1, planName: "Basic Plan", price: "40", unit: "/day/worker", features: basicFeatures },
          { id: 2, planName: "Standard Plan", price: "80", unit: "/day/worker", features: standardFeatures },
          { id: 3, planName: "Premium Plan", price: "120", unit: "/day/worker", features: premiumFeatures }
        ].map((plan, index) => (
          <PricingCard
            key={plan.id}
            planName={plan.planName}
            price={plan.price}
            unit={plan.unit}
            features={plan.features}
            isHighlighted={hoveredCard === null ? (plan.id === 2) : (hoveredCard === plan.id)} // Standard plan highlighted by default
            isHovered={hoveredCard === plan.id}
            onMouseEnter={() => setHoveredCard(plan.id)}
            onMouseLeave={() => setHoveredCard(null)}
            isVisible={cardVisibleStates[index]}
            animationDirection={null}
          />
        ))}
      </div>
    </section>
  );
};

export default PricingSection;