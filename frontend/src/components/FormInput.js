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
