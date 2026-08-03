import { useCallback, useState } from "react";

export function useTabNavigation()
{

  const [[activeIdx, direction], setActiveTab] = useState([0, 0]);
  const navigateTo = useCallback((newIdx: number) =>
  {

    if (newIdx > activeIdx)
    {
      setActiveTab([newIdx, 1]);
    } else if (newIdx < activeIdx)
    {
      setActiveTab([newIdx, -1]);
    }
  }, [activeIdx]);


  return { activeIdx, direction, navigateTo }

}