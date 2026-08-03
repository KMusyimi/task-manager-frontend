import React, { CSSProperties, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetcher } from "react-router-dom";

import IconWrapper from "../general/IconWrapper";

import { useFlashMessage } from "../../hooks/ProviderHooks";
import { IconColors } from "../../utils/utils";
import Spinner from "../general/Spinner";
import { UserResponse } from "../../models/UserModel";

const spinnerStyles: CSSProperties = { width: 20, height: 20, marginBottom: 0 }

interface UploadTypes
{
  file: Blob | null;
  filename: string | null;
  fileSize: string | null;
  status: keyof typeof IconColors;
  progress: number;
}

interface ActionResponse
{
  success: boolean;
  message: string | null;
  error: string | null;
  status: number | null;
}

type uploadData = Omit<UploadTypes, 'fileSize' | 'status'>;

interface UploadParams
{
  user: UserResponse;
  closeModal: () => void;
}

interface DropZoneParams
{
  className?: string
  uploadErr: boolean;
  onInput: (e: React.InputEvent<HTMLInputElement>) => void
  handleOnDrag: (e: React.DragEvent<HTMLDivElement>) => void;
  handleOnDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}


const formatFileSize = (bytes: number) =>
{
  if (bytes < 1024) { return `${bytes.toFixed(1)} Bytes`; }
  else if (bytes < 1048576) { return (bytes / 1024).toFixed(1) + " KB"; }
  else { return (bytes / 1048576).toFixed(1) + " MB" };
};



const DropZone = memo(({ className, uploadErr, handleOnDrag, handleOnDrop, onInput }: DropZoneParams) =>
{
  const fetcher = useFetcher<ActionResponse>({ key: 'pr-key' });
  const InputRef = useRef<HTMLInputElement>(null);

  const style: CSSProperties = useMemo(() => ({ borderColor: !uploadErr ? 'var(--border-color)' : 'var(--primary-red)' }), [uploadErr]);

  const isSubmitting = fetcher.state === 'submitting';

  const handleOnClick = useCallback((e: React.MouseEvent) =>
  {
    e.preventDefault();
    if (InputRef.current) { InputRef.current.click(); }
  }, [])

  return (
    <div
      className={className}
      style={style}
      onDrag={handleOnDrag}
      onDragEnter={handleOnDrag}
      onDragLeave={handleOnDrag}
      onDragOver={handleOnDrag}
      onDrop={handleOnDrop}>
      <div className="helper-text--wrapper">
        <IconWrapper name="LuCamera" />
        <section>
          <h2><span className="browse-text"
            onClick={handleOnClick}
            role="button"
            aria-roledescription="click to choose a file button"
            style={{ color: 'var(--primary-blue)', cursor: 'pointer' }}>
            Click to choose a file</span> or drag & drop it here</h2>
          <span>JPEG, PNG and WEBP formats, up to 10MB allowed</span>
        </section>
      </div>
      <input
        id="profile-upload"
        ref={InputRef}
        className="file-input"
        type={"file"}
        name="file"
        disabled={isSubmitting}
        accept={"image/png, image/jpeg, image/webp"}
        onInput={onInput}
        hidden />
    </div>
  )
})



// TODO: break into small components
function ProfileUpload({ user, closeModal }: UploadParams)
{
  const fetcher = useFetcher<ActionResponse>({ key: 'pr-key' });
  const actionData = fetcher.data;

  const { showMessage } = useFlashMessage();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isDragActive, setIsDragActive] = useState(false);

  const [uploadErr, setUploadErr] = useState(false);
  const [uploadState, setUploadState] = useState<UploadTypes>(() => ({
    file: null, status: 'idle', filename: null, fileSize: null, progress: 0
  }));

  const uploadStatusStyles: CSSProperties = useMemo(() => ({ color: IconColors[uploadState.status] }), [uploadState.status])


  useEffect(() =>
  {
    if (!actionData) { return }

    if (fetcher.state === 'idle')
    {
      setUploadState((prev) => ({
        ...prev,
        status: actionData.success ? 'success' : 'error'
      }));
    }
  }, [actionData, fetcher.state]);

  useEffect(() =>
  {

    return () =>
    {
      if (previewUrl?.startsWith('blob:'))
      {
        URL.revokeObjectURL(previewUrl);
      }
    };

  }, [previewUrl])

  const handleOnDrag = useCallback((e: React.DragEvent<HTMLDivElement>) =>
  {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover")
    {
      setIsDragActive(true);
    } else if (e.type === "dragleave")
    {
      setIsDragActive(false);
    }
  }, []);

  const setFileData = (selectedFile: File) =>
  {
    setPreviewUrl(URL.createObjectURL(selectedFile));
    console.log(selectedFile.name)
    setUploadState((prev) => ({
      ...prev,
      file: selectedFile,
      filename: selectedFile.name,
      fileSize: formatFileSize(selectedFile.size),
      status: 'selected'
    }));
  }

  const handleOnDrop = useCallback((e: React.DragEvent<HTMLDivElement>) =>
  {
    e.preventDefault();
    e.stopPropagation();
    const maxSize = 10 * 1024 * 1024;

    const { dataTransfer } = e;
    const selectedFile = dataTransfer.files[0];
    setIsDragActive(false);

    if (!selectedFile.type.startsWith("image/") || selectedFile.size > maxSize)
    {
      setUploadErr(true);
      showMessage({ type: "error", text: "Only images JPEG, PNG AND WEBP formats, up to 10MB allowed! PDFs are not permitted." });
      return;
    }

    setFileData(selectedFile);
    setUploadErr(false);
  }, [showMessage]);

  const onClickDelete = useCallback(() =>
  {
    setPreviewUrl(prev =>
    {
      if (prev?.startsWith('Blob:'))
      {
        URL.revokeObjectURL(prev);
      }
      return null;
    });

    setUploadState((prev) => ({ ...prev, file: null, filename: null, fileSize: null, status: 'idle', progress: 0 }));

  }, []);


  const handleOnInput = useCallback((e: React.InputEvent<HTMLInputElement>) =>
  {
    const { files } = e.currentTarget;
    if (files)
    {
      const selectedFile = files[0]
      setFileData(selectedFile);
    }
  }, []);

  const handleOnSubmit = (data: uploadData) =>
  {

    if (!data.file || !data.filename)
    {
      showMessage({ type: 'warning', text: 'No changes made' });
      return;
    }
    const formData = new FormData();

    formData.append('profile_image', data.file, data.filename);

    setUploadState((prev) => ({ ...prev, status: 'uploading' }));

    fetcher.submit(formData, {
      action: `/projects/${user.username}/profile/upload`,
      method: 'POST',
      encType: "multipart/form-data"
    })
      .catch((error: unknown) =>
      {
        setUploadState((prev) => ({ ...prev, status: 'error' }));
        setUploadErr(true);
        console.error("Error during uploading profile image:", error);
      });

    setUploadState((prev) => ({ ...prev, status: 'uploading' }));

  };



  const isSubmitting = fetcher.state === 'submitting';
  const isUploading = uploadState.status === 'uploading' || isSubmitting;

  const isStatusErrorOrSuccess = uploadState.status === 'success' || uploadState.status === 'error';

  const dropZoneCls = isDragActive ? "drop-zone active el-flx" : "drop-zone el-flx";
  const isDisabled = !previewUrl || isStatusErrorOrSuccess || isUploading;

  return (
    <div className="profile-upload--wrapper">
      <div className="header-container el-flx">
        <div className="el-flx">
          <IconWrapper name='FaCloudArrowUp' />
          <header className="el-flx">
            <h1>Upload Image</h1>
            <span>Select and upload a new image.</span>
          </header>
        </div>
        <button
          className="back-btn"
          type="button"
          onClick={closeModal}>
          <IconWrapper className="back-icon" name="FaXmark" />
        </button>
      </div>

      <main>
        <div className="field-wrapper">
          <span className="field-title">Profile photo</span>
          <div className="dropzone-container el-flx">
            <div className="profile-container">
              <div className={"avatar-wrapper"}>
                <img
                  key={user.avatarVersion || 'profile'}
                  className="profile-preview--img"
                  src={previewUrl ?? `${user.profileImgUrl}?v=${String(user.avatarVersion)}`}
                  alt="Preview avatar image" />
              </div>
              {previewUrl && <button
                className="delete-btn"
                type="button"
                onClick={onClickDelete}>
                <IconWrapper className="back-icon" name="FaXmark" />
              </button>}
            </div>
            <DropZone
              className={dropZoneCls}
              uploadErr={uploadErr}
              onInput={handleOnInput}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop} />
          </div>
        </div>

        <div className="field-wrapper">
          <span className="field-title el-flx">
            <IconWrapper name="PiGearSix" />
            File details</span>
          <div className="file-details">
            <div className="details-wrapper el-flx">
              <span className="details-label">Filename:</span>
              <span className="filename">{uploadState.filename ?? 'user_avatar.jpg'}</span>
            </div>
            <div className="details-wrapper el-flx">
              <span className="details-label">File Size:</span>
              <span className="file-size" style={{ fontFamily: 'var(--font-mono)' }}>{uploadState.fileSize ?? '0 MB'}</span>
            </div>
            <div className="details-wrapper el-flx">
              <span className="details-label">Status:</span>
              <span className="status el-flx" style={{ ...uploadStatusStyles, alignItems: 'center', gap: '.25em' }}>
                <IconWrapper name="FaCloudArrowUp" />
                <span className="upload-status" aria-live="polite"> • {uploadState.status}</span>
                {(isSubmitting || isUploading) && <Spinner style={spinnerStyles} />}
              </span>
            </div>
          </div>
        </div>

      </main>
      <footer>
        <div className="btn-wrapper el-flx">
          <button type="button" onClick={closeModal}>Cancel</button>

          <button
            className="upload-btn"
            type="submit"
            onClick={() => { handleOnSubmit(uploadState) }}
            disabled={isDisabled}>
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </footer>
    </div >
  )
}

DropZone.displayName = 'DropZone';
export default memo(ProfileUpload);