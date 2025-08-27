import React, { useState, useEffect, useRef } from 'react';

// Reusable custom hook for scroll-triggered visibility
function useSectionVisibility(threshold = 0.2) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger visibility only when intersecting and not already visible
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Stop observing after it's visible
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
}

const EndorsementSection = () => {
  const [sectionRef, sectionIsVisible] = useSectionVisibility(0.3);

  // Staggered animation classes
  const baseTransition = 'transition-all duration-1000 ease-out';
  const hiddenState = 'opacity-0 translate-y-8';
  const visibleState = 'opacity-100 translate-y-0';

  return (
    <section 
      ref={sectionRef} 
      className="bg-gray-50 py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* ========== Image Column ========== */}
          <div
            className={`
              ${baseTransition} 
              ${sectionIsVisible ? visibleState : hiddenState}
            `}
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto rounded-xl shadow-2xl overflow-hidden">
                <img
                    src="client.webp" // Replace with actual image of Vilas Shinde
                    alt="Vilas Shinde, Chairman of Sahyadri Farms"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold text-white"></h3>
                    <p className="text-md text-gray-200"></p>
                </div>
            </div>
          </div>

          {/* ========== Text Content Column ========== */}
          <div
            className={`
              ${baseTransition} 
              ${sectionIsVisible ? visibleState : hiddenState} 
              [transition-delay:200ms]
            `}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Backed by <span className="text-brandGreen">Sahyadri Farms</span>
            </h2>
            
            <p className="mt-6 text-lg text-gray-600">
            With 18,000+ farmer members, India’s largest farmer-owned company is helping us build the workforce engine that drives Bharat’s horticulture forward.
            </p>

            <blockquote className="mt-8 p-6 border-l-4 border-brandGreen bg-white shadow-md rounded-r-lg">
              <p className="text-lg text-gray-700 italic leading-relaxed">
                “Unreliable labour has long held farmers back. With this platform, we give every farmer access to skilled, dependable teams — enabling them to focus on high-value crops and increase their incomes.” — Vilas Shinde, Chairman, Sahyadri Farms
              </p>
            </blockquote>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EndorsementSection;