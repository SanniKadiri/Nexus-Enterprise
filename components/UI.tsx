
import React, { ButtonHTMLAttributes, InputHTMLAttributes, HTMLAttributes, TextareaHTMLAttributes, useState, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

// --- Button ---
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  withIcon?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  withIcon = false,
  ...props 
}) => {
  const baseStyles = "font-bold uppercase tracking-wide transition-all duration-150 flex items-center justify-center border-2 relative disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-black text-white border-brand-black hover:bg-brand-yellow hover:text-black hover:border-black hard-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none",
    outline: "bg-white text-brand-black border-brand-black hover:bg-black hover:text-white hard-shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    ghost: "bg-transparent text-brand-black border-transparent hover:bg-gray-100",
    accent: "bg-brand-yellow text-brand-black border-black hard-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000]",
    danger: "bg-red-500 text-white border-black hover:bg-red-600 hard-shadow-sm"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-10 py-5 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

// --- Card ---
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  hoverEffect?: boolean;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  title,
  hoverEffect = false,
  action,
  ...props
}) => {
  return (
    <div 
      className={`bg-white border-2 border-black p-6 ${hoverEffect ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : ''} ${className}`}
      {...props}
    >
      {(title || action) && (
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-2">
          {title && <h3 className="text-xl font-black uppercase tracking-tight">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
};

// --- Input ---
interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<CustomInputProps> = ({ className = '', label, error, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold uppercase mb-1 tracking-wider">{label}</label>}
      <input 
        className={`w-full bg-gray-50 border-2 border-gray-200 py-3 px-4 font-medium text-brand-black focus:outline-none focus:border-black focus:bg-white focus:shadow-[4px_4px_0px_0px_#000] transition-all placeholder:text-gray-400 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-bold mt-1 block">{error}</span>}
    </div>
  );
};

// --- Textarea ---
interface CustomTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<CustomTextareaProps> = ({ className = '', label, error, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold uppercase mb-1 tracking-wider">{label}</label>}
      <textarea 
        className={`w-full bg-gray-50 border-2 border-gray-200 py-3 px-4 font-medium text-brand-black focus:outline-none focus:border-black focus:bg-white focus:shadow-[4px_4px_0px_0px_#000] transition-all placeholder:text-gray-400 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-bold mt-1 block">{error}</span>}
    </div>
  );
};

// --- Switch ---
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center cursor-pointer group" onClick={() => onChange(!checked)}>
      <div className={`w-12 h-6 border-2 border-black relative transition-colors mr-3 ${checked ? 'bg-brand-yellow' : 'bg-gray-200'}`}>
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 border-2 border-black bg-white transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </div>
      {label && <span className="font-bold text-sm uppercase select-none group-hover:underline">{label}</span>}
    </div>
  );
};

// --- Tabs ---
interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex border-b-2 border-black mb-6 bg-white">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wide border-r-2 border-black transition-all hover:bg-brand-yellow/20 ${
            activeTab === tab.id 
              ? 'bg-black text-white' 
              : 'bg-transparent text-gray-500 hover:text-black'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'neutral' | 'success' | 'warning' | 'error' }> = ({ children, variant = 'neutral' }) => {
  const styles = {
    neutral: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 border text-xs font-bold uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md border-2 border-black shadow-[10px_10px_0px_0px_#000] animate-[reveal_0.3s_ease-out_forwards]">
        <div className="flex justify-between items-center p-4 border-b-2 border-black bg-brand-yellow">
          <h3 className="font-black text-lg uppercase">{title}</h3>
          <button onClick={onClose} className="hover:bg-black hover:text-white p-1 border-2 border-transparent hover:border-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-t-2 border-black bg-gray-50 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- SlideOver ---
interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const SlideOver: React.FC<SlideOverProps> = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-white border-l-2 border-black shadow-[-10px_0px_0px_0px_rgba(0,0,0,0.1)] animate-[slideInRight_0.3s_ease-out_forwards] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b-2 border-black bg-white">
          <h3 className="font-black text-2xl uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="hover:bg-red-500 hover:text-white p-2 border-2 border-transparent hover:border-black transition-all">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50">
          {children}
        </div>
        {actions && (
          <div className="p-6 border-t-2 border-black bg-white">
            {actions}
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold uppercase mb-1 tracking-wider">{label}</label>}
      <div className="relative">
        <select 
          className={`w-full appearance-none bg-gray-50 border-2 border-gray-200 py-3 px-4 pr-10 font-medium text-brand-black focus:outline-none focus:border-black focus:bg-white focus:shadow-[4px_4px_0px_0px_#000] transition-all ${className}`}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};
