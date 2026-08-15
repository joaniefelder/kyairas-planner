import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

const fieldBase =
  'w-full rounded-xl border border-blush-200 bg-white/70 px-3.5 py-2.5 text-sm text-blush-900 placeholder:text-blush-400 transition focus:border-blush-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blush-200';

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-blush-600">
      {children}
    </label>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export function TextField({ label, id, className = '', ...props }: TextFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input id={id} className={`${fieldBase} ${className}`} {...props} />
    </div>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  children: ReactNode;
}

export function SelectField({ label, id, className = '', children, ...props }: SelectFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} className={`${fieldBase} ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

export function TextAreaField({ label, id, className = '', ...props }: TextAreaFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <textarea id={id} className={`${fieldBase} resize-none ${className}`} {...props} />
    </div>
  );
}
