import Hero from "./Component/HeroSections"
import WhyChooseSection from "./Component/WhyChoose"
import FAQSection from "./Component/FAQ"
import SkillsSection from "./Component/Skills"
export default function Home() {
  return (
    <>
    <Hero></Hero>
    <SkillsSection></SkillsSection>
    <WhyChooseSection></WhyChooseSection>
    <FAQSection></FAQSection>
    </>
  );
}
