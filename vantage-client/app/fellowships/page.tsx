import CourseInfoComponent from "../components/FellowshipHighlights";
import FellowshipHero from "../components/HeroFellowship";
import Navbar from "../components/Navbar";
import OverviewSection from "../components/OverviewSection";
import LearningHighlightsSection from "../components/LearningHighlightsSection";
import MentorsSection from "../components/MentorsSection";
import ThreeStep from "../components/ThreeStep";
import ProgramDirector from "../components/ProgramDirector";
import BuiltFor from "../components/BuiltFor";
import FAQSection from "../components/FAQSection";
import CallToActionSection from "../components/CallToActionSection";
import Footer from "../components/Footer";
import AdmissionScholarshipFees from "../components/AdmissionScholarFees";
import CertificateSection from "../components/Certificate";

export default function Fellowship() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <FellowshipHero />
      <CourseInfoComponent />
      <OverviewSection />
      <LearningHighlightsSection />
      <ProgramDirector />
      <MentorsSection />
      <ThreeStep />
      <BuiltFor />
      <AdmissionScholarshipFees/>
      <CertificateSection/>
      <CallToActionSection />
      <FAQSection />
      <Footer />
    </div>
  );
}