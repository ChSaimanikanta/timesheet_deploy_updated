import React, { useState } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom"; // Import NavLink and useNavigate
import "./HamburgerMenu.css"; // Include a CSS file for custom styling
import logo from "../Image/logochiselon.png"; // Ensure you import your logo image

const HamburgerMenu = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleMenu = () => {
    setExpanded((prev) => !prev);
  };

  const handleLoginClick = () => {
    navigate("/TimesheetLogin"); // Navigate to the TimesheetLogin page
  };

  return (
    <>
      <Navbar
        expanded={expanded}
        expand="lg"
        className="hamburgermenu-custom-navbar"
      >
        <div className="d-flex align-items-center justify-content-between w-100">
          {/* Logo and Name */}
          <div className="hamburgermenu-logo-container w-100  d-flex justify-content-center align-items-center">
            <img src={logo} alt="CGT Logo" className="hamburgermenu-logo" />
            <span className="hamburgermenu-logo-text ">Chiselon Technologies Pvt Ltd</span>
          </div>
          
        </div>
       
      </Navbar>
    </>
  );
};

export default HamburgerMenu;
