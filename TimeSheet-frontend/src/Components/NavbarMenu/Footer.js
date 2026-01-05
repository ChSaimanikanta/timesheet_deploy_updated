import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="professional-footer">
      <div className="footer-container">
        <span>
          © {new Date().getFullYear()} Chiselon Technologies Pvt. Ltd.
        </span>
        <span className="footer-right">
         Delivering innovative digital solutions with excellence since 2015.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
