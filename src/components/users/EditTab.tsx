import React, { memo, useCallback, useState } from "react";
import { Form, useFetcher } from "react-router-dom";
import type { ActionFuncError } from "../../models/entity";
import type { EditUserParams, UserResponse } from "../../models/UserModel";

import useActionError from "../../hooks/ActionErrorHook";
import { useFlashMessage } from "../../hooks/ProviderHooks";
import PasswordInputWrapper from "../general/PasswordInputWrapper";
import IconWrapper from "../general/IconWrapper";
import { formatKenyanInternational } from "../../utils/utils";


interface EditTabParams
{
  user: UserResponse
}

function EditTab({ user }: EditTabParams)
{
  const fetcher = useFetcher();
  const { showMessage } = useFlashMessage();

  useActionError(fetcher.data as ActionFuncError);

  const [formData, setFormData] = useState<EditUserParams>(() => (
    { ...user, 'intent': 'edit', password: '', phoneNumber: formatKenyanInternational(user.phoneNumber ?? 'N/A') }));

  const handleOnInput = useCallback((e: React.InputEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  {
    const { name, value } = e.currentTarget;

    if (name === 'phoneNumber')
    {
      const formattedValue = formatKenyanInternational(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else
    {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

  }, []);

  const handleOnBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [name]: value.trimEnd() }))
  }, []);

  const handleOnKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) =>
  {
    if (e.key === ' ')
    {
      e.preventDefault();
    }
  }, []);

  const handleSubmit = useCallback((e: React.SubmitEvent<HTMLFormElement>) =>
  {
    e.preventDefault();

    const changes = Object
      .entries(formData)
      .filter(([key, value]) => key in user && key !== 'password' && value !== user[key as keyof typeof user] && !!value)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value as string }), {});

    if (Object.keys(changes).length > 0)
    {
      fetcher.submit({
        ...changes, userID: formData.userID, intent: formData.intent,
        password: formData.password
      },
        {
          method: "PUT",
          action: `/projects/${user.username}/profile`
        })
        .catch((error: unknown) =>
        {
          console.error('Error form failed to update profile: ', error)
        });
    } else
    {
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
      method="put"
      replace={true}
      onSubmit={handleSubmit}
    >
      <div className="alert-text--wrapper el-flx">
        <IconWrapper name='LuLock' />
        <p className="alert-text">Please re-enter your current password for security, with at least 8 characters, mixing letters, numbers, and symbols.</p>
      </div>
      <div className="form-container">
        <input type="hidden" name="userID" value={formData.userID} />
        <input type="hidden" name="intent" value={formData.intent} />

        <div className="field-container">
          <span className="field-title">Basic info</span>
          <div className="el-flx" style={{ gap: '.785em' }}>

            <div className="input-wrapper">
              <label htmlFor={"username"}
                className="label-block el-flx">Username</label>
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
              <label htmlFor={"role"}
                className="label-block el-flx">Role / Title</label>
              <input
                id="role"
                name="role"
                className="input-txt"
                type={"text"}
                minLength={5}
                maxLength={25}
                value={formData.role ?? ''}
                onInput={handleOnInput}
                onBlur={handleOnBlur}
                placeholder={"E.g., Web Developer"} />
            </div>
          </div>

          <div className="input-wrapper">
            <label htmlFor={"department"}
              className="label-block el-flx">department</label>
            <input
              id="department"
              name="department"
              className="input-txt"
              type={"text"}
              maxLength={25}
              value={formData.department ?? ''}
              onInput={handleOnInput}
              onBlur={handleOnBlur}
              placeholder={"E.g., Web Developer"} />
          </div>

          <div className="input-wrapper">
            <label htmlFor={"bio"}
              className="label-block el-flx" style={{ justifyContent: 'space-between' }}>bio
              <span style={{ fontSize: '.625rem', fontFamily: "var(--font-mono)", color: 'var(--text-muted)' }}>{formData.bio ? formData.bio.length : 0}/255</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              className="input-txt bio"
              minLength={30}
              maxLength={255}
              value={formData.bio ?? ''}
              rows={4}
              onInput={handleOnInput}
              onBlur={handleOnBlur}
              placeholder={"Add a brief bio."} />
          </div>
        </div>

        <div className="field-container">
          <span className="field-title">contact</span>
          <div className="input-wrapper">
            <label className="label-block el-flx" htmlFor="email">Email Address</label>
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
            <label className="label-block el-flx" htmlFor="phoneNumber">phone</label>
            <input
              type="text"
              id={'phoneNumber'}
              className="input-txt"
              name="phoneNumber"
              maxLength={16}
              onBlur={handleOnBlur}
              placeholder="e.g., +254 712 345 678"
              pattern="^\+254\s[17][0-9]{2}\s[0-9]{3}\s[0-9]{3}$"
              title={"Please enter a valid international number starting with +254."}
              value={formData.phoneNumber ?? ''}
              onInput={handleOnInput}
              required />
          </div>
        </div>


        <div className="field-container">
          <span className="field-title">security</span>
          <div className="input-wrapper">
            <label
              className="label-block el-flx"
              htmlFor={"password"}>Password</label>
            <PasswordInputWrapper
              id="password"
              name="password"
              passwordData={formData.password}
              autoComplete='current-password'
              placeholder="Enter a valid password"
              onBlur={handleOnBlur}
              onInput={handleOnInput} />
          </div>
        </div>

      </div>

      <button type="submit"
        disabled={fetcher.state === 'submitting'}
        className="submit-btn el-flx" style={{ gap: '.5em' }}>
        <IconWrapper name="PiGearSix" />
        {fetcher.state === 'submitting' ? 'Saving...' : 'Save Changes'}</button>
    </Form>

  )
}

export default memo(EditTab);