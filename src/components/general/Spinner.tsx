import { memo, ReactNode } from "react";
import Overlay from "./Overlay";
import './style/Spinner.css';


const circle = Array.from<unknown>({ length: 12 });

export const RouterElSpinner = memo(() => {
  return (
    <Overlay isActive={true} zIndex={500}>
      <Spinner>
        <p className="loading-text">Loading...</p>
      </Spinner>
    </Overlay>
  )
})


function Spinner({ children }: { children?: ReactNode }) {

  return (
    <div className="spinner-container">
      <div className="sk-fading-circle">
        {circle.map((_, i) => (
          <div
            key={`sp-${i.toString()}`}
            className={`sk-circle${(i + 1).toString()} sk-circle`} />
        ))}
      </div>
      {children}
    </div>
  )
}

RouterElSpinner.displayName = 'RouterElSpinner';

export default memo(Spinner);