import { memo } from "react";
import './style/Spinner.css';


const circle = Array.from<unknown>({ length: 12 });

function Spinner() {

  return (
    <div className="sk-fading-circle">
      {circle.map((_, i) => (
        <div
          key={`sp-${i.toString()}`}
          className={`sk-circle${(i + 1).toString()} sk-circle`} />
      ))}
    </div>
  )
}

export default memo(Spinner);