import { FaWhatsapp } from "react-icons/fa";
import { whatsappLink } from "@/data/site";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with StartupHealer on WhatsApp"
      className="fixed bottom-24 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110 sm:bottom-24 sm:right-6"
    >
      <FaWhatsapp size={26} />
    </a>
  );
}
