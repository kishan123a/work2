import { Smartphone, Users, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";

// Helper function to get the number of days in a month for a given year
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper function to get the day of the week for the first day of a month
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
};

const HowItWorksSection = () => {
  const features = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Tell us when and where you want to work",
      description:
        "We’ll match you with farmers based on your location and skill set so you always have steady work.",
      color: "text-primary",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "We take care of all the hassle",
      description:
        "We provide training, tools, and supervisors so your work is safe and respected.",
      color: "text-secondary",
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Get paid weekly, with minimum work guaranteed",
      description:
        "We ensure your peace of mind with automated weekly payouts and guaranteed minimum work opportunities",
      color: "text-success",
    },
  ];

  // --- Animation Variants Definitions ---
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const featureItemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const appMockupVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const calendarDayVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // --- Intersection Observer Hook ---
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // --- Calendar Logic Enhancements ---
  const today = new Date();
  const currentDayOfMonth = today.getDate();
  const currentMonth = today.getMonth(); // 0-indexed
  const currentYear = today.getFullYear();

  // For our mockup, we'll hardcode July 2024 for consistent demo,
  // but use current day for 'today' if within that month/year.
  const displayMonth = 6; // July (0-indexed)
  const displayYear = 2024;
  const daysInDisplayMonth = getDaysInMonth(displayYear, displayMonth);
  const firstDayOfDisplayMonth = getFirstDayOfMonth(displayYear, displayMonth); // 0=Sun, 1=Mon, etc.

  // Determine if today's actual date falls within our mocked July 2024
  const isCurrentMonthDisplayed =
    currentMonth === displayMonth && currentYear === displayYear;
  const effectiveToday = isCurrentMonthDisplayed ? currentDayOfMonth : 0; // 0 if not current month

  // --- Mock Data for Different Views ---
  const allWorkDays = [1, 5, 10, 15, 20, 25, 30]; // Days with work (past & future)
  const futureAppointments = [15, 20, 25, 30]; // Only future appointments (subset of all work days, in future)
  const unavailableDays = [6, 7, 13, 14, 27, 28]; // Weekends / fixed unavailable days

  // --- State for Calendar View Mode ---
  const [calendarViewMode, setCalendarViewMode] = useState("default"); // 'default', 'workCalendar', 'futureAppointments'

  // --- Calendar Day Click State (for individual day selection feedback) ---
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(effectiveToday);

  const handleDayClick = (day) => {
    if (!unavailableDays.includes(day)) {
      setSelectedCalendarDay(day);
      console.log(`Day ${day} clicked!`);
      // In a real app, this would trigger a modal or detailed view for that specific day
    }
  };

  const handleWorkCalendarClick = () => {
    console.log("Showing all work days!");
    setCalendarViewMode("workCalendar");
    // Optionally reset selected day when changing view mode
    setSelectedCalendarDay(0);
  };

  const handleViewAllAppointments = () => {
    console.log("Showing future appointments!");
    setCalendarViewMode("futureAppointments");
    // Optionally reset selected day when changing view mode
    setSelectedCalendarDay(0);
  };

  // --- Render Logic based on View Mode ---
  const getDayClassNames = (day) => {
    const isToday = day === effectiveToday; // Check against current actual day if in current month
    const isUnavailable = unavailableDays.includes(day);
    const isSelected = day === selectedCalendarDay;
    const isPastDay = isCurrentMonthDisplayed && day < effectiveToday;


    let baseClasses = `h-8 w-8 flex items-center justify-center rounded-lg relative ${isUnavailable ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400' : 'cursor-pointer'}`;
    let highlightClass = '';
    let dotClass = '';
    let dayTextColor = 'text-foreground';

    if (isToday && calendarViewMode === 'default') {
      highlightClass = 'bg-primary text-primary-foreground font-bold shadow-md ring-2 ring-primary/50';
      dayTextColor = 'text-primary-foreground';
    } else if (isSelected && !isToday) {
      highlightClass = 'bg-accent text-accent-foreground border-2 border-accent/70';
      dayTextColor = 'text-accent-foreground';
    } else if (isPastDay && !isUnavailable) {
      dayTextColor = 'text-muted-foreground/60';
    }


    switch (calendarViewMode) {
      case 'workCalendar':
        if (allWorkDays.includes(day)) {
          highlightClass = 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 font-medium';
          dayTextColor = 'text-blue-800 dark:text-blue-200';
          dotClass = 'bg-blue-500'; // Scheduled dot
        } else if (!isUnavailable) {
          dayTextColor = 'text-muted-foreground/60'; // Dim non-work days
        }
        if (isToday && allWorkDays.includes(day)) { // Still highlight today if it's a work day
            highlightClass = 'bg-primary text-primary-foreground font-bold shadow-md ring-2 ring-primary/50';
            dayTextColor = 'text-primary-foreground';
            dotClass = 'bg-primary'; // Primary dot for today
        }
        break;
      case 'futureAppointments':
        const isFuture = !isCurrentMonthDisplayed || day > effectiveToday; // Consider days in mocked month as future if not actual current month
        if (futureAppointments.includes(day) && isFuture) {
          highlightClass = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700 font-medium';
          dayTextColor = 'text-green-800 dark:text-green-200';
          dotClass = 'bg-green-500'; // Appointment dot
        } else if (!isUnavailable) {
            dayTextColor = 'text-muted-foreground/60'; // Dim non-appointment days
        }
        if (isToday && futureAppointments.includes(day) && isFuture) { // Highlight today if it's a future appointment
            highlightClass = 'bg-primary text-primary-foreground font-bold shadow-md ring-2 ring-primary/50';
            dayTextColor = 'text-primary-foreground';
            dotClass = 'bg-primary';
        }
        break;
      default: // 'default' view mode
        if (!isToday && !isUnavailable && !isSelected) {
          highlightClass += ' hover:bg-muted/70 transition-colors duration-200';
        }
        break;
    }

    // Apply selected styling on top if a day is selected
    if (isSelected && !isToday && !isUnavailable) {
        highlightClass = 'bg-accent text-accent-foreground border-2 border-accent/70';
        dayTextColor = 'text-accent-foreground';
    }


    return {
      classes: `${baseClasses} ${highlightClass} ${dayTextColor}`,
      showDot: !!dotClass, // Convert to boolean
      dotColor: dotClass
    };
  };

  const getLegendItems = () => {
    switch (calendarViewMode) {
      case 'workCalendar':
        return (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">Work Day (Scheduled/Worked)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
              <span className="text-muted-foreground">Unavailable / No Work</span>
            </div>
          </>
        );
      case 'futureAppointments':
        return (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Future Appointment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
              <span className="text-muted-foreground">No Appointment</span>
            </div>
          </>
        );
      default: // 'default' view mode
        return (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Today's Date</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-accent rounded-full"></div>
              <span className="text-muted-foreground">Selected Day</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
              <span className="text-muted-foreground">Unavailable / Weekend</span>
            </div>
          </>
        );
    }
  };


  return (
    <motion.section
      className="py-16 bg-background overflow-hidden"
      id = "how-it-works"
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
            Why Work With Us?
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Steady farm work. Fair pay. Full support.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/30 transition-colors duration-300 cursor-pointer"
                variants={featureItemVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ delay: index * 0.2 + 0.5 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div
                  className={`${feature.color} bg-muted/50 p-3 rounded-lg flex-shrink-0 shadow-md`}
                >
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right side - App mockup */}
          <motion.div
            className="relative p-6 bg-card border border-border rounded-2xl shadow-xl lg:ml-8 lg:mr-0 md:mx-auto md:max-w-md lg:max-w-none"
            variants={appMockupVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ delay: 0.8 }}
          >
            {/* Header: Clickable to show Work Calendar */}
            <motion.div
              className="bg-primary text-primary-foreground rounded-lg p-4 mb-6 text-center shadow-sm cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWorkCalendarClick}
            >
              <span className="text-sm font-medium">📅 Your Work Calendar</span>
            </motion.div>

            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-foreground">July 2024</span>
                <div className="flex space-x-2 text-muted-foreground">
                  <button className="p-1 rounded-full hover:bg-muted"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
                  <button className="p-1 rounded-full hover:bg-muted"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                <div className="text-muted-foreground font-semibold">Sun</div>
                <div className="text-muted-foreground font-semibold">Mon</div>
                <div className="text-muted-foreground font-semibold">Tue</div>
                <div className="text-muted-foreground font-semibold">Wed</div>
                <div className="text-muted-foreground font-semibold">Thu</div>
                <div className="text-muted-foreground font-semibold">Fri</div>
                <div className="text-muted-foreground font-semibold">Sat</div>

                {/* Dynamic placeholder for first day of month alignment */}
                {Array(firstDayOfDisplayMonth).fill(0).map((_, i) => (
                    <div key={`empty-${i}`}></div>
                ))}

                {/* Calendar days */}
                {[...Array(daysInDisplayMonth)].map((_, i) => {
                  const day = i + 1;
                  const { classes, showDot, dotColor } = getDayClassNames(day);

                  return (
                    <motion.div
                      key={i}
                      className={classes}
                      variants={calendarDayVariants}
                      initial="hidden"
                      animate={inView ? "visible" : "hidden"}
                      transition={{ delay: 1 + i * 0.02 }} // Slightly faster stagger for days
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDayClick(day)}
                    >
                      {day}
                      {showDot && (
                        <span className={`absolute bottom-0.5 right-0.5 w-1.5 h-1.5 ${dotColor} rounded-full`}></span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border mt-6">
                <div className="space-y-3 text-xs">
                  {getLegendItems()}
                </div>
              </div>
            </div>

            {/* View All Appointments Button */}
            <div className="mt-6 text-center">
              <motion.button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewAllAppointments}
              >
                View Job Card
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HowItWorksSection;