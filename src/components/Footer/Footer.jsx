import React from "react";
import FooterLogo from "../../assets/StudyMate.png";
import { FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="mx-auto max-w-[1600px]">

      <footer className="footer sm:footer-horizontal text-base-content p-10">
        <aside>
          <img
            src={FooterLogo}
            alt="Study Mate Logo"
            className="h-[60px] w-auto mx-[-25px]"
          />
          <p>
            Study Mate
            <br />
            Find Your Perfect Study Partner
          </p>
        </aside>
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
        <nav>
          <h3 className="footer-title">Social Link</h3>
          <div className="flex gap-4 md:place-self-center md:justify-self-end">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              <FaXTwitter size={24} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              <FaYoutube size={24} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </nav>
      </footer>

      <footer className="footer items-center justify-between border-t border-base-300 p-4 px-10 text-base-content">
        <aside className="items-center">
          <p>© {new Date().getFullYear()} Study Mate - All rights reserved.</p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
