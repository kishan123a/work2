import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const JoinStepsSection = () => {
  const steps = [
    {
      number: "1",
      title: "Register in 2 minutes",
      description:
        "Fill basic details on WhatsApp. No long forms.",
    },
    {
      number: "2",
      title: "Docs check & intro",
      description:
        "Keep your ID ready. Our team will call help you.",
    },
    {
      number: "3",
      title: "Hands‑on training",
      description:
        "Complete a quick skills test and get your Worker ID.",
    },
    {
      number: "4",
      title: "Start work, get weekly pay",
      description:
        "Begin receiving job cards on WhatsApp.",
    },
  ];

  // Define the currently active step (0-indexed).
  // For the demo, let's keep step 4 (index 3) active.
  const activeStepIndex = 3;

  // --- Animation Variants Definitions ---
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const stepItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const mobileLineVariants = {
    hidden: { height: "0%" },
    visible: {
      height: "100%",
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // --- Intersection Observer Hook ---
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Calculate the width for the main animating line (foreground/black)
  // This line should extend to the start of the final green circle's segment,
  // or the center of the active circle if it's not the last one.
  const totalSegments = steps.length - 1; // e.g., 3 segments for 4 steps
  const segmentWidthPercentage = 100 / totalSegments;

  // Width of the black animated line
  let animatedBlackLineWidth = 0;
  if (activeStepIndex === totalSegments) { // If the last step is active
      animatedBlackLineWidth = (activeStepIndex - 1) * segmentWidthPercentage;
  } else if (activeStepIndex >= 0) { // If any other step is active or completed (but not last)
      animatedBlackLineWidth = activeStepIndex * segmentWidthPercentage;
  }

  // Width of the green animated line (only applies to the last segment)
  let animatedGreenLineWidth = 0;
  if (activeStepIndex === totalSegments) { // If the last step is active
      animatedGreenLineWidth = segmentWidthPercentage;
  }

  return (
    <motion.section
      className="py-16 bg-muted/30 overflow-hidden"
      id = "join-steps"
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join AgroIntel in {steps.length} easy steps
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Our streamlined process ensures you're ready to work quickly and efficiently.
          </motion.p>
        </div>



          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const isCompleted = index < activeStepIndex;
              const isActive = index === activeStepIndex;
              const isUpcoming = index > activeStepIndex;

              return (
                <motion.div
                  key={index}
                  className="relative"
                  variants={stepItemVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  transition={{ delay: index * 0.3 + 0.6 }}
                >
                  {/* Step number circle */}
                  <div className="flex justify-center mb-6">
                    <motion.div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg relative z-10 border-2
                        ${isCompleted ? 'bg-foreground border-foreground' : ''} {/* Completed steps are black */}
                        ${isActive ? 'bg-success border-success animate-pulse' : ''} {/* Active step is green, pulses */}
                        ${isUpcoming ? 'bg-foreground border-foreground' : ''} {/* Upcoming steps are also black, but without pulse */}
                        ${index === 0 && !isCompleted && !isActive ? 'bg-foreground border-foreground' : ''} {/* Default for first step if nothing active */}
                      `}
                      // Adjust border color based on the current step status for consistency
                      style={
                          isCompleted ? { borderColor: 'var(--color-foreground)' } : // Completed circles are black
                          isActive ? { borderColor: 'var(--color-success)' } : // Active circle is green
                          { borderColor: 'var(--color-foreground)' } // Upcoming are black
                      }
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : { scale: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.3 + 0.9 }}
                    >
                      {isCompleted || isActive ? ( // If completed or active, show check or number
                        index === steps.length -1 ? <CheckCircle className="w-6 h-6" /> : step.number // Show check only for the last active step
                      ) : (
                        step.number
                      )}
                    </motion.div>
                  </div>

                  {/* Step content */}
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Connecting line for mobile (vertical) */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-6">
                      <motion.div
                        className="w-0.5 h-8 bg-border"
                        initial={{ height: "0%" }}
                        animate={inView ? { height: "100%" } : { height: "0%" }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.3 + 1.2 }}
                      ></motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        {/* </div> */}
      </div>
    </motion.section>
  );
};

export default JoinStepsSection;