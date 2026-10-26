import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthField } from '../components/auth/AuthField';
import { FormAlert } from '../components/auth/FormAlert';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';

interface LoginValues {
  email: string;
  password: string;
  [key: string]: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (values: LoginValues) => {
  const errors: Partial<Record<keyof LoginValues, string>> = {};
  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email';
  if (!values.password) errors.password = 'Password is required';
  return errors;
};

export const LoginPage: React.FC = () => {
  const { login, notice } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm<LoginValues>(
    { email: '', password: '' },
    validate
  );

  const onSubmit = async (form: LoginValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Login failed');
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Sign in"
      title="Welcome back"
      subtitle="Log in to pre-order food and track your pickup token."
      footer={
        <>
          New to CampusEats?{' '}
          <Link to="/register" className="font-semibold text-orange-600 hover:text-orange-700">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError ? (
          <FormAlert tone="error" message={serverError} />
        ) : notice ? (
          <FormAlert tone="warning" message={notice} />
        ) : null}

        <AuthField
          id="login-email"
          label="College email"
          type="email"
          icon={Mail}
          value={values.email}
          placeholder="you@college.edu"
          autoComplete="email"
          error={touched.email ? errors.email : undefined}
          onChange={(value) => handleChange('email', value)}
          onBlur={() => handleBlur('email')}
        />

        <AuthField
          id="login-password"
          label="Password"
          type="password"
          icon={Lock}
          value={values.password}
          placeholder="Enter your password"
          autoComplete="current-password"
          error={touched.password ? errors.password : undefined}
          onChange={(value) => handleChange('password', value)}
          onBlur={() => handleBlur('password')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold shadow-sm shadow-orange-500/25 transition-all active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
            </>
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};
