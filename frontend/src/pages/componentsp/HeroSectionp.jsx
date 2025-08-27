import { Button } from "../ui/button";
import { Star } from "lucide-react";
// import farmerHero from "@/assets/farmer-hero.jpg";
import workerCircle from "../assets/worker-circle.jpg";
import { motion } from "framer-motion"; // Import motion
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


const HeroSection = () => {
  // Animation variants for different elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger children animations by 0.2 seconds
        delayChildren: 0.3, // Delay the start of children animations
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 10, delay: 0.8 }, // Spring animation
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const circleImageVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20, delay: 1.2 }, // Pop from center
    },
  };

  const ratingAvatarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id = "hero" className="bg-gradient-to-br from-muted/30 to-background py-16 lg:py-24 pb-4 overflow-hidden"> {/* Added overflow-hidden */}
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-12 pb-4">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-4">
              <motion.h1
                className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight"
                variants={textVariants}
              >
                Join Maharashtra's Largest Agri Workforce.
              </motion.h1>
              <motion.p
                className="text-lg lg:text-xl text-muted-foreground"
                variants={textVariants}
              >
                Steady work. Fair wages. Be part of a trusted network that powers the agri ecosystem.
              </motion.p>
            </div>

            <motion.div variants={buttonVariants}>
              <Button size="lg" variant="hero" className="text-lg px-8 py-6">
               <a href = "/register/">Register as a Worker</a>
              </Button>
            </motion.div>

            {/* Rating Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-2">
                  {/* Avatars with staggered animation */}
                  <motion.div variants={ratingAvatarVariants} custom={0}>
                    <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                      <span className="text-sm font-medium">👨‍🌾</span>
                    </div>
                  </motion.div>
                  <motion.div variants={ratingAvatarVariants} custom={1}>
                    <div className="w-10 h-10 rounded-full bg-secondary/20 border-2 border-background flex items-center justify-center">
                      <span className="text-sm font-medium">👩‍🌾</span>
                    </div>
                  </motion.div>
                  <motion.div variants={ratingAvatarVariants} custom={2}>
                    <div className="w-10 h-10 rounded-full bg-success/20 border-2 border-background flex items-center justify-center">
                      <span className="text-sm font-medium">🚜</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div className="flex items-center space-x-2" variants={textVariants}>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <span className="text-sm font-medium">4.8 from 1,000+ workers like you</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            className="relative"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-xl"> {/* Added shadow for depth */}
             <LazyLoadImage
  src="main.webp"
  alt="Professional farmer working in the field"
  effect="blur"
  className="w-full h-auto object-cover"
/>
              {/* Circular overlay with worker image */}
              <motion.div
                className="absolute -bottom-8 -right-8 w-32 h-32 lg:w-40 lg:h-40"
                variants={circleImageVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="w-full h-full rounded-full bg-gradient-secondary p-1 shadow-lg"> {/* Added shadow */}
                  <LazyLoadImage
                    src="worker-circle.webp"
                    alt="Agricultural worker"
                    effect="blur"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;