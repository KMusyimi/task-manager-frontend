import { memo, ReactNode, useCallback, useState } from "react";

import IconWrapper from "../general/IconWrapper";

import { useThemeContext } from "../../hooks/ProviderHooks";
import { Theme } from "../providers/ThemeProvider";
import { usePopoverByIdx } from "../../hooks/Popover";

interface DropdownParams
{
  idx: number;
  title: string;
  isOpen: boolean;
  selectedOption: "eng" | Theme;
  children: ReactNode;
  onToggle: (idx: number, isOpen: boolean) => void;

}

const SETTINGS_CONFIG = [{
  id: 0, title: 'Theme', contents: [
    { id: 'light', label: 'light' },
    { id: 'dark', label: 'dark' }
  ]
},
{
  id: 1, title: 'Language', contents: [
    { id: 'eng', label: 'eng' }]
}]



const DropdownItem = memo(({ idx, isOpen, selectedOption, onToggle, children }: DropdownParams) =>
{
  const popoverRef = usePopoverByIdx(idx, onToggle);

  const targetID = `${String(idx)}-dropdown`;
  const anchorName = `--${String(idx)}-btn`;


  return (<>
    <div className="dropdown-container" style={{ position: 'relative' }}>
      <button
        type="button"
        popoverTarget={targetID}
        className="dropdown-btn el-flx"
        aria-expanded={isOpen}
        style={{ anchorName }}>
        <span className="selected-item">{selectedOption}</span>
        <IconWrapper name={isOpen ? 'FiChevronUp' : 'FiChevronDown'} />
      </button>
    </div>

    <div
      id={targetID}
      ref={popoverRef}
      popover='auto'
      onClick={(e) => { e.stopPropagation() }}
      className={`dropdown-menu`}
      style={{
        // position: "fixed",
        margin: 0,
        inset: 'auto',
        positionAnchor: anchorName,
        positionTryFallbacks: 'flip-block, flip-inline',
        marginBlockStart: 6,
        top: 'anchor(bottom)',
        right: 'anchor(right)',
        cursor: 'pointer',
      }}>
      {children}
    </div>
  </>)
})



function SettingsTab()
{
  const { currentTheme, toggleTheme } = useThemeContext();

  const [toggleDropdown, setToggleDropdown] = useState<Record<number, boolean>>({});


  const onToggle = useCallback((idx: number, isOpen: boolean) =>
  {
    setToggleDropdown(prev => ({ ...prev, [idx]: isOpen }));

  }, []);


  return (
    <div className="tab-section settings">
      <div className="field-wrapper">
        <span className="field-title">User Preferences</span>
      </div>
      <div className="field-wrapper">

        {SETTINGS_CONFIG.map((config, idx) =>
        {
          const title = config.title.toLocaleLowerCase();
          const isTheme = title === 'theme';
          const selectedOption = isTheme ? currentTheme : 'eng';
          const isOpen = toggleDropdown[idx];

          return (
            <div key={config.id} className={"field-text--wrapper el-flx"} style={{ position: 'relative' }}>
              <span className="field-label">{config.title}</span>
              <DropdownItem
                idx={idx}
                isOpen={isOpen}
                selectedOption={selectedOption}
                title={title}
                onToggle={onToggle}
              >
                {config.contents.map(item => (
                  <div
                    key={item.id}
                    className={`dropdown-item ${selectedOption === item.label ? 'disabled' : ''}`}
                    role="button"
                    aria-roledescription='button'
                    aria-disabled={selectedOption === item.id}
                    onClick={isTheme ? toggleTheme : undefined}>
                    <span className="item-label">{item.label}</span>
                    <div className="divider" />
                  </div>
                ))}
              </DropdownItem>
            </div>)
        })}
      </div>
    </div >
  )
}

DropdownItem.displayName = 'DropdownItem';

export default memo(SettingsTab);