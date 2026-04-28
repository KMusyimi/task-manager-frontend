import React, { memo, useCallback, useEffect, useRef, useState } from "react";

import { FaEye, FaEyeSlash } from 'react-icons/fa6'

interface inputProps {
  id?: string;
  name: string;
  placeholder?: string
  passwordData: string;
  disabled?: boolean;
  autoComplete?: React.HTMLInputAutoCompleteAttribute | undefined;
  onInput?: (e: React.InputEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

function PasswordInputWrapper({ passwordData, ...rest }: inputProps) {
  const [hidePassword, setHidePassword] = useState(true);
  const InputRef = useRef<HTMLInputElement>(null);


  const toggleTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const btnTimeoutId = toggleTimeoutRef.current;

    return () => {
      if (btnTimeoutId) {
        clearTimeout(btnTimeoutId);
      }
    }
  }, []);

  const handleOnFocus = useCallback(() => {
    if (InputRef.current) {
      const passwordInput = InputRef.current;
      passwordInput.focus();
    }
  }, []);


  const togglePasswordField = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (InputRef.current) {
      const passwordInput = InputRef.current;
      passwordInput.focus();
      passwordInput.setSelectionRange(passwordInput.value.length, passwordInput.value.length);
    }

    const toggleTimeoutId = toggleTimeoutRef.current;

    if (toggleTimeoutId) {
      clearTimeout(toggleTimeoutRef.current)
    }

    setHidePassword(prev => !prev);

    const timeoutId = setTimeout(() => {
      setHidePassword(true);
    }, 300)
    toggleTimeoutRef.current = timeoutId;

  }, []);

  const handleOnKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  }, []);


  return (

    <div className={'password-input--wrapper'}>
      <input
        ref={InputRef}
        type={hidePassword ? "password" : "text"}
        className="input-password input-txt"
        onFocus={handleOnFocus}
        onKeyDown={handleOnKeyDown}
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}"
        title="Password must be at least 8 characters long and include: 1 uppercase, 1 lowercase, 1 number, and 1 special character."
        minLength={8}
        value={passwordData}
        required
        {...rest} />
      <button type="button"
        className="pwd-toggle--btn"
        onClick={togglePasswordField}>
        <i className='icon'>
          {hidePassword ? <FaEye/> : <FaEyeSlash/>}
        </i>
        
      </button>
    </div>
  )
}

export default memo(PasswordInputWrapper);