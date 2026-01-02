import React from "react";
import FooterLogo from "../../assets/StudyMate.png";
import { FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-base-200 text-base-content border-t border-base-300">
      <footer className="footer sm:footer-horizontal p-10 container mx-auto px-4 lg:px-8">
        <aside className="max-w-xs">
          <div className="flex items-center gap-2 mb-4">
             {/* Use text if logo image is not suitable for dark/light variations without background handling */}
             <span className="">
              <img src={FooterLogo} alt="" className="h-[50px]"/>
             </span>
          </div>
          <p className="opacity-80 leading-relaxed">
            Connecting students worldwide. Find your perfect study partner and achieve your academic goals together.
          </p>
        </aside>
        
        <nav>
          <h6 className="footer-title opacity-100 text-primary uppercase tracking-wider">Quick Links</h6>
          <Link to="/" className="link link-hover opacity-80 hover:opacity-100 hover:text-primary transition-colors">Home</Link>
          <Link to="/findpartners" className="link link-hover opacity-80 hover:opacity-100 hover:text-primary transition-colors">Find Partners</Link>
          <Link to="/about" className="link link-hover opacity-80 hover:opacity-100 hover:text-primary transition-colors">About Us</Link>
          <Link to="/contact" className="link link-hover opacity-80 hover:opacity-100 hover:text-primary transition-colors">Contact Support</Link>
        </nav>
        
        <nav>
          <h6 className="footer-title opacity-100 text-primary uppercase tracking-wider">Legal</h6>
          <Link to="/privacy" className="link link-hover opacity-80 hover:opacity-100 hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="link link-hover opacity-80 hover:opacity-100 hover:text-primary transition-colors">Terms of Use</Link>
          <Link to="/cookies" className="link link-hover opacity-80 hover:opacity-100 hover:text-primary transition-colors">Cookie Policy</Link>
        </nav>
        
        <nav>
          <h6 className="footer-title opacity-100 text-primary uppercase tracking-wider">Connect</h6>
          <div className="grid grid-flow-col gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-base-300 rounded-full hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
              <FaXTwitter size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-base-300 rounded-full hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1">
              <FaYoutube size={20} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-base-300 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
              <FaFacebook size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-base-300 rounded-full hover:bg-blue-700 hover:text-white transition-all transform hover:-translate-y-1">
              <FaLinkedin size={20} />
            </a>
          </div>
        </nav>
      </footer>

      <div className="bg-base-300/50 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm opacity-70">
           <p>© {new Date().getFullYear()} StudyMate. All rights reserved.</p>
           <p>Designed with <span className="text-red-500">Injam</span> for Students.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;

