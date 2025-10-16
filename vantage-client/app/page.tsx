import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Founders from "./components/Founders";
import Admissions from "./components/Admissions";
import LearningSection from "./components/LearningSection";
import ProjectsSection from "./components/ProjectsSection";
import LearningPractitionersSection from "./components/LearningPractitionersSection";
import MentorsSection from "./components/MentorsSection";
import ScholarshipsSection from "./components/ScholarshipsSection";
import CallToActionSection from "./components/CallToActionSection";
import Footer from "./components/Footer";
import FinanceCompensationChart from "./components/Chart";
import HighFinance from "./components/HighFinance";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Founders />
      <MentorsSection />
      <Admissions />
      <HighFinance />
      <FinanceCompensationChart />
      <LearningPractitionersSection />
      <LearningSection />
      <ProjectsSection />
      <ScholarshipsSection />
      <CallToActionSection />
      <Footer />
    </main>
  );
}
