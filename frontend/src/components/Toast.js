import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeClasses = {
    success: 'bg-gradient-to-r from-success to-green-600',
    error: 'bg-gradient-to-r from-error to-red-600',
    warning: 'bg-gradient-to-r from-warning to-yellow-600',
    info: 'bg-gradient-to-r from-info to-blue-600',
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 ${typeClasses[type]} text-white py-3 px-5 rounded-lg shadow-md z-50 min-w-[300px] text-center font-medium`}>
      {message}
    </div>
  );
};

export default Toast; Layout;
