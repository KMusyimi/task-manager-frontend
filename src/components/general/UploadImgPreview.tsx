import { CSSProperties, useMemo } from "react";
import IconWrapper from "./IconWrapper";
import { IconColors } from "../../utils/utils";
import { useFetcher } from "react-router-dom";
import Spinner from "./Spinner";



interface UploadImgPreviewParams {
  previewUrl: string;
  filename: string | null;
  fileSize: string | null;
  status: keyof typeof IconColors;
  handleDeleteFile: () => void

}
export default function UploadImgPreview({ previewUrl, filename, fileSize, status, handleDeleteFile }: UploadImgPreviewParams) {
  const fetcher = useFetcher({ key: 'pr-key' });
  const uploadStatusStyles: CSSProperties = useMemo(() => ({ color: IconColors[status] }), [status])

  return (
    <div className="file-preview">
      <div className="file-details--wrapper">
        <div className={"avatar-preview"}>
          <img
            className="profile-preview--img"
            src={previewUrl}
            alt="Preview avatar image" />
        </div>
        <span className="file-details">
          <h4 className="filename">{filename}</h4>
          <div className="details-container">
            <p className="file-size">{fileSize}</p>
            <IconWrapper name="FaCloudArrowUp" style={uploadStatusStyles} />
            <span className="upload-status" aria-live="polite">{status}</span>
            {fetcher.state === 'submitting' && <Spinner/>}
          </div>
        </span>
      </div>
      <button className="cancel-btn" type="button" onClick={handleDeleteFile}>
        <IconWrapper
          className="delete-icon"
          name="FaTrash" />
      </button>
    </div>)

}