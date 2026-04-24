import { useCallback, useState } from "react";
import { Form, Link, useNavigation } from "react-router-dom";
import type { LoginParams } from "../../models/UserModel";
import PasswordInputWrapper from "./PasswordInputWrapper";



export default function LoginForm() {
  const [formData, setFormData] = useState<LoginParams>({ username: '', password: '' });
  const navigation = useNavigation();
  const [isEmail, setIsEmail] = useState(false);
  const status = navigation.state;


  const handleOnBlur = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget as HTMLInputElement;
    setFormData(prev => ({ ...prev, [name]: value.trimEnd() }));
  }, []);

  const onFocus = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    if (!isEmail) {
      e.currentTarget.focus()
    }
    const inputLength = value.length
    e.currentTarget.setSelectionRange(inputLength, inputLength);

  }, [isEmail])

  const handleOnInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget as HTMLInputElement;
    if (name === 'username') {
      const lowerValue = value.toLocaleLowerCase();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      setIsEmail(emailRegex.test(lowerValue));
      
      setFormData(prev => ({ ...prev, [name]: lowerValue }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleOnKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  }, []);


  return (

    <Form className="auth-form" method="post" replace={true}>
      <div className="input-wrapper">

        <label className="label-block label-grey label-f14 label-required" htmlFor="username">Enter username or email</label>

        <input
          id={'username'}
          type={"text"}
          className="input-txt"
          name="username"
          inputMode="email"
          placeholder="username or email"
          onFocus={onFocus}
          onBlur={handleOnBlur}
          onInput={handleOnInput}
          onKeyDown={handleOnKeyDown}
          pattern={!isEmail ? "[A-Za-z0-9_\\-]{5,20}" : undefined}
          title={isEmail ? "Please enter a valid email address (e.g., user@example.com)" : "5-20 characters. Letters, numbers, underscores, and hyphens only. No spaces allowed."}
          autoComplete={isEmail ? 'email webauthn' : 'username webauthn'}
          value={formData.username}
          required />
      </div>

      <div className="input-wrapper">
        <label
          className="label-block label-grey label-f14 label-required"
          htmlFor={"password"}>Password</label>

        <PasswordInputWrapper
          id="password"
          name="password"
          onBlur={handleOnBlur}
          passwordData={formData.password}
          placeholder="Enter a valid password"
          autoComplete='current-password webauthn'
          onInput={handleOnInput} />
      </div>

      <div className={'btn-wrapper'}>
        <Link className="forgot-link" to={'#'}>forgot password?</Link>
        <button
          type='submit'
          className='submit--btn'
          disabled={status === 'submitting'}>{status === 'submitting' ? "Logging in..." : "Login"}</button>
      </div>
    </Form>

  )
}