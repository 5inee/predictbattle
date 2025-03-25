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