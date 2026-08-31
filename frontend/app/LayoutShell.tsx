import SiteHeader from "@/components/SiteHeader";
import Sidebar from "@/components/Sidebar";
import AiChatWidget from "@/components/AiChatWidget";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <Sidebar />
      <main className="page-main">{children}</main>
      <AiChatWidget />
    </>
  );
}
