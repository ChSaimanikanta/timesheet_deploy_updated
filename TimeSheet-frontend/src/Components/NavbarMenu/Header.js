import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutEmployee } from "../features/employeeLogin";
import { logoutAdmin } from "../features/adminLogin";
import { logoutSupervisor } from "../features/supervisorLogin";
import { logoutSuperadmin } from "../features/superadminLogin";
import { useNavigate } from "react-router-dom";
import chiselonLogo from "../Image/logochiselon.png";
import "./Header.css";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const employeeValue = useSelector((state) => state.employeeLogin.value);
  const employeeValue = useSelector((state) => state.employeeLogin.value) || JSON.parse(localStorage.getItem("employeeLogin"));
  const employeeId = employeeValue?.employeeId;

  
  const adminValue = useSelector((state) => state.adminLogin.value) || JSON.parse(localStorage.getItem("adminLogin"));
  const adminId = adminValue?.adminId;

  
  const supervisorValue = useSelector((state) => state.supervisorLogin.value) || JSON.parse(localStorage.getItem("supervisorLogin"));
  const supervisorId = supervisorValue?.supervisorId;

  const superadminValue = useSelector((state) => state.superadminLogin.value) || JSON.parse(localStorage.getItem("superadminLogin"));
  const superadminId = superadminValue?.superadminId;

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedDateTime = currentDateTime.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  // Logout handler based on role
  const handleLogout = () => {
    if (employeeId) {
      dispatch(logoutEmployee());
      localStorage.removeItem("isLoggedIn");

    } else if (adminId) {
      dispatch(logoutAdmin());
    } else if (supervisorId) {
      dispatch(logoutSupervisor());
    } else if (superadminId) {
      dispatch(logoutSuperadmin());
      localStorage.removeItem("isLoggedIn");

    }
    navigate("/"); // Redirect to login page after logout
    setIsDropdownOpen(false); // Close the dropdown
    setShowDialog(false); // Close the dialog
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="ti-navbar-bg">
      <div className="ti-navbar-header d-flex flex-column flex-md-row justify-content-between align-items-center text-white">
        <div className="first-half d-flex justify-content-between align-items-center mb-3 mb-md-0">
          <div>
            <img
              src={chiselonLogo}
              width="45"
              height="45"
              alt="chiselon logo"
            />
          </div>
          <div className="h2  ms-3 ti-timesheet-text">Timesheet</div>
        </div>
        <div className="second-half d-flex justify-content-end align-items-center">
          <div className="ti-time text-warning me-3">{formattedDateTime}</div>
          <div className="ti-sign-in d-flex align-items-center position-relative dropdown-container me-3">
  {(employeeId || adminId || supervisorId || superadminId) && (
    <div
      className="nav-item"
      onClick={toggleDropdown}
      style={{ cursor: "default" }}
    >
      <strong>{employeeId || adminId || supervisorId || superadminId}</strong>
    </div>
  )}
</div>
<div className="ti-sign-in d-flex align-items-center position-relative dropdown-container">
  <div
    className="nav-item"
    onClick={() => setShowDialog(true)}
    style={{ cursor: "pointer" }}
  >
    <strong>Logout</strong>
  </div>
</div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>Are you sure you want to log out?</p>
            <div className="dialog-actions">
              <button onClick={handleLogout} className="btn btn-primary">OK</button>
              <button onClick={() => setShowDialog(false)} className="btn btn-danger">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
