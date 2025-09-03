import React, { useState } from "react";
import type { ProjectFormParams } from "../entities/entity";
import { defaultColors } from "../utils/utils";


interface ColorPickerProps {
  formState: ProjectFormParams;
  handleOnInput: (e: React.FormEvent<HTMLInputElement>) => void
}

export default function ColorPicker({ formState, handleOnInput }: ColorPickerProps) {
  const radioStyles: React.CSSProperties = {
    appearance: "none",
    width: '1rem',
    height: '1rem',
    borderRadius: '50%'
  }
  const [colors,] = useState(() => [...defaultColors]);

  return (
    <fieldset className="color-picker">
      <legend>Color</legend>
      {colors.map((color, idx) => {
        return (
          <input
            key={`${color}-${idx.toString()}`}
            id={color}
            style={{ ...radioStyles, backgroundColor: color }}
            onChange={handleOnInput}
            checked={formState.color === color}
            type="radio" name="color" value={color} required />)
      })}
    </fieldset>)
}