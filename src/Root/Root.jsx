import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const Root = () => {
    const { theme } = useTheme();
    
    return (
       <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
           <Navbar/>
           <Outlet/>
           <Footer/>
           <ToastContainer 
               position="top-right"
               autoClose={3000}
               hideProgressBar={false}
               newestOnTop={false}
               closeOnClick
               rtl={false}
               pauseOnFocusLoss
               draggable
               pauseOnHover
               theme={theme === 'dark' ? 'dark' : 'light'}
           />
       </div>
    );
};

export default Root;