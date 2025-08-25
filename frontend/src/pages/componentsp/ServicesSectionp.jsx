import { Card, CardContent } from "../ui/card";
import { useState } from "react"; // Import useState for modal state
import { motion, AnimatePresence } from "framer-motion"; // For animations
import { X } from "lucide-react"; // For the close icon

const ServicesSectionp = () => {
  const services = [
    {
      title: "Supervisor / Mukkadam (Manages Teams)",
      description:
        "Lead labour groups, plan shifts, allocate tasks, track attendance, quality and safety.",
      icon: "🧭",
      image: "svc_supervisor.jpg",
      detail:
        "Monthly retainer or daily rate. Handles on‑ground coordination, issue resolution, tool/PPE checks and farmer updates.",
    },
    {
      title: "Pruning Specialist – Grapes",
      description:
        "Forward & foundation pruning by trained hands for clean cuts and healthy regrowth.",
      icon: "✂️",
      image: "svc_pruning.jpg",
      detail:
        "Piece‑rate per acre/row or daily. Includes canopy balance, tool discipline, waste removal and SOP‑based speed teams.",
    },
    {
      title: "Tomato Operations – Tying & Care",
      description:
        "Trellis tying, staking, de‑suckering and training for neat canopies and faster harvests.",
      icon: "🍅",
      image: "svc_tomato.jpg",
      detail:
        "Piece‑rate per bed/row or daily. Teams formed by experience/speed; quick orientation provided on site.",
    },
    {
      title: "Harvesting (Multi‑Crop)",
      description:
        "Gentle picking, sorting and crate movement for grapes, tomatoes or bananas as per season.",
      icon: "🧺",
      image: "svc_harvest.jpg",
      detail:
        "Piece‑rate per crate/box/kg or daily. Includes basic QC, packhouse coordination and post‑harvest handling discipline.",
    },
    {
      title: "General Labour (Unskilled)",
      description:
        "Weeding, mulching, drip laying, loading/unloading, field clean‑up and camp support.",
      icon: "🧱",
      image: "svc_general1.jpg",
      detail:
        "Daily wages with weekly payouts. Can be paired with a supervisor for larger sites; tools and guidance provided.",
    },
    {
      title: "Banana Fruit Care",
      description:
        "Bagging, propping, leaf management, de‑handing support and orchard hygiene.",
      icon: "🍌",
      image: "svc_banana.png",
      detail:
        "Piece‑rate per bunch/acre or daily. Safety/PPE guidance included; residue‑safe practices and simple record‑keeping.",
    },
  ];

  // State to manage modal visibility and content
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const openModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    document.body.style.overflow = ''; // Re-enable scrolling
  };

  // Animation variants for the modal
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const dialogVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 50 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 25 } },
    exit: { scale: 0.8, opacity: 0, y: 50, transition: { duration: 0.2 } },
  };


  return (
    <section id = "services" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Work Available for Everyone
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border bg-card"
              onClick={() => openModal(service)} // Add onClick handler here
            >
              <CardContent className="p-0">
                
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-2xl">
                    {service.icon}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* The Modal Component */}
      <AnimatePresence>
        {isModalOpen && selectedService && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal} // Close when clicking on the overlay
          >
            <motion.div
              className="relative bg-card rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" // Added max-h and overflow-y
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
              role="dialog" // ARIA role
              aria-modal="true" // ARIA attribute
              aria-labelledby="modal-title" // ARIA label
            >
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-background/80 text-foreground hover:bg-background/100 z-10"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-72 object-cover" // Larger image for modal
                />
              </div>

              <div className="p-6 space-y-4">
                <h3 id="modal-title" className="text-2xl font-bold text-foreground">
                  {selectedService.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedService.description}
                </p>

                {/* Example of additional detail like "Household related services" */}
                <div className="border-t border-border pt-4 mt-4 space-y-2">
                  <div className="flex items-center space-x-2 text-foreground font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5V10h2v7.5h-2zm0-9V7h2v1.5h-2z" /> {/* Simple info icon */}
                    </svg>
                    <span>More details about this service</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This service includes specialized tasks like advanced crop diagnostics,
                    specific livestock breeding programs, or intricate equipment repair, etc.
                  </p>
                </div>
                {/* You can add more specific details here based on your service data */}

                {/* Optional: Add a call to action button inside the modal */}
                <div className="mt-6 text-center">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    <a href="#join-steps" >
            Learn More / Book Now
            </a>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServicesSectionp;