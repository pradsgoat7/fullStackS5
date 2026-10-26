import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthField } from '../components/auth/AuthField';
import { FormAlert } from '../components/auth/FormAlert';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { ApiError } from '../lib/api';

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  [key: string]: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors the backend's express-validator rules so most mistakes are caught before submitting
const validate = (values: RegisterValues) => {
  const errors: Partial<Record<keyof RegisterValues, string>> = {};

  if (!values.name.trim()) errors.name = 'Name is required';
  else if (values.name.trim().length > 50) errors.name = 'Name must be at most 50 characters';

  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email';

  if (values.password.length < 8 || values.password.length > 72) errors.password = 'Password must be 8 to 72 characters';
  else if (!/[A-Za-z]/.test(values.password)) errors.password = 'Password must contain a letter';
  else if (!/\d/.test(values.password)) errors.password = 'Password must contain a number';

  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match';

  return errors;
};

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm<RegisterValues>(
    { name: '', email: '', password: '', confirmPassword: '' },
    validate
  );

  const fieldError = (field: keyof RegisterValues) =>
    (touched[field] ? errors[field] : undefined) ?? serverFieldErrors[field as string];

  const onSubmit = async (form: RegisterValues) => {
    setServerError(null);
    setServerFieldErrors({});
    setIsSubmitting(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors.length > 0) {
        setServerFieldErrors(Object.fromEntries(error.fieldErrors.map(({ field, message }) => [field, message])));
      }
      setServerError(error instanceof Error ? error.message : 'Registration failed');
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Registration"
      title="Create your account"
      subtitle="Join CampusEats to pre-order food and skip the canteen queue."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && <FormAlert tone="error" message={serverError} />}

        <AuthField
          id="register-name"
          label="Full name"
          icon={User}
          value={values.name}
          placeholder="e.g. Pradnyesh Patil"
          autoComplete="name"
          error={fieldError('name')}
          onChange={(value) => handleChange('name', value)}
          onBlur={() => handleBlur('name')}
        />

        <AuthField
          id="register-email"
          label="College email"
          type="email"
          icon={Mail}
          value={values.email}
          placeholder="you@college.edu"
          autoComplete="email"
          error={fieldError('email')}
          onChange={(value) => handleChange('email', value)}
          onBlur={() => handleBlur('email')}
        />

        <AuthField
          id="register-password"
          label="Password"
          type="password"
          icon={Lock}
          value={values.password}
          placeholder="Create a password"
          autoComplete="new-password"
          hint="At least 8 characters, with a letter and a number"
          error={fieldError('password')}
          onChange={(value) => handleChange('password', value)}
          onBlur={() => handleBlur('password')}
        />

        <AuthField
          id="register-confirm"
          label="Confirm password"
          type="password"
          icon={ShieldCheck}
          value={values.confirmPassword}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={fieldError('confirmPassword')}
          onChange={(value) => handleChange('confirmPassword', value)}
          onBlur={() => handleBlur('confirmPassword')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold shadow-sm shadow-orange-500/25 transition-all active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
            </>
          ) : (
            <>
              Create Account <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};
