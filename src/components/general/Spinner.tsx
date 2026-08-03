import { CSSProperties, memo, ReactNode } from "react";
import Overlay from "./Overlay";


const circle = Array.from<unknown>({ length: 12 });

export const RouterElSpinner = memo(() =>
{
  return (
    <Overlay isActive={true} zIndex={500}>
      <Spinner>
        <p className="loading-text">Loading...</p>
      </Spinner>
    </Overlay>
  )
})


function Spinner({ style, children }: { children?: ReactNode, style?:CSSProperties })
{

  return (
    <div className="spinner-container">
      <div className="sk-fading-circle" style={{marginBottom: '1em', ...style}}>
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