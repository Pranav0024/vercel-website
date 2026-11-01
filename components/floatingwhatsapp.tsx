import { MessageCircle } from "lucide-react";
export default function FloatingWhatsApp() {
  return (
    <a
      className="floating-contact glass-panel"
      href="https://wa.me/918968310500?text=Hello%20Paniar%2C%20I%27d%20like%20to%20discuss%20a%20requirement."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuss your requirement on WhatsApp"
    >
      <MessageCircle size={22} />
      <span>Let’s connect</span>
      <span className="status-dot" />
    </a>
  );
}
