import React, { useState } from 'react';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';

interface AuthFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  icon: LucideIcon;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  hint?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export const AuthField: React.FC<AuthFieldProps> = ({
  id, label, type = 'text', icon: Icon, value, placeholder, autoComplete, error, hint, onChange, onBlur,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && isPasswordVisible ? 'text' : type;

  return (
    <div>
      <label htmlFor={id} className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative mt-1">
        <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id={id}
          type={inputType}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full text-sm pl-10 ${isPassword ? 'pr-11' : 'pr-4'} py-2.5 rounded-xl border bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
            error ? 'border-red-300' : 'border-slate-200'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-[11px] text-red-500 mt-1">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[11px] text-slate-400 mt-1">{hint}</p>
      ) : null}
    </div>
  );
};
