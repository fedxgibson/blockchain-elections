import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import Input from '../components/form/Input';
import useForm from '../hooks/useForm';
import api from '../api/axios';

const validators = {
  name: (value) => {
    if (!value) return 'name is required';
    if (value.length < 3) return 'name must be at least 3 characters';
    return '';
  },
  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Invalid email format' : '';
  },
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  },
  confirmPassword: (value, formValues) => {
    if (!value) return 'Please confirm your password';
    if (value !== formValues.password) return 'Passwords do not match';
    return '';
  }
};

const Register = () => {
  const navigate = useNavigate();
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
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validators
  );

  const onSubmit = async (formData) => {
    try {
      await api.post('/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      
      addNotification('Successfully registered. Please sign in.', 'success');
      navigate('/login');
    } catch (error) {
      addNotification(
        error.response?.data?.message || 'Registration failed',
        'error'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            data-test-id="name-input"
            label="name"
            name="name"
            type="text"
            required
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && errors.name}
            error-id="name-error"
          />

          <Input
            data-test-id="email-input"
            label="Email"
            name="email"
            type="email"
            required
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
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
            error-id="password-error"
          />

          <Input
            data-test-id="confirm-password-input"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            required
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword && errors.confirmPassword}
            error-id="confirm-password-error"
          />

          <button
            data-test-id="register-submit"
            type="submit"
            disabled={isSubmitting}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>

          <div className="text-center mt-4">
            <Link
              data-test-id="login-link"
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;