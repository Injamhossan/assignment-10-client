import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle, FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 overflow-hidden relative selection:bg-primary/20">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="text-center relative z-10 max-w-lg mx-auto">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.5, type: 'spring' }}
           className="relative inline-block mb-8"
        >
          {/* Glitchy Text Effect Base */}
          <h1 className="text-9xl md:text-[10rem] font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent drop-shadow-2xl opacity-20 absolute top-0 left-0 w-full h-full transform translate-x-1 translate-y-1 blur-sm">
            404
          </h1>
           <h1 className="text-9xl md:text-[10rem] font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent drop-shadow-2xl relative z-10 selection:bg-transparent">
            404
          </h1>
          
          <motion.div 
            initial={{ rotate: -10, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 10, scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute -top-4 -right-8 md:-right-12 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-xl border border-base-200 rotate-12"
          >
             <FileQuestion className="w-8 h-8 md:w-12 md:h-12 text-secondary" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4 font-display">
            Page Not Found
          </h2>
          <p className="text-lg text-base-content/60 mb-10 max-w-sm mx-auto leading-relaxed">
            Oops! It seems like you've ventured into uncharted territory. The page you are looking for might have been moved or doesn't exist.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/30 flex items-center gap-2 group"
            >
              <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              Go Home
            </Link>
            <button
               onClick={() => window.history.back()}
               className="px-8 py-3.5 bg-base-100 border border-base-300 text-base-content font-bold rounded-xl hover:bg-base-200 hover:border-base-400 transition-all shadow-sm flex items-center gap-2 group"
            >
              <AlertTriangle className="w-5 h-5 text-base-content/60 group-hover:text-amber-500 transition-colors" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;

