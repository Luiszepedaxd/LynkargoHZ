import { forwardRef, InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import { FieldError } from 'react-hook-form'

interface BaseFieldProps {
  label: string
  error?: FieldError
  required?: boolean
}

interface InputFieldProps extends BaseFieldProps, InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'number'
}

interface SelectFieldProps extends BaseFieldProps, SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  placeholder?: string
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          ref={ref}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    )
  }
)

InputField.displayName = 'InputField'

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, required, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          ref={ref}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'