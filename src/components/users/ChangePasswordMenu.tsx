import { memo, useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { useFetcher, useSearchParams } from "react-router-dom";
import { ChangePasswordParams, UserResponse } from "../../models/UserModel";

import PasswordInputWrapper from "./PasswordInputWrapper";

const styles: CSSProperties = { paddingBlockStart: '.75em', marginBottom: '1em' }


interface ChangePasswordTypes {
  user: Omit<UserResponse, 'profileImgUrl'>
}
interface ValidationTypes {
  isValid: boolean;
  errField?: string | null;
  err: string | null;
}
interface ConfigTypes {
  id: keyof ChangePasswordParams;
  label: string;
  autoComplete: string;
  placeholder: string;
}

const CHANGE_PW_CONFIG: ConfigTypes[] = [{
  id: 'currentPw', label: 'Current Password', autoComplete: 'current-password',
  placeholder: "Enter your current password"
},
{
  id: 'newPw', label: 'New Password', autoComplete: 'new-password',
  placeholder: "Enter your new password"
},
{
  id: 'confirmPw', label: 'Confirm Password', autoComplete: 'new-password',
  placeholder: "Confirm your new password"
}]


function ChangePasswordMenu({ user }: ChangePasswordTypes) {
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher();
  const [validationErr, setValidationErr] = useState<ValidationTypes>({ isValid: false, err: null });
  const search = useMemo(() => searchParams.toString(), [searchParams]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<ChangePasswordParams>(() => ({
    currentPw: '', newPw: '', confirmPw: '', intent: 'changePw'
  }));

  const isSubmitting = fetcher.state === 'submitting';
  const isInvalid = !validationErr.isValid ||
    !formData.currentPw ||
    !formData.newPw ||
    !formData.confirmPw;

  useEffect(() => {
    if (!formData.newPw && !formData.confirmPw) {
      setValidationErr({ isValid: true, errField: null, err: null });
      return;
    }
    if (touched.confirmPw && formData.newPw && formData.confirmPw) {
      if (formData.newPw !== formData.confirmPw) {
        setValidationErr({
          isValid: false,
          errField: 'confirmPw',
          err: 'New and confirmation password do not match.'
        });
      } else {
        setValidationErr({ isValid: true, errField: null, err: null });
      }
    }
  }, [formData.confirmPw, formData.newPw, touched.confirmPw])

  const handleOnInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, [])

  const handleOnblur = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    if (!value) return;

    setTouched(prev => ({ ...prev, [name]: true }));

    const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}/
    const isValid = re.test(value);

    if (!isValid) {
      setValidationErr({ isValid: false, errField: name, err: "8+ characters: Mixed case, number & symbol" });
      return;
    }
  }, []);


  return (
    <fetcher.Form
      className={`change-pw--form`}
      action={`.?${search}`}
      method="post">
      <input type="text" name="username"
        autoComplete='username' readOnly defaultValue={user.username} style={{ display: 'none' }} />
      <input type="hidden" name="userID" defaultValue={user.userID} />
      <input type="hidden" name="intent" defaultValue={formData.intent} />

      <p className="alert-text" style={styles}>
        Please enter your current password for security.
      </p>


      {CHANGE_PW_CONFIG.map(field =>
        <div key={field.id} className={'input-wrapper'}>
          <label
            className="label-block label-grey label-f14 label-required"
            htmlFor={field.id}>{field.label}</label>
          <PasswordInputWrapper
            id={field.id}
            name={field.id}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
            onBlur={handleOnblur}
            onInput={handleOnInput}
            disabled={isSubmitting}
            aria-invalid={validationErr.errField === field.id}
            aria-describedby={validationErr.errField === field.id ? `${field.id}-err` : undefined}
            passwordData={formData[field.id]} />
          {validationErr.errField === field.id &&
            <span id={`${field.id}-err`} className="alert-text label-required"
              aria-describedby="currentPw-error">{validationErr.err}</span>}
        </div>
      )}
      <button
        type="submit"
        disabled={isInvalid || isSubmitting}
        className="submit-btn">Change Password</button>
    </fetcher.Form >)
}

export default memo(ChangePasswordMenu);