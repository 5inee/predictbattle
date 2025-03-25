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