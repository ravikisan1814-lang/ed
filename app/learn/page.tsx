import SimpleHierarchy from "@/components/learn/SimpleHierarchy";
import BackButton from "@/components/BackButton";

export const metadata = {
  title: "Learn — Notes | Ravikisan's Platform",
  description: "Browse Class 11, Class 11e and Class 12 notes organized by subject.",
};

export default function LearnPage() {
  return (
    <>
      <BackButton href="/" label="Back to Home" />
      <section className="hero hero-premium">
        <span className="hero-badge">Notes</span>
        <h1>Select a subject</h1>
        <p>Pick an exam group to browse its subjects and notes.</p>
      </section>
      <section className="content-section">
        <SimpleHierarchy />
      </section>
    </>
  );
}
