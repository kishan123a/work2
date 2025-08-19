import { motion, useMotionValue, useTransform, animate } from "framer-motion"; // Import 'animate'
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const StatsSection = () => {
  // Enhanced stats data: store numeric value separately for animation
  const stats = [
    {
      display: "10,000+",
      value: 50000, // Numeric value for animation
      label: "Farmers across MH",
      icon: "👥",
    },
    {
      display: "₹1,000Cr +",
      value: 1000, // Numeric value (in Cr) for animation
      label: "In wages available ",
      icon: "💰",
    },
    {
      display: "2Lakh +",
      value: 200000, // Numeric value for animation
      label: "Acres of farmland",
      icon: "🚚",
    },
  ];

  // Animation variants for individual stat items
  const statItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  // Use useInView to trigger animations
  const [ref, inView] = useInView({
    triggerOnce: true, // Only animate once when it comes into view
    threshold: 0.3, // Trigger when 30% of the component is visible
  });

  // Custom component for animating numbers
  const AnimatedNumber = ({ from, to, suffix = "", prefix = "", duration = 2.5 }) => { // Added duration prop
    const count = useMotionValue(from); // Motion value starting from 'from'
    const rounded = useTransform(count, (latest) => Math.round(latest)); // Round to integer

    useEffect(() => {
      if (inView) {
        // Use Framer Motion's 'animate' function to control the counting duration
        const animation = animate(count, to, {
          duration: duration, // Use the passed duration
          ease: "easeOut",
        });

        // Cleanup function for when the component unmounts or inView changes
        return animation.stop;
      }
    }, [inView, count, to, duration]); // Include duration in dependencies

    // Format the number with commas and then add prefix/suffix
    const formattedNumber = useTransform(rounded, (latest) => {
        let numStr = latest.toLocaleString(); // Add commas

        // Custom formatting for 'Cr' and 'Lakh'
        if (suffix === "Cr +") {
            return `${prefix}${numStr}Cr +`;
        } else if (suffix === "Lakh +") {
            return `${numStr}Lakh +`;
        }
        return `${prefix}${numStr}${suffix}`;
    });

    return <motion.span>{formattedNumber}</motion.span>;
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8" ref={ref}> {/* Attach ref to the grid container */}
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center space-y-2"
              variants={statItemVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ delay: index * 0.2 }} // Staggered animation for each stat
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl lg:text-4xl font-bold text-foreground">
                <AnimatedNumber
                  from={0}
                  to={stat.value}
                  prefix={stat.display.startsWith('₹') ? '₹' : ''} // Pass prefix based on display string
                  suffix={stat.display.includes('Cr') ? 'Cr +' : (stat.display.includes('Lakh') ? 'Lakh +' : '+')} // Pass suffix
                  duration={2.5} // Explicitly set duration for counting (e.g., 2.5 seconds)
                />
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;