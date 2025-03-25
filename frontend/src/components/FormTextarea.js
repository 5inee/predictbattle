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
