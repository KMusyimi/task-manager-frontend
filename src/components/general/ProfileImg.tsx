import { memo } from "react";
import { API_URL } from "../../api";
import IconWrapper from "./IconWrapper";
import Overlay from "./Overlay";

interface ProfileImgViewParams {
  isViewImg: boolean;
  imgUrl: string;
  closeImgView: () => void
}

export const ProfileImgView = memo(({ isViewImg, closeImgView, imgUrl }: ProfileImgViewParams) => {
  if (!isViewImg) {
    return null;
  }
  return (
    <Overlay isActive={isViewImg} closeOverlay={closeImgView} zIndex={500}>
      <div className="img-viewer" onClick={(e) => { e.stopPropagation() }}>
        <button
          type="button"
          className="back-btn"
          aria-label="back"
          onClick={closeImgView}>
          <IconWrapper className="back-icon" name="FaRegCircleXmark" />
        </button>

        <div className={`img-wrapper`}>
          <ProfileImg imgUrl={imgUrl} />
        </div>
      </div>
    </Overlay>
  )
})


function ProfileImg({ imgUrl }: { imgUrl: string }) {
  return (
    <img
      className="profile-img"
      alt="user profile image"
      fetchPriority={'high'}
      loading="eager"
      src={`${API_URL}/static/${imgUrl}`} />)
}

ProfileImgView.displayName = 'ProfileImgView';

export default memo(ProfileImg);