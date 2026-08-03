import { createContext, MouseEventHandler, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AsideProject, Task } from "../../models/DashboardModel";

export interface MenuPosition
{
  top: string | number
  left: string | number
}

export interface OptionsParams
{
  label: string;
  onClick?: MouseEventHandler;
  onMouseEnter?: MouseEventHandler;
}


export interface ContextMenuState
{
  isMenuOpen: boolean;
  position: MenuPosition;
  formData: { payloadID: string; projectName: string; color: string };
  displayMenu: (e: React.MouseEvent<HTMLButtonElement>, project: AsideProject) => void;
  closeMenu: () => void;
}

type CtxMenuData = AsideProject | Task


// eslint-disable-next-line react-refresh/only-export-components
export const ContextMenuCtx = createContext<ContextMenuState>({
  isMenuOpen: false,
  position: { top: 0, left: 0 },
  formData: {
    'projectName': "",
    'color': "",
    'payloadID': "",

  },

  displayMenu: function (): void
  {
    throw new Error("Function not implemented.");
  },
  closeMenu: function (): void
  {
    throw new Error("Function not implemented.");
  }
})


export function ContextMenuProvider({ children }: { children: ReactNode })
{
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 });
  const [formData, setFormData] = useState(() => ({ payloadID: '', projectName: '', color: '' }));

  const closeMenu = useCallback(() => { setIsMenuOpen(false) }, []);

  useEffect(() =>
  {
    if (!isMenuOpen) return;

    const handleLayoutChange = () =>
    {
      setIsMenuOpen(false);
    };

    window.addEventListener('resize', handleLayoutChange);

    return () =>
    {
      window.removeEventListener('resize', handleLayoutChange);
    };
  }, [isMenuOpen]);

  

  const displayMenu = useCallback((e: React.MouseEvent<HTMLButtonElement>, data: CtxMenuData) =>
  {
    e.stopPropagation();

    setIsMenuOpen(true);
    const { top, bottom, left } = e.currentTarget.getBoundingClientRect();
    const menuHeight = 135;

    const spaceBelow = window.innerHeight - bottom;

    setPosition({
      top: spaceBelow < menuHeight ? top - menuHeight : bottom + 5,
      left: left - 65
    });

    if ('projectID' in data)
    {
      setFormData(prev => ({
        ...prev,
        payloadID: data.projectID.toString(),
        projectName: data.projectName,
        color: data.color
      }));
    }

  }, []);

  const memoData = useMemo(() => ({ isMenuOpen, position, formData, displayMenu, closeMenu }), [closeMenu, displayMenu, formData, isMenuOpen, position])

  return (
    <ContextMenuCtx value={memoData}>
      {children}
    </ContextMenuCtx>)
}
