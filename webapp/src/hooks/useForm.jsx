import { useState, useCallback } from 'react';

const useForm = (initialState = {}, validators = {}) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }

    // Validate field if validator exists
    if (validators[name]) {
      const error = validators[name](value, values);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  }, [errors, validators, touched, values]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }

    // Validate on blur
    if (validators[name]) {
      const error = validators[name](values[name], values);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  }, [validators, touched, values]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validators).forEach(key => {
      const error = validators[key](values[key], values);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validators, values]);

  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      // Handle API validation errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        // Handle single error message
        setErrors({ submit: error.response.data.message });
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, values]);

  const resetForm = useCallback((newInitialState = initialState) => {
    setValues(newInitialState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialState]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (validators[name]) {
      const error = validators[name](value, values);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  }, [validators, values]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    validateForm
  };
};

export default useForm;