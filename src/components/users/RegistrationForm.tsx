import { useCallback, useState } from "react";
import { Form, useNavigation } from "react-router-dom";
import type { CreateUserParams } from "../../models/UserModel";
import PasswordInputWrapper from "./PasswordInputWrapper";




export default function RegistrationForm() {
  const navigation = useNavigation();
  const status = navigation.state;

  const [formData, setFormData] = useState<CreateUserParams>(() => ({ email: '', username: '', password: '' }));

  const handleOnBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [name]: value.trimEnd() }));
  }, []);

  const handleOnInput = useCallback((e: React.InputEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, [])

  const handleOnKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  }, []);

  return (
    <Form className="auth-form" replace={true} method="post">
      <div className="input-wrapper">
        <label
          className="label-block label-grey label-f14 label-required"
          htmlFor="email">Email</label>

        <input
          type="email"
          id="email"
          name="email"
          className="input-txt"
          onBlur={handleOnBlur}
          onInput={handleOnInput}
          autoComplete='email webauthn'
          placeholder="E.g., name@example.com"
          pattern={"[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}"}
          title={"Please enter a valid email address (e.g., user@example.com)"}
          onKeyDown={handleOnKeyDown}
          maxLength={155}
          value={formData.email}
          required />
      </div>
      {/* TODO:  error field into a component */}
      <div className="input-wrapper">
        <label
          className="label-block label-grey label-f14 label-required"
          htmlFor={"password"}>{'Password'}</label>
        <PasswordInputWrapper
          id="password"
          name="password"
          passwordData={formData.password}
          autoComplete='new-password webauthn'
          placeholder="Enter a valid password"
          onInput={handleOnInput}
          onBlur={handleOnBlur} />
      </div>

      <div className="input-wrapper">
        <label htmlFor={"username"}
          className="label-block label-grey label-f14 label-required">Username</label>
        <input
          id="username"
          name="username"
          className="input-txt"
          type={"text"}
          minLength={5}
          maxLength={20}
          value={formData.username}
          onInput={handleOnInput}
          onBlur={handleOnBlur}
          autoComplete='username'
          pattern={"[A-Za-z0-9_\\-]{5,20}"}
          title="5-20 characters. Letters, numbers, underscores, and hyphens only. No spaces allowed."
          onKeyDown={handleOnKeyDown}
          placeholder={"E.g., john_doe"}
          required />
      </div>

      <div className="btn-wrapper">
        <button className="submit--btn" type="submit" disabled={status === 'submitting'}>{
          status === 'submitting' ? 'Creating Account' : 'Register'
        }</button>
      </div>
    </Form>
  )
}