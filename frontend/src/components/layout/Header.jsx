import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Status Pages
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              Home
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header; 