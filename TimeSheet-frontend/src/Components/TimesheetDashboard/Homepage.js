import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import "./HomePage.css"; // Include a CSS file for custom styling
import "bootstrap/dist/css/bootstrap.css";
import HamburgerMenu from "./HamburgerMenu";
import { Container, Row, Col } from "react-bootstrap";
import logo from "../Image/logochiselon1.png";
import { useNavigate } from "react-router-dom";

function HomePage() {
     const navigate = useNavigate();
     const handleLoginClick = () => {
      console.log("button Clicked");
       navigate("/TimesheetLogin"); // Navigate to the TimesheetLogin page
     };

  return (
    <div className="homepage-container d-flex flex-column align-items-center justify-content-center">
      <HamburgerMenu />
      <div className="container text-center my-auto bg-light shadow p-5 rounded">
        <Container>
          <Row>
            {/* First Column (Text) */}
            <Col
              sm={6}
              className="d-flex flex-column justify-content-center text-center"
            >
              <h1 className="homepage-heading">Please Login for Time-Sheet Management</h1>
             
              <Button className="homepage-login-button" variant="primary" onClick={handleLoginClick}>
                Login
              </Button>
            </Col>

            {/* Second Column (Image) */}
            <Col
              sm={6}
              className="d-flex justify-content-center align-items-center"
            >
              <img
                src={logo}
                alt="Example"
                style={{
                  width: "60%",        // Keeps width at 60% of the container
                  height: "auto",      // Adjusts height to maintain aspect ratio
                  objectFit: "contain", // Ensures the image maintains its aspect ratio and is not stretched
                  backgroundColor: "transparent", // Keeps the background transparent
                  maxHeight: "100%",    // Ensures the image height doesn't exceed the container's height
                  maxWidth: "100%",     // Ensures the image width doesn't exceed the container's width
                }}
               className="hamburgermenu-logo"
              />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default HomePage;
