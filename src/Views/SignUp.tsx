import { useCallback, useRef, useState, type JSX } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import type { UserValidationFields } from "../entities/entity";
import { isValidInput } from "../utils/utils";
import type { signupAction } from "../utils/actions";


// TODO: break form into reuseable components and change form to fetcher for form validation
export default function SignUp(): JSX.Element {
  const errMessage = useActionData<typeof signupAction>();
  const [isValid, setIsValid] = useState<UserValidationFields>({ password: null, email: null });
  const emailRef = useRef<HTMLInputElement>(null)

  const navigation = useNavigation();
  const status = navigation.state;

  const handleBlur = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { type, value } = e.target as HTMLInputElement;
    if (value !== '') {
      setIsValid(prev => ({ ...prev, [type]: isValidInput(type, value) }));
    }
  }, []);
  return (
    <>
      {errMessage && <p>{errMessage.message}</p>}
      <Form replace={true} method="post">
        <label htmlFor="email">Email</label>

        <input ref={emailRef}
          type="email"
          id="email"
          name="email"
          onBlur={handleBlur}
          maxLength={155}
          required
        />
        {isValid.email === false && <p>sample err</p>}
        {/* TODO: change password field to component and error field into a component */}

        <PasswordInput handleBlur={handleBlur} />
        {isValid.password === false && <p>sample err</p>}

        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" minLength={3} maxLength={50} required />

        <button type="submit" disabled={status === 'submitting'}>{
          status === 'submitting' ? ' Creating Account' : 'Create Account'
        }</button>
      </Form>
    </>
  )
}