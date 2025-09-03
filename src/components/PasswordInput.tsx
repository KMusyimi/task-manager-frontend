import { useState, useCallback } from "react";

interface inputProps {
  handleBlur: (e: React.FormEvent<HTMLInputElement>) => void
}

export default function PasswordInput({ handleBlur }: inputProps) {
  const [hidePassword, setHidePassword] = useState(true);
  const togglePasswordField = useCallback(() => {
    setHidePassword(prev => !prev)
  }, []);

  return (
    <>
      <label htmlFor="password">Password</label>
      <input
        type={hidePassword ? "password" : "text"}
        id="password"
        name="password"
        onBlur={handleBlur}
        placeholder="Enter a valid password"
        minLength={8}
        autoComplete='new-password webauthn'
        required />
      <button type="button" onClick={togglePasswordField}>{hidePassword ? 'show' : 'hide'} password</button>

    </>
  )
}