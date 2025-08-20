




import React, { useState, useEffect, useRef } from 'react';

// Your existing useSectionVisibility hook remains the same
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

const ContactSection = () => {
  const [sectionRef, sectionIsVisible] = useSectionVisibility(0.2);
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [mainContentVisible, setMainContentVisible] = useState(false);

  // Form state management
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSubmissions, setPendingSubmissions] = useState(0);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Connection restored');
      // Trigger service worker to process queued requests
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'PROCESS_QUEUE'
        });
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      console.log('Connection lost - forms will be queued for later submission');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen for messages from service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleMessage = (event) => {
        if (event.data && event.data.type === 'QUEUE_STATUS') {
          setPendingSubmissions(event.data.count);
        } else if (event.data && event.data.type === 'SUBMISSION_SUCCESS') {
          console.log('Form submitted successfully from service worker');
        } else if (event.data && event.data.type === 'SUBMISSION_FAILED') {
          console.error('Form submission failed:', event.data.error);
        }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);
      
      // Request initial queue status
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'GET_QUEUE_STATUS'
        });
      }

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  // Your existing visibility logic remains the same
  useEffect(() => {
    if (sectionIsVisible) {
      const timers = [];
      timers.push(setTimeout(() => setHeadlineVisible(true), 100));
      timers.push(setTimeout(() => setMainContentVisible(true), 300));

      return () => timers.forEach(timer => clearTimeout(timer));
    } else {
      setHeadlineVisible(false);
      setMainContentVisible(false);
    }
  }, [sectionIsVisible]);

  // Simplified form submission - let service worker handle offline logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');

    const formData = {
      fullName: fullName,
      email: email,
      message: message,
      timestamp: new Date().toISOString()
    };

    const backendApiUrl = '/api/contact/submit/';

    try {
      const response = await fetch(backendApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        clearForm();
        console.log('Form submitted successfully');
      } else {
        // If we're offline, the service worker will queue this automatically
        if (!navigator.onLine) {
          setSubmitSuccess(true);
          setSubmitError('');
          clearForm();
          setPendingSubmissions(prev => prev + 1);
          console.log('Form queued for later submission');
        } else {
          const errorData = await response.json();
          setSubmitError(errorData.message || 'Failed to send message. Please try again.');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      // If we're offline or it's a network error, the service worker handles it
      if (!navigator.onLine || error.name === 'TypeError' || error.message.includes('fetch')) {
        setSubmitSuccess(true);
        setSubmitError('');
        clearForm();
        setPendingSubmissions(prev => prev + 1);
        console.log('Form queued for later submission due to network error');
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFullName('');
    setEmail('');
    setMessage('');
  };

  // Animation classes (your existing code)
  const staggeredAnimationClasses = 'transition-all duration-700 ease-out';
  const hiddenStateClassesY = 'opacity-0 translate-y-10';
  const visibleStateClassesY = 'opacity-100 translate-y-0';
  const hiddenStateClassesMainContent = 'opacity-0 translate-y-10';
  const visibleStateClassesMainContent = 'opacity-100 translate-y-0';

  return (
    <section
      ref={sectionRef}
      id = "contact"
      className={`bg-white py-16 px-4 sm:px-6 lg:px-24 font-inter`}
    >
      {/* Online/Offline Status Indicator */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className={`flex items-center justify-center gap-2 text-sm font-medium p-2 rounded-lg ${
          isOnline ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`}></div>
          {isOnline ? 'Online' : 'Offline - Forms will be sent when connection is restored'}
          {pendingSubmissions > 0 && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
              {pendingSubmissions} pending
            </span>
          )}
        </div>
      </div>

      {/* Your existing headline code remains the same */}
      <div className={`max-w-4xl mx-auto flex flex-col justify-center items-center gap-4 sm:gap-6 mb-12 sm:mb-16 text-center
        ${staggeredAnimationClasses}
        ${headlineVisible ? visibleStateClassesY : hiddenStateClassesY}
      `}>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-gray-900">
          <span className="text-green-600">Contact</span> Us
        </h2>
        <p className="text-base font-medium leading-6 text-gray-600 max-w-full lg:max-w-none">
          We are looking for partners to help us transform labour across Bharat.
        </p>
      </div>

      {/* Your existing main container code with form */}
      <div className={`max-w-7xl mx-auto flex flex-col lg:flex-row shadow-xl rounded-xl overflow-hidden
        transform transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-2xl
        ${staggeredAnimationClasses}
        ${mainContentVisible ? visibleStateClassesMainContent : hiddenStateClassesMainContent}
      `}>
        {/* Left Side - Image (your existing code) */}
        <div className="w-full lg:w-1/2 h-64 sm:h-96 lg:h-auto bg-gray-600 relative overflow-hidden rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none flex-1">
          <img
            src="IMG-20250730-WA0011.jpg"
            alt="Contact Us"
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/897x560/E0F2F1/000000?text=Image+Not+Found"; }}
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-14 bg-green-600 rounded-b-xl lg:rounded-r-xl lg:rounded-bl-none flex flex-col justify-start items-start gap-6 sm:gap-10 flex-1">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 sm:gap-8">
            {/* Your existing form fields remain the same */}
            <div className="flex flex-col gap-3 sm:gap-4 w-full">
              <label htmlFor="fullName" className="text-white text-base sm:text-xl font-semibold leading-6">Full name</label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 sm:p-4 rounded-full border border-white bg-transparent text-white placeholder-white outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
                required
              />
            </div>
            
            <div className="flex flex-col gap-3 sm:gap-4 w-full">
              <label htmlFor="email" className="text-white text-base sm:text-xl font-semibold leading-6">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 sm:p-4 rounded-full border border-white bg-transparent text-white placeholder-white outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
                required
              />
            </div>
            
            <div className="flex flex-col gap-3 sm:gap-4 w-full">
              <label htmlFor="message" className="text-white text-base sm:text-xl font-semibold leading-6">Message</label>
              <textarea
                id="message"
                placeholder="Enter your message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 sm:p-4 rounded-xl border border-white bg-transparent text-white placeholder-white outline-none focus:ring-2 focus:ring-white resize-y text-sm sm:text-base
                  focus:bg-white focus:text-gray-900"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className={`w-full px-8 py-4 sm:px-10 sm:py-6 rounded-full text-base sm:text-xl font-semibold leading-6 text-center mt-4 sm:mt-6 shadow-md transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                isOnline 
                  ? 'bg-white text-green-600 hover:bg-gray-100' 
                  : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : isOnline ? 'Submit' : 'Save for Later'}
            </button>

            {/* Submission Feedback */}
            {submitSuccess && (
              <div className="mt-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-medium">
                {isOnline 
                  ? "Message sent successfully! We'll get back to you soon."
                  : "Message saved! It will be sent automatically when you're back online."}
              </div>
            )}
            {submitError && (
              <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-800 text-center font-medium">
                Error: {submitError}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;