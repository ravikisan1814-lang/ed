import SimpleHierarchy from "@/components/learn/SimpleHierarchy";
import AnnotatedModelViewer from "@/components/visuals/AnnotatedModelViewer";

export const metadata = {
  title: "Learn — Notes | Ravikisan's Platform",
  description: "Browse subjects and notes for this exam group.",
};

export default async function LearnGroupPage({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  const { group } = await params;

  return (
    <>
      <section className="hero hero-premium">
        <span className="hero-badge">Notes</span>
        <h1>{group.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</h1>
        <p>Pick a subject to view its chapters and notes.</p>
      </section>
      <section className="content-section">
        <SimpleHierarchy path={[group]} />
      </section>
      <section className="content-section">
        <h2>Interactive 3D Model</h2>
        <div style={{ height: 600 }}>
          <AnnotatedModelViewer />
        </div>
      </section>
    </>
  );
}
