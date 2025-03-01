import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  const redirectPath = isAuthenticated ? '/' : '/login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <p className="mt-4 text-2xl font-medium text-gray-900">Page not found</p>
        <p className="mt-2 text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
        <Link
          to={redirectPath}
          className="mt-6 inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          {isAuthenticated ? 'Back to Dashboard' : 'Back to Login'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;