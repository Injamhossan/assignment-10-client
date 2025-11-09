import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Outlet } from 'react-router';

const Root = () => {
    return (
       <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
           <Navbar/>
           <Outlet/>
       </div>
    );
};

export default Root;