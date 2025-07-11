import React, { useState } from 'react'
import { NavLink, } from 'react-router-dom';


const NavPages = () => {
    const [activeClass, setActiveclass] = useState()
    const handleClick = () => {
        setActiveclass("activeclass")
    }
    return (

        <div className='pb-3' >

            <div className='nav-links admin-menus pt-4'>
                <ul>
                    {/* <li>
                        <NavLink exact to="/admin/createemployee" activeClassName="active" className={activeClass} onClick={handleClick}>Create Employee</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/uploademployees" activeClassName="active" className={activeClass} onClick={handleClick}>Upload Employees</NavLink>
                    </li>                    
                    <li>
                        <NavLink to="/admin/searchemployee" activeClassName="active" className={activeClass} onClick={handleClick}>Search Employee</NavLink>
                    </li> */}
                </ul>
            </div>


        </div>

    )
}
export default NavPages;
