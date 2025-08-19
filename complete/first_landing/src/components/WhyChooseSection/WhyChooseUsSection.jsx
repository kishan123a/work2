import React, { useState, useEffect, useRef } from 'react';
// IMPORTANT: Import the model-viewer web component to register it
import '@google/model-viewer';

import { useSectionVisibility } from './useSectionVisibility';
import FeatureItem from './FeatureItem';

const WhyChooseUsSection = () => {
  const [sectionRef, sectionIsVisible] = useSectionVisibility(0.2);
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [featureItemVisibleStates, setFeatureItemVisibleStates] = useState(Array(4).fill(false));

  // No specific ref needed for model-viewer beyond its container visibility
  // The <model-viewer> element handles its own lifecycle

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

      return () => {
        timers.forEach(timer => clearTimeout(timer));
        // No explicit cleanup needed for model-viewer as it's a web component
        // and handles its own DOM lifecycle.
      };
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
  const visibleStateClassesX = 'opacity-100 translate-x-0';

  const features = [
    { id: 1, icon: '✅', text: 'Expertise – Trained labour for every agri task.' },
    { id: 2, icon: '⏳', text: 'Timeliness – Book labour exactly when you need them.' },
    { id: 3, icon: '🛠️', text: 'Customization – Pruning, harvesting, packhouse – we cover it all.' },
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

      {/* Main Content Area: 3D Model and Feature List */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
        {/* Left Side - 3D Model Viewer */}
        <div
          className={`w-full lg:w-1/2 rounded-xl overflow-hidden shadow-lg h-64 sm:h-96 max-h-[400px] lg:h-[560px] lg:max-h-none bg-gray-200 flex items-center justify-center order-first lg:order-none
            ${staggeredAnimationClasses}
            ${imageVisible ? visibleStateClassesX : hiddenStateClassesXLeft}
          `}
          // Ensure min-height for the model-viewer to render correctly
          style={{ minHeight: '300px' }}
        >
          {/*
            The <model-viewer> web component.
            - src: Path to your .glb or .gltf model file. Place it in the 'public' folder.
            - alt: Accessible description for the model.
            - camera-controls: Allows user to rotate, pan, and zoom the model.
            - auto-rotate: Makes the model spin automatically.
            - shadow-intensity: Adjusts shadow visibility.
            - ar: Enables Augmented Reality on supported devices (e.g., mobile).
            - poster: An optional image to show while the model loads.
          */}
          <model-viewer
            src="/my-farm-equipment.glb" // <--- IMPORTANT: Update this path to your GLB/GLTF model
            alt="A 3D model of agricultural equipment or a farm structure"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            ar
            poster="https://placehold.co/853x560/E2E8F0/A0AEC0?text=Loading+3D+Model" // Optional: placeholder image
            style={{ width: '100%', height: '100%', display: 'block' }}
          ></model-viewer>
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