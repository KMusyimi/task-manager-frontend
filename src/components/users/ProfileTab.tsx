import { memo } from "react";
import { UserResponse } from "../../models/UserModel";
import IconWrapper, { iconKeyTypes } from "../general/IconWrapper";
import { formatKenyanInternational } from "../../utils/utils";


interface MyProfileParams
{
  user: UserResponse
  navigateTo: (newIdx: number) => void;
}

interface MenuSectionParams
{
  id: keyof UserResponse;
  label: string;
  iconName: iconKeyTypes;
}

interface ConfigParams
{
  sectionID: number;
  title: string;
  section: MenuSectionParams[]
}


const PROFILE_CONFIG: ConfigParams[] = [
  {
    sectionID: 0, title: 'contact', section: [
      { id: 'email', label: 'email', iconName: 'LuMail' },
      { id: 'phoneNumber', label: 'phone', iconName: 'FiPhone' }]
  },
  {
    sectionID: 1, title: 'work', section: [
      { id: 'role', label: 'role', iconName: 'FiBriefcase' },
      { id: 'department', label: 'department', iconName: 'LuBuilding2' }]
  }
]



function ProfileTab({ user, navigateTo }: MyProfileParams)
{

  return (<>
    <div className="field-wrapper tab-section">
      <span className="field-title">about</span>
      <span className="field-text">{user.bio ?? "Add bio data in edit tab"}</span>
    </div>

    {PROFILE_CONFIG.map(config => (
      <div key={config.sectionID} className="tab-section">
        <div className="field-wrapper">
          <span className="field-title">{config.title}</span>
        </div>
        <div className="field-wrapper">
          {config.section.map(field => (
            <div key={field.id} className="field-text--wrapper el-flx">
              <IconWrapper name={field.iconName} />
              <div>
                <span className="field-label">{field.label}</span>
                <span className="field-text">
                  {field.id === 'phoneNumber' ?
                    formatKenyanInternational(user[field.id] ?? 'N/A')
                    : user[field.id]}
                </span>
              </div>
            </div>)
          )}
        </div>
      </div>
    ))
    }
    <span className="field-text">Member since {user.joinedIn}</span>
    <button className="edit-btn el-flx" type="button" onClick={() => { navigateTo(1) }}>
      <IconWrapper name="PiGearSix" />
      Edit Profile</button>
  </>)
}

export default memo(ProfileTab);