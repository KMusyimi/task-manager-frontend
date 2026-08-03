import { lazy, memo, Suspense, useDeferredValue, type CSSProperties, type ReactNode } from "react";


const colorsArr = [
  '#89CFF0', "#6495ED",
  "#5D3FD3", '#CCCCFF',
  '#96DED1', '#F8C8DC',
  '#DC143C', '#D8BFD8',
  "#93C572", '#FFDEAD',
  "#E0115F", "#27907A",
  "#DDC8EF", "#5D013B"
]


const LoadColorsFieldset = () => import("./ColorFieldset");
const ColorFieldset = lazy(LoadColorsFieldset);

interface DynamicStyles extends CSSProperties
{
  '--input-color'?: string;
  '--after-color'?: string;
}

const styles: CSSProperties = { minHeight: 0 };

interface FormParams
{
  currentColor: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
}

const ColorsSkeleton = memo(() =>
{
  return (
    <div className="colors-fieldset" style={styles}>
      <legend className="skeleton skeleton-line" ></legend>
      <div className="colors-wrapper skeleton" />
    </div>)
})

const ColorLabelInputs = memo(({ colorValue, currentColor, onChange }: {
  colorValue: string,
  currentColor: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) =>
{

  const colorKey = colorValue.replace(/^#/, '');
  const isChecked = colorValue === currentColor;
  const style: DynamicStyles = {
    '--after-color': `color-mix(in srgb, var(--text-color) 20%, ${colorValue} 60%)`
    , '--input-color': colorValue
  }
  return (
    <label htmlFor={colorKey} >
      <input
        key={colorKey}
        className="project-radio el-flx"
        id={colorKey}
        style={style}
        onChange={onChange}
        checked={isChecked}
        type="radio"
        name="color"
        value={colorValue}
        required />
    </label>)
})

function ProjectFormComponents({ currentColor, onChange, children }: FormParams)
{
  const deferColorsArr = useDeferredValue(colorsArr);

  return (
    <>
      
      <div className="input-wrapper el-flx">
        <span className="color-placeholder" style={{ backgroundColor: currentColor, width:".75rem", height:'.75rem' }}></span>
        {children}
      </div>

      <div className={"bg-fieldset"}>
        <fieldset className={'colors-fieldset'} style={styles}>
          <Suspense fallback={<ColorsSkeleton />}>
            <ColorFieldset>
              {deferColorsArr.map(ArrColor => (
                <ColorLabelInputs
                  key={ArrColor}
                  colorValue={ArrColor}
                  currentColor={currentColor}
                  onChange={onChange} />))}
            </ColorFieldset>
          </Suspense>
        </fieldset>
      </div>
    </>

  )
}

ColorLabelInputs.displayName = 'ColorLabelInputs';
ColorsSkeleton.displayName = 'ColorsSkeleton';

export default memo(ProjectFormComponents);