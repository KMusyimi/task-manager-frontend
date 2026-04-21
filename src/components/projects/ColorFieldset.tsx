import { memo, type ReactNode } from "react";


interface ColorPickerProps {
  children: ReactNode;
}



function ColorsFieldset({ children }: ColorPickerProps) {
  return (
    <>
      <legend>Pick a Color</legend>
      <div className="colors-wrapper">
        {children}
      </div>
    </>
  )
}

export default memo(ColorsFieldset);