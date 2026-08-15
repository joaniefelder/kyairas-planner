import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useAppData } from '../../hooks/AppDataContext';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'text-white shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] hover:brightness-95 active:brightness-90',
  secondary: 'bg-blush-100 text-blush-800 hover:bg-blush-150 active:bg-blush-200 border border-blush-200',
  ghost: 'bg-transparent text-blush-700 hover:bg-blush-50 active:bg-blush-100',
  danger: 'bg-transparent text-blush-700 hover:bg-blush-800/10 hover:text-blush-900',
};

export function Button({ variant = 'primary', className = '', children, style, ...props }: ButtonProps) {
  const { data } = useAppData();
  const accentStyle = variant === 'primary' ? { backgroundColor: data.settings.accentShade, ...style } : style;
  return (
    <button
      style={accentStyle}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ease-out active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
