import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

function Layout({ children }) {
    return (
        <div className="layout-container">
            {/* Common Header */}
            <Header />
            <div >
                {children}
            </div>
            <Footer />
        </div>
    );
}

export default Layout;
