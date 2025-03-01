// Login.jsx component
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Input from '../components/form/Input';
import useForm from '../hooks/useForm';
import api from '../api/axios';

const validators = {
  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Invalid email format' : '';
  },
  password: (value) => {
    if (!value) return 'Password is required';
    return '';
  }
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotification();

  const { 
    values, 
    errors, 
    touched,
    isSubmitting, 
    handleChange,
    handleBlur,
    handleSubmit 
  } = useForm(
    {
      email: '',
      password: '',
    },
    validators
  );

  const onSubmit = async (formData) => {
    try {      
      const response = await api.post('/login', formData);
      login(response.data.token);
      addNotification('Successfully logged in', 'success');
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      addNotification(errorMessage, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}>
          <Input
            data-test-id="email-input"
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
            error-id="email-error"
          />

          <Input
            data-test-id="password-input"
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
            error-id="password-error"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                data-test-id="remember-me"
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link 
                data-test-id="forgot-password-link"
                to="/forgot-password" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              data-test-id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center mt-4">
            <Link
              data-test-id="register-link"
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;