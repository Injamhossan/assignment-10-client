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
               toastClassName={() => 
                 "relative flex p-4 mb-4 rounded-xl shadow-xl justify-between overflow-hidden cursor-pointer border border-base-200 bg-base-100 text-base-content ml-4"
               }
               bodyClassName={() => "text-sm font-medium block p-3"}
           />
       </div>
    );
};

export default Root;