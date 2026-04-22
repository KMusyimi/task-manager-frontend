import React, { CSSProperties, memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useFetcher, useSearchParams } from "react-router-dom";

import IconWrapper from "../components/general/IconWrapper";
import UploadImgPreview from "../components/general/UploadImgPreview";

import { useFlashMessage } from "../hooks/ProviderHooks";
import { formatFileSize, IconColors } from "../utils/utils";

const errStyles: CSSProperties = { borderColor: '#e24749' }

interface UploadTypes {
  file: Blob | null;
  filename: string | null;
  fileSize: string | null;
  status: keyof typeof IconColors;
  progress: number;
}

interface ActionResponse {
  success: boolean;
  message: string | null;
  error: string | null;
  status: number | null;
}

type uploadData = Omit<UploadTypes, 'fileSize' | 'status'>;

interface DropZoneParams {
  isDragActive: boolean;
  children: ReactNode;
  uploadErr: boolean;
  isPreviewUrl: boolean;
  handleOnDrag: (e: React.DragEvent<HTMLDivElement>) => void;
  handleOnDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const DropZone = memo(({ isDragActive, uploadErr, handleOnDrag, handleOnDrop, isPreviewUrl, children }: DropZoneParams) => {
  const cls = isDragActive ? "drop-zone active" : "drop-zone";
  const style: CSSProperties = useMemo(() => ({ "marginBottom": isPreviewUrl ? '1.85em' : '0' }), [isPreviewUrl]);

  const styles = uploadErr ? errStyles : style;

  return (
    <div
      className={cls}
      style={styles}
      onDrag={handleOnDrag}
      onDragEnter={handleOnDrag}
      onDragLeave={handleOnDrag}
      onDragOver={handleOnDrag}
      onDrop={handleOnDrop}>

      <div className="helper-text--wrapper">
        <IconWrapper name="FaCloudArrowUp" />
        <hgroup>
          <h2>Choose a file or drag & drop it here</h2>
          <h3>JPEG, PNG and WEBP formats, up to 10MB allowed</h3>
        </hgroup>
      </div>
      {children}
    </div>
  )
})



// TODO: break into small components
function ProfileUpload() {
  const fetcher = useFetcher<ActionResponse>({ key: 'pr-key' });
  const actionData = fetcher.data;
  const InputRef = useRef<HTMLInputElement>(null);

  const { showMessage } = useFlashMessage();
  const [searchParams,] = useSearchParams();

  const search = useMemo(() => {
    searchParams.delete('z-i'); return searchParams.toString()
  }, [searchParams]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isDragActive, setIsDragActive] = useState(false);

  const [uploadErr, setUploadErr] = useState(false);
  const [uploadState, setUploadState] = useState<UploadTypes>(() => ({
    file: null, status: 'idle', filename: null, fileSize: null, progress: 0
  }));


  useEffect(() => {
    if (!actionData) { return }

    if (fetcher.state === 'idle') {
      setUploadState((prev) => ({
        ...prev,
        status: actionData.success ? 'success' : 'error'
      }));
    }
  }, [actionData, fetcher.state]);

  useEffect(() => {

    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };

  }, [previewUrl])

  const handleOnDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);


  const handleOnDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const maxSize = 10 * 1024 * 1024;

    const { dataTransfer } = e;
    const selectedFile = dataTransfer.files[0];
    setIsDragActive(false);

    if (!selectedFile.type.startsWith("image/") || selectedFile.size > maxSize) {
      setUploadErr(true);
      showMessage({ type: "error", text: "Only images JPEG, PNG AND WEBP formats, up to 10MB allowed! PDFs are not permitted." });
      return;
    }

    setPreviewUrl(URL.createObjectURL(selectedFile));
    setUploadState((prev) => ({
      ...prev,
      file: selectedFile,
      filename: selectedFile.name,
      fileSize: formatFileSize(selectedFile.size),
      status: 'selected'
    }));

    setUploadErr(false);
  }, [showMessage]);

  const handleDeleteFile = useCallback(() => {
    setPreviewUrl(prev => {
      if (prev?.startsWith('Blob:')) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });

    setUploadState((prev) => ({ ...prev, file: null, filename: null, fileSize: null, status: 'idle', progress: 0 }));

  }, []);


  const handleOnClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (InputRef.current) { InputRef.current.click(); }
  }, [])

  const handleOnInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (files) {
      const selectedFile = files[0]
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setUploadState((prev) => ({
        ...prev,
        file: selectedFile,
        filename: selectedFile.name,
        fileSize: formatFileSize(selectedFile.size),
        status: 'selected'
      }));
    }
  }, []);
  console.log(uploadState);

  const handleOnSubmit = useCallback((data: uploadData) => {

    if (!data.file || !data.filename) {
      showMessage({ type: 'warning', text: 'No changes made' });
      return;
    }
    const formData = new FormData();

    formData.append('profile_image', data.file, data.filename);

    setUploadState((prev) => ({ ...prev, status: 'uploading' }));

    fetcher.submit(formData, { method: 'POST', encType: "multipart/form-data" })
      .catch((error: unknown) => {
        setUploadState((prev) => ({ ...prev, status: 'error' }));
        setUploadErr(true);
        console.error("Error during uploading profile image:", error);
      });

    setUploadState((prev) => ({ ...prev, status: 'uploading' }));
  }, [fetcher, showMessage]);


  const isStatusErrorOrSuccess = uploadState.status === 'success' || uploadState.status === 'error';
  const alertSuccessTextCls = actionData?.error ? 'alert-text' : 'success-text';



  return (
    <div className="profile-upload--wrapper">
      <header>
        <span>
          <h1>Upload Image</h1>
          <p>Select and upload a new image.</p>
        </span>
        <Link
          to={{ pathname: fetcher.state === 'idle' ? '..' : 'javascript:void(0)', search: search ? `?${search}` : '' }}
          relative="path">

          <IconWrapper className="back-icon" name="FaRegCircleXmark" />
        </Link>
      </header>

      <main>
        {isStatusErrorOrSuccess && (actionData &&
          (<p className={alertSuccessTextCls}
            style={{ color: IconColors[uploadState.status], marginBottom: '1em' }}>
            {actionData.success ? actionData.message : actionData.error}
          </p>))}

        <DropZone
          uploadErr={uploadErr}
          handleOnDrag={handleOnDrag}
          isDragActive={isDragActive}
          isPreviewUrl={!!previewUrl}
          handleOnDrop={handleOnDrop}>
          <button className="browse-files--btn" type="button"
            onClick={handleOnClick}>Browse File</button>
        </DropZone>

        {previewUrl && <UploadImgPreview
          previewUrl={previewUrl}
          fileSize={uploadState.fileSize}
          filename={uploadState.filename}
          handleDeleteFile={handleDeleteFile}
          status={uploadState.status} />}

        <input
          id="profile-upload"
          ref={InputRef}
          className="file-input"
          type={"file"}
          name="file"
          accept={"image/png, image/jpeg, image/webp"}
          onInput={handleOnInput}
          hidden />
        {previewUrl && (
          <button
            className="upload-btn"
            type="submit"
            onClick={() => { handleOnSubmit(uploadState) }}
            disabled={isStatusErrorOrSuccess}>
            {fetcher.state === 'submitting' ? 'Uploading...' : 'Upload Image'}
          </button>)}
      </main>
    </div>
  )
}

DropZone.displayName = 'DropZone';
export default memo(ProfileUpload);