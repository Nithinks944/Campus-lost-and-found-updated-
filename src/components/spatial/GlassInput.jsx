import React, { useState } from 'react';

export const GlassInput = ({
  icon: Icon,
  label,
  error,
  className = '',
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  style = {},
  inputStyle = {},
  autoComplete,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Compute smart autocomplete attribute
  const computedAutoComplete =
    autoComplete ||
    (type === 'password'
      ? 'current-password'
      : type === 'email'
      ? 'email'
      : 'off');

  return (
    <div className={`vision-glass-input-wrapper ${className}`} style={{ marginBottom: '1.4rem', ...style }}>
      {label && (
        <label
          htmlFor={id}
          className="spatial-input-label"
        >
          {Icon && <Icon size={15} className="spatial-label-icon" />}
          <span>{label}</span>
          {required && <span className="spatial-required-star">*</span>}
        </label>
      )}

      <div
        className={`spatial-glass-input-container ${isFocused ? 'input-focused' : ''} ${error ? 'input-error' : ''}`}
      >
        {Icon && (
          <div className="spatial-input-prefix-icon">
            <Icon size={18} />
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="spatial-glass-native-input"
          autoComplete={computedAutoComplete}
          style={{
            background: 'transparent',
            backgroundColor: 'transparent',
            color: 'inherit',
            border: 'none',
            outline: 'none',
            width: '100%',
            ...inputStyle,
          }}
          {...props}
        />
      </div>

      {error && (
        <p className="spatial-input-error-text">
          {error}
        </p>
      )}
    </div>
  );
};

export default GlassInput;
