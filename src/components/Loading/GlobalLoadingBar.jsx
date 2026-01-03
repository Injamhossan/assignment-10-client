import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalLoading } from '../../utils/loadingManager';
import { useNavigation } from 'react-router-dom';

const GlobalLoadingBar = () => {
  const isApiLoading = useGlobalLoading();
  const navigation = useNavigation();
  
  // Also show if React Router is navigating (if strict loaders are used, though we mostly use useEffect fetching)
  const isRouterLoading = navigation?.state === 'loading';
  
  const isLoading = isApiLoading || isRouterLoading;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-1 bg-base-100 shadow-[0_0_15px_rgba(99,102,241,0.5)] dark:shadow-[0_0_15px_rgba(99,102,241,0.7)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
            initial={{ width: "0%", x: "-100%" }}
            animate={{ 
              width: "50%", 
              x: "100%",
              transition: { 
                 repeat: Infinity, 
                 duration: 1, 
                 ease: "easeInOut",
                 repeatType: "loop"
              }
            }}
             style={{ width: '100%', position: 'absolute' }}
          />
          {/* A second bar for a more complex "indeterminate" look */}
          <motion.div
            className="h-full bg-gradient-to-r from-accent via-primary to-secondary"
            initial={{ width: "0%", x: "-100%" }}
            animate={{ 
              width: "70%", 
              x: "100%", 
              transition: { 
                 repeat: Infinity, 
                 duration: 1.5, 
                 ease: "linear",
                 delay: 0.5
              }
            }}
            style={{ width: '100%', position: 'absolute' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoadingBar;
