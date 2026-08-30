import CatalogSidebar from "@/components/CatalogSidebar";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Catalog — EduPlatform",
  description:
    "Browse the complete syllabus catalog. Navigate through exam groups, subjects, chapters, and topics.",
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <div className="catalog-layout">
        <CatalogSidebar />
        <main className="catalog-main">{children}</main>
      </div>
    </>
  );
}
