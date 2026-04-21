import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AsideProject } from "../../models/ProjectsModel";

export interface MenuPosition {
  top: string | number
  left: string | number
}

export interface ContextMenuState {
  isMenuOpen: boolean;
  position: MenuPosition;
  formData: { payloadID: string; projectName: string; color: string };
  displayMenu: (e: React.MouseEvent<HTMLButtonElement>, project: AsideProject) => void;
  closeMenu: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ContextMenuCtx = createContext<ContextMenuState>({
  isMenuOpen: false,
  position: { top: 0, left: 0 },
  formData: {
    'projectName': "",
    'color': "",
    'payloadID': "",

  },
  displayMenu: function (): void {
    throw new Error("Function not implemented.");
  },
  closeMenu: function (): void {
    throw new Error("Function not implemented.");
  }
})

export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 });
  const [formData, setFormData] = useState(() => ({ payloadID: '', projectName: '', color: '' }));


  const closeMenu = useCallback(() => { setIsMenuOpen(false) }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleLayoutChange = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener('resize', handleLayoutChange);

    return () => {
      window.removeEventListener('resize', handleLayoutChange);

    };
  }, [isMenuOpen]);


  const displayMenu = useCallback((e: React.MouseEvent<HTMLButtonElement>, project: AsideProject) => {
    e.stopPropagation();

    const { top, bottom, left } = e.currentTarget.getBoundingClientRect();
    const menuHeight = 150;
    const spaceBelow = window.innerHeight - bottom;

    setIsMenuOpen(true);

    setFormData(prev => ({
      ...prev,
      payloadID: project.projectID.toString(),
      projectName: project.projectName,
      color: project.color
    }));

    setPosition({
      top: spaceBelow < menuHeight ? top - menuHeight : bottom + 5,
      left: left - 40
    });

  }, []);

  const memoData = useMemo(() => ({ isMenuOpen, position, formData, displayMenu, closeMenu }), [closeMenu, displayMenu, formData, isMenuOpen, position])

  return (
    <ContextMenuCtx value={memoData}>
      {children}
    </ContextMenuCtx>)

}

