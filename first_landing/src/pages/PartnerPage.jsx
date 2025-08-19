// import ServicesSection from "./componentsp/ServiceSectionp";
import CTASection from "./componentsp/CTASectionp";
import FAQSection from "./componentsp/FAQ";
import Header from "./componentsp/Headerp";
import HeroSectionp from "./componentsp/HeroSectionp";
import HowItWorksSection from "./componentsp/HowItWorksSection";
import JoinStepsSection from "./componentsp/JoinStepsSection";
import ServicesSectionp from "./componentsp/ServicesSectionp";
import StatsSection from "./componentsp/StatsSection";

export const PartnerPage = () => {
return(
    <div className="min-h-screen bg-background">
      <Header/>
      <HeroSectionp/>
      <StatsSection/>
      <HowItWorksSection/>
     
      <JoinStepsSection />
      <ServicesSectionp />
       <FAQSection/>
      <CTASection/>
    </div>
)
};


// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     // The path should be relative to the root of your domain.
//     // In a CRA app, placing serviceworker.js in public/ makes this path correct.
//     navigator.serviceWorker.register('/serviceworker.js')
//       .then(registration => {
//         console.log('Service Worker registered with scope:', registration.scope);
//       })
//       .catch(error => {
//         console.error('Service Worker registration failed:', error);
//       });
//   });
// }