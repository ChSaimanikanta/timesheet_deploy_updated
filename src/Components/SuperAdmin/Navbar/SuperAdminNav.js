import React from 'react';
import Container from 'react-bootstrap/Container';
import { NavLink } from 'react-router-dom';
import './SuperAdminNav.css';
import Footer from '../../NavbarMenu/Footer';


function SuperAdminNav() {
    return (
        <div className="superadmin-navigation" >
            <Container style={{ fontWeight: "bold"}}>
                <div className="superadmin-nav-wrapper">
                    <ul className="nav nav-control" style={{marginTop:"-200px"}}>
                        <li className="nav-item" >
                            <NavLink to="/superadmin/createadmin" className="nav-link superadmin-navigation-link">
                                Create Admin User
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/superadmin/searchadmin" className="nav-link superadmin-navigation-link">
                                Search Admin User
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/superadmin/timesheetapproval" className="nav-link superadmin-navigation-link">
                                Approve Admin Timesheet
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/superadmin/leaveapproval" className="nav-link superadmin-navigation-link">
                                Approve Leave Request
                            </NavLink>
                        </li>
                    </ul>
                    
                </div>
            </Container>
            <Footer/>
        </div>
    );
}

export default SuperAdminNav;