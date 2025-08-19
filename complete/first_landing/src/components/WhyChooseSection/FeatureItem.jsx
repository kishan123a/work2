import React from 'react';

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

export default FeatureItem;