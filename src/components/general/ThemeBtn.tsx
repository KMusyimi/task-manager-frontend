import { CSSProperties, memo } from "react";
import { useThemeContext } from "../../hooks/ProviderHooks";
import IconWrapper from "./IconWrapper";

const style: CSSProperties = {
  backgroundColor: 'var(--secondary-grey)',
  fontSize: '1rem',
  padding: '.6em',
  borderRadius: '.8em'
}


function ThemeBtn()
{
  const { currentTheme, toggleTheme } = useThemeContext();
  return (<button type="button" className="theme-btn" onClick={toggleTheme}
    style={style}>
    <IconWrapper name={currentTheme === 'light' ? 'LuMoon' : 'IoSunnyOutline'} className="theme-icon" />
  </button>)
}

export default memo(ThemeBtn);