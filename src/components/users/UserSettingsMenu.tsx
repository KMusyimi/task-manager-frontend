import { memo, use, useCallback, useState, type CSSProperties } from "react";

import IconWrapper from "../general/IconWrapper";
import { ThemeContext } from "../providers/ThemeProvider";

const styles: CSSProperties = { rotate: '90deg' };

function UserSettingsMenu() {
  const { currentTheme, toggleTheme } = use(ThemeContext);
  
  const [isOpenThemeMenu, setIsOpenThemeMenu] = useState(false);
  const [isOpenLangMenu, setIsOpenLangMenu] = useState(false);

  const handleThemeSubMenu = useCallback(() => {
    setIsOpenThemeMenu(prev => !prev);
  }, []);

  const handleLangSubMenu = useCallback(() => {
    setIsOpenLangMenu(prev => !prev);
  }, []);

  return (<>
    <ul className={`settings-list`}>
      <li className={"settings-items"}>
        <span>Theme</span>

        <div>
          <button type="button"
            className="dropdown-btn"
            disabled={isOpenLangMenu}
            onClick={handleThemeSubMenu}>
            <span className="selected-item">{currentTheme}</span>

            <IconWrapper name='FaAngleRight' style={styles} />

          </button>

          <div className={`dropdown-content ${isOpenThemeMenu ? 'open' : ''}`}>
            {isOpenThemeMenu &&
              <>
                <button type="button"
                  className="theme-btn"
                  disabled={currentTheme === 'light'}
                  onClick={toggleTheme}
                >Light</button>
                <button type="button"
                  className="theme-btn"
                  disabled={currentTheme === 'dark'}
                  onClick={toggleTheme}
                >Dark</button>
              </>}
          </div>
        </div>
      </li>


      <li className={"settings-items"}>
        <span>Language</span>
        <div>

          <button type="button"
            className="dropdown-btn"
            disabled={isOpenThemeMenu}
            onClick={handleLangSubMenu}>
            <span className="selected-item">Eng</span>
            <IconWrapper name='FaAngleRight' style={styles} />
          </button>

          <div className={`dropdown-content ${isOpenLangMenu ? 'open' : ''}`}>
            {isOpenLangMenu && <li>eng</li>}
          </div>
        </div>
      </li>
      
    </ul>
  </>
  )
}

export default memo(UserSettingsMenu);