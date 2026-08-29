import SiteHeader from "@/components/SiteHeader";
import Sidebar from "@/components/Sidebar";
import AiChatWidget from "@/components/AiChatWidget";

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})();`;

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
