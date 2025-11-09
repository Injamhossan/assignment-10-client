import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer/Footer';

const Root = () => {
    return (
       <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
           <Navbar/>
           <Outlet/>
           <Footer/>
       </div>
    );
};

export default Root;