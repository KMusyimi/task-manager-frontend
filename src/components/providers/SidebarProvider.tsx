import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";

export interface ContextParams {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SidebarCtx = createContext<ContextParams>({
  isSidebarOpen: false,
  openSidebar: function (): void {
    throw new Error("Function not implemented.");
  },
  closeSidebar: function (): void {
    throw new Error("Function not implemented.");
  }
});


export default function SidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => { setIsSidebarOpen(true) }, []);
  const closeSidebar = useCallback(() => { setIsSidebarOpen(false) }, []);

  const value = useMemo(() => ({
    isSidebarOpen,
    openSidebar,
    closeSidebar
  }), [isSidebarOpen, openSidebar, closeSidebar]);
  return (
    <SidebarCtx value={value}>
      {children}
    </SidebarCtx>
  )
}