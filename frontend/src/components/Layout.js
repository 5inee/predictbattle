// frontend/src/components/Layout.js
import Head from 'next/head';
import Header from './Header';

const Layout = ({ children, title = 'PredictBattle - منصة توقعات تفاعلية' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="منصة توقعات تفاعلية للمجموعات" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="app-container">
        <Header />
        <main>{children}</main>
      </div>
    </>
  );
};

export default Tabs;

// frontend/src/components/Loading.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loading = ({ text = 'جاري التحميل...' }) => {
  return (
    <div className="flex justify-center items-center py-10 flex-col">
      <FontAwesomeIcon icon={faSpinner} className="text-3xl text-primary animate-spin mb-3" />
      <p className="text-dark-medium">{text}</p>
    </div>
  );
};

export default Loading;

// frontend/src/components/Toast.js
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

// frontend/src/components/Header.js
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <header className="main-header">
      <Link href="/" className="logo-container">
        <div className="logo-text">PredictBattle</div>
        <div className="logo-icon">
          <FontAwesomeIcon icon={faBolt} />
        </div>
      </Link>
    </header>
  );
};

export default Header;

// frontend/src/components/Card.js
const Card = ({ children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardBody };

// frontend/src/components/Button.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '',
  icon = null,
  size = 'default',
  disabled = false
}) => {
  const sizeClass = size === 'large' ? 'btn-large' : size === 'small' ? 'btn-sm' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${sizeClass} ${className}`}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  );
};

export default Button;

// frontend/src/components/FormInput.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormInput = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon = null,
  required = false,
  error = '',
  className = ''
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id}>{label}</label>
      )}
      <div className="input-wrapper">
        {icon && (
          <FontAwesomeIcon icon={icon} className="input-icon" />
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
      {error && (
        <div className="error-message" style={{ display: 'flex' }}>
          <FontAwesomeIcon icon="exclamation-circle" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormInput;

// frontend/src/components/FormTextarea.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormTextarea = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  icon = null,
  required = false,
  error = '',
  className = ''
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id}>{label}</label>
      )}
      <div className="input-wrapper textarea-wrapper">
        {icon && (
          <FontAwesomeIcon icon={icon} className="input-icon" />
        )}
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
      {error && (
        <div className="error-message" style={{ display: 'flex' }}>
          <FontAwesomeIcon icon="exclamation-circle" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormTextarea;

// frontend/src/components/Tabs.js
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Tabs = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  return (
    <>
      <div className="tabs-container">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon && <FontAwesomeIcon icon={tab.icon} />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="tab-contents">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-content ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </>
  );
};

export default