import { useCallback, useState } from "react";

export function useToggleSubTask() {
  const [isOpen, setIsOpen] = useState<Record<number, boolean>>({});

  const onToggle = useCallback((e: React.MouseEvent<HTMLDivElement>, taskID: number) =>
  {
    e.stopPropagation();
    setIsOpen((prev) => ({ ...prev, [taskID]: !prev[taskID] }))
  }, []);

  return {isOpen, onToggle}
}