import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center z-50 transition-colors">
      <div className="flex flex-col items-center gap-6">
        {/* Icon Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
          <GraduationCap className="w-16 h-16 text-primary relative z-10" />
        </motion.div>

        {/* Text Animation */}
        <div className="overflow-hidden">
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-3xl font-display font-bold text-gray-800 dark:text-white tracking-wide"
          >
            StudyMate
          </motion.h3>
        </div>

        {/* Loading Bar Container */}
        <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative mt-2">
          {/* Moving Gradient Bar */}
          <motion.div
            className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
            animate={{
              x: ["-100%", "350%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
