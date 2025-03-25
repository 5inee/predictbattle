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