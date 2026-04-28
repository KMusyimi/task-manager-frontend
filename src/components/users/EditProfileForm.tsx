import React, { memo, useCallback, useState, type CSSProperties } from "react";
import { Form, useFetcher } from "react-router-dom";
import type { ActionFuncError } from "../../models/entity";
import type { EditUserParams, UserResponse } from "../../models/UserModel";

import useActionError from "../../hooks/ActionErrorHook";
import { useFlashMessage } from "../../hooks/ProviderHooks";
import PasswordInputWrapper from "./PasswordInputWrapper";


const styles: CSSProperties = { minHeight: 200 }


interface MyProfileParams {
  user: UserResponse
}

function EditProfileForm({ user }: MyProfileParams) {
  const fetcher = useFetcher();
  const { showMessage } = useFlashMessage();

  useActionError(fetcher.data as ActionFuncError);

  const [formData, setFormData] = useState<EditUserParams>(() => (
    { ...user, 'intent': 'edit', password: '' }));

  const handleOnInput = useCallback((e: React.InputEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [name]: value }))
  }, []);

  const handleOnBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trimEnd() }))
  }, []);

  const handleOnKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  }, []);

  const handleSubmit = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const changes = Object
      .entries(formData)
      .filter(([key, value]) => key in user && key !== 'password' && value !== user[key as keyof typeof user] && !!value)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value as string }), {});

    if (Object.keys(changes).length > 0) {
      fetcher.submit({
        ...changes, userID: formData.userID, intent: formData.intent,
        password: formData.password
      },
        {
          method: "PUT"
          // action: `/projects/${user.login_name}/profile`
        })
        .catch((error: unknown) => {
          console.error('Error form failed to update profile: ', error)
        });
    } else {
      showMessage({
        text: "No changes to submit.",
        type: 'info'
      });
    }
    setFormData(prev => ({ ...prev, password: '' }));
  }, [fetcher, formData, showMessage, user]);


  return (
    <Form
      className={`edit-profile--form`}
      action={'.'}
      method="put"
      replace={true}
      onSubmit={handleSubmit}
      style={styles}
    >
      <p className="alert-text">Please re-enter your password for security.</p>
      <div className="form-container">
        <input type="hidden" name="userID" value={formData.userID} />
        <input type="hidden" name="intent" value={formData.intent} />
        <div className="input-wrapper">
          <label htmlFor={"username"}
            className="label-block label-grey label-f14">Username</label>
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
            autoComplete='username webauthn'
            pattern={"[A-Za-z0-9_\\-]{5,20}"}
            title="5-20 characters. Letters, numbers, underscores, and hyphens only. No spaces allowed."
            onKeyDown={handleOnKeyDown}
            placeholder={"E.g., John Doe"}
            required />
        </div>

        <div className="input-wrapper">
          <label className="label-block label-grey label-f14" htmlFor="email">Email</label>
          <input
            type="email"
            id={'email'}
            className="input-txt email"
            name="email"
            onBlur={handleOnBlur}
            autoComplete='email webauthn'
            placeholder="E.g., name@example.com"
            pattern={"[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}"}
            title={"Please enter a valid email address (e.g., user@example.com)"}
            value={formData.email}
            onInput={handleOnInput}
            onKeyDown={handleOnKeyDown}
            required />
        </div>

        <div className="input-wrapper">
          <label
            className="label-block label-grey label-f14"
            htmlFor={"password"}>Password</label>
          <PasswordInputWrapper
            id="password"
            name="password"
            passwordData={formData.password}
            autoComplete='current-password webauthn'
            placeholder="Enter a valid password"
            onBlur={handleOnBlur}
            onInput={handleOnInput} />
        </div>
      </div>

      <button type="submit"
        disabled={fetcher.state === 'submitting'}
        className="submit-btn">{fetcher.state === 'submitting' ? 'Saving...' : 'Save Change'}</button>
    </Form>

  )
}

export default memo(EditProfileForm);