import Link from "next/link";
import { FaInfoCircle, FaUserPlus } from "react-icons/fa";
import styles from "@/styles/FooterCTA.module.css";
import { Button } from "@/components/ui/Button";

function FooterCTA() {
  return (
    <>
      <section className="section">
        <div className="container">
          <div className={`${styles.ctaBanner} cta-banner`}>
            <div className="container">
              <h2>ODOP Portal Registration</h2>
              <p>Join thousands of suppliers, manufacturers and artisans already growing their business through the ODOP Portal.</p>
              <div className={styles.ctaActions}>
                <Link href="/supplier-registration" className="inline-block">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                    <FaUserPlus /> Register as Supplier
                  </Button>
                </Link>
                <Link href="/about" className="inline-block">
                  <Button variant="primary" size="lg" className="bg-gold border-none text-white hover:opacity-90">
                    <FaInfoCircle /> Learn About ODOP
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default FooterCTA;
