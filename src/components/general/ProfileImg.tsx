import { CSSProperties, memo } from "react";


function AvatarWrapper({ imgUrl, version, style }: { imgUrl: string, version: number, style?: CSSProperties })
{
  return (
    <div className="avatar-wrapper"
      aria-label='button'
      style={style}
      role='button'>
      <img
        className="profile-img"
        alt="user profile image"
        fetchPriority={'high'}
        loading="eager"
        src={`${imgUrl}?v=${String(version)}`} />
    </div>
  )
}


export default memo(AvatarWrapper);