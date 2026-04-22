import { memo, useCallback, useState, type CSSProperties } from "react";
import { useFetcher } from "react-router-dom";
import type { ChangePasswordParams, UserResponse } from "../../models/UserModel";

import PasswordInputWrapper from "./PasswordInputWrapper";

const styles: CSSProperties = { paddingBlockStart: '.75em', marginBottom: '1em' }


interface ChangePasswordTypes {
  user: Omit<UserResponse, 'profileImgUrl'>
}

function ChangePasswordMenu({ user }: ChangePasswordTypes) {
  const fetcher = useFetcher();
  const [validationErr, setValidationErr] = useState('');
  const [isNewPwValid, setIsNewPwValid] = useState(false);

  const [formData, setFormData] = useState<ChangePasswordParams>({
    'currentPw': '', 'newPw': '', 'confirmPw': '', intent: 'changePw'
  });

  const handleOnSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetcher.submit(e.currentTarget, { method: 'POST', encType: "multipart/form-data" })
      .catch((error: unknown) => {
        console.error("Error during changing password", error);
      });
  }, [fetcher]);


  const handleOnInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    if (validationErr) {
      setValidationErr("");
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  }, [validationErr])

  const handleOnblur = useCallback((e: React.FormEvent<HTMLInputElement>, data: ChangePasswordParams) => {
    const { name, value } = e.currentTarget;

    const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}/
    if (value && !re.test(value)) {
      setValidationErr("Password must be at least 8 characters long and include: 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
    } else {
      setValidationErr("");
    }


    if (name === 'newPw' && value) {
      if (data.currentPw === value) {
        setValidationErr("New password cannot be the same as your current password.")

      } else {
        setIsNewPwValid(re.test(data.newPw));
      }

    }

    if (name === 'confirmPw' && value) {
      if (data.newPw !== value) {
        setValidationErr('New and confirmation password do not match.')
        return;
      } else {
        setValidationErr("");
      }
    }
  }, []);

  return (
    <fetcher.Form
      className={`change-pw--form menu-item`}
      action={'.'}
      method="put"
      onSubmit={handleOnSubmit} >
      <input type="text" name="username"
        autoComplete='username' readOnly defaultValue={user.username} style={{ display: 'none' }} />
      <input type="hidden" name="userID" defaultValue={user.userID} />
      <input type="hidden" name="intent" defaultValue={formData.intent} />

      <p className="alert-text" style={styles}>
        {validationErr ? validationErr : 'Please enter your current password for security.'}
      </p>



      <label
        className="label-block label-grey label-f14 label-required"
        htmlFor={"currentPw"}>Current Password</label>
      <PasswordInputWrapper
        id="currentPw"
        name='currentPw'
        autoComplete='current-password'
        onBlur={(e) => { handleOnblur(e, formData) }}
        placeholder="Enter your current password"
        onInput={handleOnInput}
        passwordData={formData.currentPw} />



      <label className="label-block label-grey label-f14 label-required"
        htmlFor={"newPw"}>New Password</label>
      <PasswordInputWrapper
        id="newPw"
        name='newPw'
        autoComplete='new-password'
        onBlur={(e) => { handleOnblur(e, formData) }}
        placeholder="Enter your new password"
        onInput={handleOnInput}
        passwordData={formData.newPw} />


      <label className={`label-block label-grey label-f14 ${isNewPwValid ? 'label-required' : ''}`} htmlFor={'confirmPw'}>Confirm New Password</label>

      <PasswordInputWrapper
        id="confirmPw"
        name='confirmPw'
        autoComplete='new-password'
        placeholder="Confirm your new password"
        onInput={handleOnInput}
        onBlur={(e) => { handleOnblur(e, formData) }}
        disabled={!isNewPwValid}
        passwordData={formData.confirmPw} />

      <button
        type="submit"
        className="submit-btn" >Change Password</button>
    </fetcher.Form >)
}

export default memo(ChangePasswordMenu);