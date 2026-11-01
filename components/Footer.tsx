import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function Footer() {
  return (
    <footer className="site-footer page-shell">
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/" aria-label="Paniar home">
            <Image src="/logo v1.png" alt="Paniar" width={132} height={42} />
          </Link>
          <p>
            Materials for spaces.
            <br />
            Possibilities for business.
          </p>
        </div>
        <div>
          <span className="eyebrow">EXPLORE</span>
          <Link href="/#expertise">What we do</Link>
          <Link href="/shop">Our catalogue</Link>
          <Link href="/about">Our story</Link>
        </div>
        <div>
          <span className="eyebrow">LET’S CONNECT</span>
          <a href="mailto:paniar888@gmail.com">
            paniar888@gmail.com <ArrowUpRight size={15} />
          </a>
          <a href="tel:+918968310500">
            +91 89683 10500 <ArrowUpRight size={15} />
          </a>
          <Link href="/contact">
            Make an enquiry <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="footer-signoff">
          A world of materials.
          <br />
          <span className="blue-type">One point of contact.</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Paniar. All rights reserved.</span>
        <span>Textures · Building materials · Imports & exports</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
