import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import LeadMagnetPopup from "@/components/LeadMagnetPopup";
import Chatbot from "@/components/Chatbot";
import JsonLd from "@/components/JsonLd";
import { organizationJsonLd } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow">
        Skip to content
      </a>
      <JsonLd data={organizationJsonLd} />
      {/* Site-wide background (matches startuphealer.com): leaf artwork, cover/center, fixed while scrolling,
          with a soft white → cyan → emerald overlay. A fixed layer (not background-attachment: fixed)
          so it also stays put on iOS/Android, where bg-fixed is ignored or janky. */}
      <div className="site-bg" style={{ backgroundImage: "url(/images/leaf.png)" }} aria-hidden />
      <Navbar />
      <main id="main" className="pt-16">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
      <LeadMagnetPopup />
    </>
  );
}
