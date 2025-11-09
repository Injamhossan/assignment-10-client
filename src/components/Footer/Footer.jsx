import React from "react";
import FooterLogo from "../../assets/StudyMate.png"

const Footer = () => {

  return (
    <div className="mx-auto max-w-[1600px]">
      <footer className="footer sm:footer-horizontal text-base-content p-10">
        <aside>
          <img src={FooterLogo} alt="" className="h-[60px] w-auto mx-[-25px]" />
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
      </footer>
    </div>
  );
};

export default Footer;
