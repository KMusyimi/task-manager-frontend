import { useCallback, useState, type JSX } from "react";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import type { UserValidationFields } from "../entities/entity";
import { isValidInput } from "../utils/utils";
import type { loginLoader } from "../utils/loaders";
import type { loginAction } from "../utils/actions";


export default function Login(): JSX.Element {

  const [, setIsValid] = useState<UserValidationFields>({ password: null, email: null });

  const errMsg = useActionData<typeof loginAction>();
  const message = useLoaderData<typeof loginLoader>();
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
      {(message ?? errMsg) && <p>{errMsg?.message ?? message}</p>}
      <Form method="post" replace={true}>
        <label htmlFor="username">Enter username or email</label>

        <input
          type="text"
          id={'username'}
          className="input-txt"
          name="username"
          placeholder="username or email"
          autoComplete="email"
          required />

        <PasswordInput handleBlur={handleBlur} />

        <button
          type='submit'
          className='fw-700'
          disabled={status === 'submitting'}>{status === 'submitting' ? "Logging in..." : "Login"}</button>
      </Form>
    </>
  )
}