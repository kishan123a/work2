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

// Reusable FAQItem Component
const FAQItem = ({ question, answer, isOpen, onClick, isVisible, animationDirection }) => {
  const itemBgClass = isOpen ? 'bg-brandGreen' : 'bg-white';
  const questionColorClass = isOpen ? 'text-white' : 'text-gray-900';
  const answerColorClass = isOpen ? 'text-white' : 'text-gray-600';
  const chevronColorClass = isOpen ? 'text-white' : 'text-gray-900';

  // Animation classes for individual FAQ item
  const slideInClass = isVisible
    ? 'opacity-100 translate-y-0'
    : (animationDirection === 'left' ? 'opacity-0 -translate-x-10' : 'opacity-0 translate-x-10');


  return (
    <div
   
      className={`w-full p-8 shadow-xl rounded-xl cursor-pointer
        transition-all duration-700 ease-out
        ${itemBgClass}
        ${slideInClass}
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h3 className={`flex-1 text-xl sm:text-2xl lg:text-3xl font-semibold leading-8 ${questionColorClass}`}> {/* Responsive font size */}
          {question}
        </h3>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${chevronColorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> {/* Responsive icon size */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </span>
      </div>
      {isOpen && (
        <p className={`mt-4 text-sm sm:text-base font-medium leading-6 ${answerColorClass}`}> {/* Responsive font size */}
          {answer}
        </p>
      )}
    </div>
  );
};

const FAQSection = () => {
  const [sectionRef, sectionIsVisible] = useSectionVisibility(0.2); // Overall section visibility
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [faqVisibleStates, setFaqVisibleStates] = useState(Array(5).fill(false)); // State for the 5 FAQ items
  const [openFAQ, setOpenFAQ] = useState(0); // State to manage which FAQ is open

  const faqs = [
    {
      id: 1,
      question: "What kind of work do you provide?",
      answer:"Skilled, semi‑skilled and unskilled farm work throughout the year across Maharashtra.",
    },
    {
      id: 2,
      question: "How do I join and get jobs?",
      answer:"Register on WhatsApp (2 minutes). Pick your dates and location. We send job cards and call you when a suitable job is available.",
    },
    {
      id: 3,
      question: "How are payments handled?",
      answer:"Weekly payouts to your bank/UPI. Rates may be daily, piece‑rate (per acre/row/box/kg), or monthly retainer for longer jobs. You’ll get clear records for every shift.",
    },
    {
      id: 4,
      question: "Do you arrange transport and stay?",
      answer:
        "Yes, for eligible jobs we arrange pickup points, safe travel, and basic camp facilities (stay, sanitation). If you self‑arrange, we’ll guide you on allowances where applicable.",
    },
    {
      id: 5,
      question: "How do you ensure training and safety?",
      answer:
        "ID verification, short orientation/training, PPE and safety briefings. Supervisors are on‑ground to monitor quality, timings and fair treatment.",
    },
  ];

  useEffect(() => {
    if (sectionIsVisible) {
      const timers = [];
      timers.push(setTimeout(() => setHeadlineVisible(true), 100));

      // Stagger individual FAQ items
      faqs.forEach((_, index) => {
        timers.push(setTimeout(() => {
          setFaqVisibleStates(prev => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
          });
        }, 300 + index * 100)); // Stagger each FAQ by 100ms
      });

      return () => timers.forEach(timer => clearTimeout(timer));
    } else {
      // Hide all elements when the section scrolls out of view
      setHeadlineVisible(false);
      setFaqVisibleStates(Array(faqs.length).fill(false)); // Reset all FAQs to hidden
      setOpenFAQ(null); // Close any open FAQ when section hides
    }
  }, [sectionIsVisible, faqs.length]);

  const handleFAQClick = (index) => {
    setOpenFAQ(openFAQ === index ? null : index); // Toggle open/close
  };

  // Common animation classes for headline (slide up/down)
  const staggeredAnimationClasses = 'transition-all duration-700 ease-out';
  const hiddenStateClassesY = 'opacity-0 translate-y-10';
  const visibleStateClassesY = 'opacity-100 translate-y-0';


  return (
    <section
      ref={sectionRef}
      id = "faq"// Attach ref for overall section visibility
      className={`bg-white py-16 px-4 sm:px-6 lg:px-24`}
    >
      {/* Headline and Subheading */}
      <div className={`max-w-4xl mx-auto flex flex-col justify-center items-center gap-4 sm:gap-6 mb-12 sm:mb-16 text-center
        ${staggeredAnimationClasses}
        ${headlineVisible ? visibleStateClassesY : hiddenStateClassesY}
      `}>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-gray-900">
          Frequently Asked <span className="text-brandGreen">Questions</span>
        </h2>
        <p className="text-base font-medium leading-6 text-gray-600 max-w-full lg:max-w-none">
          Find answers to common questions about our services and how we operate.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:gap-8"> {/* Responsive gap */}
        {faqs.map((faq, index) => (
          <FAQItem
            key={faq.id} // Use ID for key
            question={faq.question}
            answer={faq.answer}
            isOpen={openFAQ === index}
            onClick={() => handleFAQClick(index)}
            // Animation props for individual FAQ item
            isVisible={faqVisibleStates[index]}
            animationDirection={index % 2 === 0 ? 'left' : 'right'} // Alternate direction for cards
          />
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
