import { useEffect, useRef } from "react";

export function usePopoverByIdx(idx: number, onToggleByIdx: (idx: number, isOpen: boolean) => void)
{
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() =>
  {
    const dropdown = popoverRef.current;

    if (!dropdown) return;

    const handleToggle = (e: Event) =>
    {
      const toggleEvent = e as ToggleEvent;
      const isSystemOpen = toggleEvent.newState === 'open';
      onToggleByIdx(idx, isSystemOpen);
    }

    dropdown.addEventListener('toggle', handleToggle);
    return () =>
    {
      dropdown.removeEventListener('toggle', handleToggle);
    }
  }, [idx, onToggleByIdx]);

  return popoverRef

}


export function usePopover(onToggle: (isOpen: boolean) => void)
{
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() =>
  {
    const dropdown = popoverRef.current;

    if (!dropdown) return;

    const handleToggle = (e: Event) =>
    {
      const toggleEvent = e as ToggleEvent;
      const isSystemOpen = toggleEvent.newState === 'open';
      onToggle(isSystemOpen);
    }

    dropdown.addEventListener('toggle', handleToggle);
    return () =>
    {
      dropdown.removeEventListener('toggle', handleToggle);
    }
  }, [onToggle]);

  return popoverRef

}