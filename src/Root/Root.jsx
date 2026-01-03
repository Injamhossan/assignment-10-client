import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Outlet, useLocation } from 'react-router';
import Footer from '../components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';

import GlobalLoadingBar from '../components/Loading/GlobalLoadingBar';

import PageLoader from '../components/Spinner/PageLoader';
import { useAuth } from '../context/AuthContext';

const Root = () => {
    const { theme } = useTheme();
    const location = useLocation();
    const { loading } = useAuth();

    if (loading) {
        return <PageLoader />;
    }
    
    return (
       <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
           <GlobalLoadingBar />
           <Navbar/>
           <main className="flex-grow">
             <AnimatePresence mode="wait">
                <motion.div
                   key={location.pathname}
                   initial={{ opacity: 0, y: 15 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -15 }}
                   transition={{ duration: 0.3, ease: "easeOut" }}
                >
                   <Outlet/>
                </motion.div>
             </AnimatePresence>
           </main>
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