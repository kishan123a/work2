import React, { useState, useEffect, useRef } from 'react';
// ... (other imports are the same)
import { FaGlobe, FaCalendarAlt, FaGraduationCap, FaUserCheck, FaTruck, FaRoute, FaHardHat, FaUsers, FaMobileAlt, FaChartBar, FaWallet, FaHome, FaHandshake } from "react-icons/fa";



function useSectionVisibility(threshold = 0.2) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  return [ref, isVisible];
}
// Reusable ServiceCard Component
// We add 'alignmentClass' to the props
const ServiceCard = ({ title, description, isFeatured = false, onMouseEnter, onMouseLeave, isHovered, icon }) => {
  const isActive = isFeatured || isHovered;

  const cardBgClass = isActive ? 'bg-brandGreen' : 'bg-white';
  const titleColorClass = isActive ? 'text-white' : 'text-gray-900';
  const descriptionColorClass = isActive ? 'text-white' : 'text-gray-600';

  return (
    <div
      className="p-6 sm:p-8 shadow-xl rounded-xl flex flex-col justify-start items-start gap-4 sm:gap-6
        transition-all duration-300 ease-in-out cursor-pointer group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`p-6 rounded-xl flex flex-col justify-center items-start gap-4 sm:gap-6
          transition-all duration-300 ease-in-out w-full h-full ${cardBgClass}`}
      >
        {/* ==== ICON ==== */}
        <div
  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 
  ${isActive ? 'bg-white text-brandGreen' : 'bg-brandGreen text-white'}`}
>
  {icon}
</div>

        {/* ==== TITLE + DESCRIPTION ==== */}
        <div className="flex flex-col justify-center items-start gap-3 sm:gap-4">
          <h3 className={`text-2xl sm:text-3xl font-semibold leading-8 ${titleColorClass} transition-colors duration-300`}>
            {title}
          </h3>
          <p className={`text-sm sm:text-base font-medium leading-6 ${descriptionColorClass} transition-colors duration-300`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};



const ServicesSection = () => {
  // ... (the rest of the component is exactly the same as before)
  const [sectionRef, sectionIsVisible] = useSectionVisibility(0.2);
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (sectionIsVisible) {
      const timers = [];
      timers.push(setTimeout(() => setHeadlineVisible(true), 100));
      timers.push(setTimeout(() => setCardsVisible(true), 300));
      return () => timers.forEach((timer) => clearTimeout(timer));
    } else {
      setHeadlineVisible(false);
      setCardsVisible(false);
    }
  }, [sectionIsVisible]);

const services = [
  {
    id: 1,
    icon: <img src="global-search.webp" alt="Sourcing & Booking" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />,
    title: "Sourcing & Booking",
    description: "We match farmers with trained workers instantly — no scrambling, no delays.",
    isFeatured: true,
  },
  {
    id: 2,
    icon: <img src="workshop.webp" alt="Training & Quality Control" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />,
    title: "Training & Quality Control",
    description: "We upskill workers crop by crop and ensure every task meets the highest standard.",
  },
  {
    id: 3,
    icon: <img src="bus.webp" alt="Transport & Logistics" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />,
    title: "Transport & Logistics",
    description: "We manage door-to-farm transport, so workers arrive on time, ready to deliver.",
  },
  {
    id: 4,
    icon: <img src="process.webp" alt="On-Ground Execution" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />,
    title: "On-Ground Execution",
    description: "Supervisors enforce discipline, track progress, and fix issues fast.",
  },
  {
    id: 5,
    icon: <img src="cash-payment.webp" alt="Payments & Records" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />,
    title: "Payments & Records",
    description: "Wages, attendance, and bookings are tracked digitally — transparent, fair, and on time.",
  },
  {
    id: 6,
    icon: <img src="welfare.webp" alt="Welfare & Support" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />,
    title: "Welfare & Support",
    description: "Housing, food, sanitation - keep workers content and farmers worry-free.",
  },
];


  return (
    <section id="services" ref={sectionRef} className="bg-white py-16 px-4 sm:px-6 lg:px-24">
      {/* Headline */}
      <div className={`max-w-7xl mx-auto flex flex-col justify-center items-center gap-4 sm:gap-6 mb-12 sm:mb-16 text-center transition-all duration-700 ease-out ${headlineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-gray-900">
          Our Labour <span className="text-brandGreen">Engine</span>
        </h2>
        <p className="text-base font-medium leading-6 text-gray-600 max-w-full lg:max-w-none">
          One platform. Every service connected.
        </p>
      </div>

      {/* Cards */}
      <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch transition-all duration-700 ease-out ${cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            icon={service.icon}
            title={service.title}
            description={service.description}
            isFeatured={hoveredCard === null && service.isFeatured}
            isHovered={hoveredCard === service.id}
            onMouseEnter={() => setHoveredCard(service.id)}
            onMouseLeave={() => setHoveredCard(null)}
            alignmentClass={service.alignmentClass}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
// import React, { useState, useEffect, useRef } from 'react';

// // --- Icon Imports (optional if you want to mix React icons + emojis) ---
// import { FaClipboardList, FaCertificate, FaTruck, FaHardHat, FaWallet, FaShieldAlt } from 'react-icons/fa';

// // Reusable custom hook for scroll-triggered visibility
// function useSectionVisibility(threshold = 0.2) {
//   const [isVisible, setIsVisible] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsVisible(entry.isIntersecting);
//       },
//       { threshold }
//     );

//     const currentRef = ref.current;
//     if (currentRef) observer.observe(currentRef);

//     return () => {
//       if (currentRef) observer.unobserve(currentRef);
//     };
//   }, [threshold]);

//   return [ref, isVisible];
// }

// // Reusable ServiceCard Component
// const ServiceCard = ({ title, description, isFeatured = false, onMouseEnter, onMouseLeave, isHovered, icon }) => {
//   const isActive = isFeatured || isHovered;

//   const cardBgClass = isActive ? 'bg-brandGreen' : 'bg-white';
//   const titleColorClass = isActive ? 'text-white' : 'text-gray-900';
//   const descriptionColorClass = isActive ? 'text-white' : 'text-gray-600';
//   const iconBgClass = isActive ? 'bg-white' : 'bg-brandGreen';
//   const iconColorClass = isActive ? 'text-brandGreen' : 'text-white';

//   return (
//     <div
//       className="p-6 sm:p-8 shadow-xl rounded-xl flex flex-col justify-start items-start gap-4 sm:gap-6
//         transition-all duration-300 ease-in-out cursor-pointer group"
//       onMouseEnter={onMouseEnter}
//       onMouseLeave={onMouseLeave}
//     >
//       <div
//         className={`p-6 rounded-xl flex flex-col justify-center items-start gap-4 sm:gap-6
//           transition-all duration-300 ease-in-out w-full h-full ${cardBgClass}`}
//       >
//         <div
//           className={`w-12 h-12 sm:w-16 sm:h-16 ${iconBgClass} rounded-lg flex items-center justify-center transition-all duration-300 text-2xl sm:text-3xl`}
//         >
//           {/* Handle emoji (string) or React icon */}
//           {typeof icon === 'string' ? (
//             // ==== CHANGE HERE ====
//             // Added flex properties to perfectly center the emoji characters
//             <span className="transition-all duration-300 flex items-center justify-center">{icon}</span>
//           ) : (
//             icon && React.createElement(icon, { className: `w-6 h-6 sm:w-8 sm:h-8 ${iconColorClass} transition-all duration-300` })
//           )}
//         </div>
//         <div className="flex flex-col justify-center items-start gap-3 sm:gap-4">
//           <h3 className={`text-2xl sm:text-3xl font-semibold leading-8 ${titleColorClass} transition-colors duration-300`}>
//             {title}
//           </h3>
//           <p className={`text-sm sm:text-base font-medium leading-6 ${descriptionColorClass} transition-colors duration-300`}>
//             {description}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ServicesSection = () => {
//   const [sectionRef, sectionIsVisible] = useSectionVisibility(0.2);
//   const [headlineVisible, setHeadlineVisible] = useState(false);
//   const [cardsVisible, setCardsVisible] = useState(false);
//   const [hoveredCard, setHoveredCard] = useState(null);

//   useEffect(() => {
//     if (sectionIsVisible) {
//       const timers = [];
//       timers.push(setTimeout(() => setHeadlineVisible(true), 100));
//       timers.push(setTimeout(() => setCardsVisible(true), 300));
//       return () => timers.forEach((timer) => clearTimeout(timer));
//     } else {
//       setHeadlineVisible(false);
//       setCardsVisible(false);
//     }
//   }, [sectionIsVisible]);

//   // --- Services Array with Emoji Icons ---
//   const services = [
//     { id: 1, icon: "🌐📅", title: "Sourcing & Booking", description: "We match farmers with trained workers instantly — no scrambling, no delays.", isFeatured: true, },
//     { id: 2, icon: "👨‍🏫✅", title: "Training & Quality Control", description: "We upskill workers crop by crop and ensure every task meets the highest standard.", },
//     { id: 3, icon: "🚛🛣️", title: "Transport & Logistics", description: "We manage door-to-farm transport, so workers arrive on time, ready to deliver.", },
//     { id: 4, icon: "👷‍♂️", title: "On-Ground Execution", description: "Supervisors enforce discipline, track progress, and fix issues fast.", },
//     { id: 5, icon: "📲📊", title: "Payments & Records", description: "Wages, attendance, and bookings are tracked digitally — transparent, fair, and on time.", },
//     { id: 6, icon: "🛖🌾", title: "Welfare & Support", description: "Housing, food, sanitation - keep workers content and farmers worry-free.", },
//   ];

//   const staggeredAnimationClasses = 'transition-all duration-700 ease-out';
//   const hiddenStateClassesY = 'opacity-0 translate-y-10';
//   const visibleStateClassesY = 'opacity-100 translate-y-0';
//   const hiddenStateClassesX = 'opacity-0 -translate-x-10';
//   const visibleStateClassesX = 'opacity-100 translate-x-0';

//   return (
//     <section id="services" ref={sectionRef} className="bg-white py-16 px-4 sm:px-6 lg:px-24">
//       {/* Headline */}
//       <div
//         className={`max-w-7xl mx-auto flex flex-col justify-center items-center gap-4 sm:gap-6 mb-12 sm:mb-16 text-center
//           ${staggeredAnimationClasses}
//           ${headlineVisible ? visibleStateClassesY : hiddenStateClassesY}`}
//       >
//         <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-gray-900">
//           Our Labour <span className="text-brandGreen">Engine</span>
//         </h2>
//         <p className="text-base font-medium leading-6 text-gray-600 max-w-full lg:max-w-none">
//           One platform. Every service connected.
//         </p>
//       </div>

//       {/* Cards */}
//       <div
//         className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch
//           ${staggeredAnimationClasses}
//           ${cardsVisible ? visibleStateClassesX : hiddenStateClassesX}`}
//       >
//         {services.map((service) => (
//           <ServiceCard
//             key={service.id}
//             icon={service.icon}
//             title={service.title}
//             description={service.description}
//             isFeatured={hoveredCard === null && service.isFeatured}
//             isHovered={hoveredCard === service.id}
//             onMouseEnter={() => setHoveredCard(service.id)}
//             onMouseLeave={() => setHoveredCard(null)}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default ServicesSection;