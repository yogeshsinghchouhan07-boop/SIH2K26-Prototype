import { Link } from "react-router-dom";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";

export default function Footer() {
  return (
    <BackgroundGradientAnimation>
      <div className="footer-overlay">
      <footer className="footer">
        <div className="footer-card">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src="/assets/logo-white.svg" alt="StatSkill AI" />
              <p>AI-powered competency learning for a future-ready workforce.</p>
            </div>

            <div className="footer-links">
              <h4>Platform</h4>
              <Link to="/">Home</Link>
              <Link to="/features">Features</Link>
              <Link to="/igot">iGOT</Link>
              <Link to="/resources">Resources</Link>
            </div>

            <div className="footer-links">
              <h4>Support</h4>
              <a href="#help">Help</a>
              <a href="#contact">Contact</a>
              <a href="#faq">FAQ</a>
            </div>

            <div className="footer-links">
              <h4>Legal</h4>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
            </div>

            <div className="socials" aria-label="Social media">
              <a href="#linkedin" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a href="#twitter" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#instagram" aria-label="Instagram"><Instagram size={18} /></a>
            </div>
          </div>

          
        </div>
        <p className="bg-clip-text text-transparent text-6xl mx-auto mt-8 font-bold drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          The Code Sapians X Karmayogi
        </p>
      </footer>
      </div>
    </BackgroundGradientAnimation>
  );
}
