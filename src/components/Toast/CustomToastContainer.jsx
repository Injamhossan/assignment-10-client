import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastSubscription } from '../../utils/toastManager';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-6 h-6 text-emerald-500" />,
  error: <AlertCircle className="w-6 h-6 text-rose-500" />,
  info: <Info className="w-6 h-6 text-blue-500" />,
  warning: <AlertTriangle className="w-6 h-6 text-amber-500" />
};

const styles = {
  success: 'border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-900/20 shadow-emerald-500/10',
  error: 'border-rose-500/20 bg-rose-50/90 dark:bg-rose-900/20 shadow-rose-500/10',
  info: 'border-blue-500/20 bg-blue-50/90 dark:bg-blue-900/20 shadow-blue-500/10',
  warning: 'border-amber-500/20 bg-amber-50/90 dark:bg-amber-900/20 shadow-amber-500/10'
};

const ToastItem = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000); // Auto close after 4s

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`relative w-80 md:w-96 p-4 mb-3 rounded-2xl border backdrop-blur-md shadow-xl flex items-start gap-4 pointer-events-auto cursor-pointer overflow-hidden ${styles[toast.type] || styles.info}`}
      onClick={() => onRemove(toast.id)}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {icons[toast.type] || icons.info}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="font-display font-bold text-gray-800 dark:text-gray-100 capitalize text-sm mb-0.5">
          {toast.type}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-tight">
          {toast.message}
        </p>
      </div>

      {/* Progress Bar (Visual flair) */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-1 ${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'} opacity-30`}
      />
    </motion.div>
  );
};

const CustomToastContainer = () => {
  const { toasts, removeToast } = useToastSubscription();

  return (
    <div className="fixed top-24 right-4 md:right-8 z-[1000] flex flex-col items-end pointer-events-none gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CustomToastContainer;
