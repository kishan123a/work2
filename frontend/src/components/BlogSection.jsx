import React, { useState, useEffect, useRef } from 'react';

// Reusable custom hook for scroll-triggered visibility (Unchanged)
function useSectionVisibility(threshold = 0.1) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: threshold }
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

// Icons (Unchanged)
const CommentIcon = ({ colorClass }) => ( <svg className={`w-5 h-5 ${colorClass}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.746-1.344L3 17l1.378-3.238A8.999 8.999 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM12 9H8V7h4v2zm0 3H8v-2h4v2z" clipRule="evenodd"></path></svg> );
const EyeIcon = ({ colorClass }) => ( <svg className={`w-5 h-5 ${colorClass}`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg> );
const ClockIcon = ({ colorClass }) => ( <svg className={`w-5 h-5 ${colorClass}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd"></path></svg> );

// --- NEW: Reusable Modal Component for Blog Posts ---
const BlogModal = ({ post, onClose }) => {
    if (!post) return null;

    return (
        <div 
        id = 'Blogs'
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
            onClick={onClose} // Close modal on overlay click
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 z-10 bg-white rounded-full p-1"
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="overflow-y-auto">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
                    <div className="p-6 md:p-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h2>
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                            {post.fullDescription}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// MODIFIED: BlogPostCard now accepts onReadMore and shortDescription
const BlogPostCard = ({ imageUrl, category, title, views, comments, readTime, onMouseEnter, onMouseLeave, isHovered, isVisible, shortDescription, onReadMore }) => {
    const isActive = isHovered;
    const cardBgClass = isActive ? 'bg-brandGreen' : 'bg-white';
    const categoryColorClass = isActive ? 'text-white' : 'text-brandGreen';
    const titleColorClass = isActive ? 'text-white' : 'text-gray-900';
    const metaColorClass = isActive ? 'text-white' : 'text-gray-600';
    const descriptionColorClass = isActive ? 'text-white' : 'text-gray-600';
    const buttonBgClass = isActive ? 'bg-white' : 'bg-brandGreen';
    const buttonTextColorClass = isActive ? 'text-brandGreen' : 'text-white';
    const iconColorClass = isActive ? 'text-white' : 'text-brandGreen';
    const slideInClass = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10';

    return (
        <div
            className={`flex flex-col shadow-xl rounded-xl overflow-hidden cursor-pointer transition-all duration-700 ease-out ${cardBgClass} ${slideInClass}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="w-full h-56 sm:h-64 rounded-t-xl overflow-hidden">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="p-5 sm:p-6 flex flex-col gap-4 flex-grow">
                <div className={`${categoryColorClass} text-sm font-semibold`}>{category}</div>
                <h3 className={`${titleColorClass} text-xl sm:text-2xl font-semibold leading-tight`}>{title}</h3>
                <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${metaColorClass} text-sm`}>
                    <div className="flex items-center gap-1.5"><CommentIcon colorClass={iconColorClass} /><span>{comments}</span></div>
                    <div className="flex items-center gap-1.5"><EyeIcon colorClass={iconColorClass} /><span>{views}</span></div>
                    <div className="flex items-center gap-1.5"><ClockIcon colorClass={iconColorClass} /><span>{readTime}</span></div>
                </div>
                <p className={`${descriptionColorClass} text-base leading-relaxed`}>{shortDescription}</p>
                <button 
                    onClick={onReadMore} // MODIFIED: Attach the click handler
                    className={`w-full px-6 py-3 ${buttonBgClass} rounded-full text-center shadow-md hover:opacity-90 transition-opacity mt-auto`}
                >
                    <div className={`${buttonTextColorClass} text-lg font-semibold`}>Read More</div>
                </button>
            </div>
        </div>
    );
};

const BlogSection = () => {
    const [sectionRef, sectionIsVisible] = useSectionVisibility();
    const [hoveredCard, setHoveredCard] = useState(null);
    
    // NEW: State for managing the modal
    const [selectedPost, setSelectedPost] = useState(null);

    // MODIFIED: blogPosts data now includes short and full descriptions
    const blogPosts = [
        {
            id: 1,
            imageUrl: "IMG-20250730-WA0009.jpg",
            category: "Tips",
            title: "Solving India’s Farm Labour Crisis: What We’re Learning in Nashik",
            views: "10K",
            comments: "10",
            readTime: "5 min ago",
            shortDescription: "Discover the key challenges facing agriculture in Nashik, from seasonal demand shifts to wage transparency, and how targeted digital solutions are making a difference.",
            fullDescription: `The agricultural heartlands of Nashik face a recurring paradox: a surplus of labor during some seasons and a critical shortage during others. This cyclical challenge impacts everything from crop yields to the economic stability of farming communities. Key issues include unpredictable labor availability, lack of transparent wage structures, and the logistical nightmare of connecting farmers with willing workers efficiently.
            
Our on-ground studies reveal that by creating a simple, accessible digital platform, we can bridge this gap. This platform acts as a real-time marketplace, allowing farmers to post their labor requirements and workers to find opportunities nearby. It’s more than just a job board; it’s a tool for empowerment, providing workers with better bargaining power and farmers with the reliable workforce they need to thrive.`
        },
        {
            id: 2,
            imageUrl: "IMG-20250730-WA0013.jpg",
            category: "Insight",
            title: "5 Ways AI is Transforming Rural Labour Markets",
            views: "15K",
            comments: "50",
            readTime: "7 min ago",
            shortDescription: "Artificial Intelligence is no longer just for cities. Explore five practical AI applications that are revolutionizing how labor is managed and deployed in rural India.",
            fullDescription: `Artificial Intelligence is rapidly moving beyond urban centers and into the fabric of rural economies. For agricultural labor markets, this transformation is profound. Here are five key ways AI is making an impact:

1.  **Predictive Labor Demand:** AI models analyze weather patterns, crop cycles, and historical data to forecast when and where laborers will be needed most, helping to prevent shortages.
2.  **Skill-Based Matching:** Instead of generic hiring, AI helps match laborers with specific skills (e.g., operating certain machinery, expertise in a particular crop) to the farmers who need them.
3.  **Optimized Logistics:** AI algorithms can plan the most efficient transport routes for moving labor teams from their villages to various farms, saving time and money.
4.  **Fair Wage Analysis:** By analyzing market rates across different regions, AI can suggest fair and competitive wages, promoting transparency and reducing exploitation.
5.  **Performance Analytics:** Simple data collection via mobile apps can help track efficiency and productivity, offering insights for better farm management and opportunities for worker upskilling.`
        },
        {
            id: 3,
            imageUrl: "IMG-20250730-WA0006.jpg",
            category: "Insight",
            title: "The Future of Bharat’s Agriculture Workforce",
            views: "20K",
            comments: "100",
            readTime: "10 min ago",
            shortDescription: "A look into the future, where technology, upskilling, and organized platforms create a more dignified and efficient agricultural workforce for a rising India.",
            fullDescription: `The backbone of India's economy, its agriculture workforce, is on the cusp of a major evolution. The future isn't about replacing laborers but empowering them. The coming decade will see a shift towards a more organized, skilled, and digitally integrated workforce.

This new paradigm involves three core pillars. First, **Digital Platforms** will become the primary tool for connecting labor with opportunities, eliminating the need for intermediaries and ensuring direct communication and payment. Second, **Upskilling and Certification** through accessible mobile training will allow laborers to specialize in high-demand areas like drone operation, soil analysis, and modern irrigation techniques, commanding better wages. Finally, the formalization of this sector will bring **Social Security and Financial Inclusion**, offering benefits like insurance and access to credit, creating a more stable and dignified livelihood for millions.`
        },
    ];

    // NEW: Effect to handle body scroll lock when modal is open
    useEffect(() => {
        if (selectedPost) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Cleanup function to reset scroll on component unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedPost]);

    // NEW: Functions to handle modal state
    const handleReadMoreClick = (post) => {
        setSelectedPost(post);
    };
    const handleCloseModal = () => {
        setSelectedPost(null);
    };

    return (
        <section
            id="blog"
            ref={sectionRef}
            className={`bg-white py-16 px-4 sm:px-6 lg:px-24 transition-opacity duration-1000 ${sectionIsVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900">
                    Blog And <span className="text-brandGreen">Articles</span>
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                    Stay updated with insights and trends in the agriculture workforce sector.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {blogPosts.map((post) => (
                    <BlogPostCard
                        key={post.id}
                        {...post} // Pass all post properties
                        isHovered={hoveredCard === post.id}
                        onMouseEnter={() => setHoveredCard(post.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        isVisible={sectionIsVisible} // Use overall section visibility for a unified animation
                        onReadMore={() => handleReadMoreClick(post)} // Pass the handler
                    />
                ))}
            </div>

            {/* NEW: Render the modal conditionally */}
            {selectedPost && <BlogModal post={selectedPost} onClose={handleCloseModal} />}
        </section>
    );
};

export default BlogSection;