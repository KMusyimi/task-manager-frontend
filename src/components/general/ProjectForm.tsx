import { lazy, memo, Suspense, useCallback, useDeferredValue, useState, type CSSProperties, type ReactNode } from "react";


const colorsArr = [
  '#89CFF0', "#6495ED",
  "#5D3FD3", '#CCCCFF',
  '#96DED1', '#F8C8DC',
  '#DC143C', '#D8BFD8',
  "#93C572", '#FFDEAD',
  "#E0115F", "#27907A",
  "#DDC8EF", "#5D013B"
]


const LoadColorsFieldset = () => import("../projects/ColorFieldset");
const ColorFieldset = lazy(LoadColorsFieldset);

const styles: CSSProperties = { minHeight: 0 };

interface FormParams {
  intent: 'add' | 'edit';
  currentColor: string
  onInput: (e: React.FormEvent<HTMLInputElement>) => void;
  children: ReactNode;
}

const ColorsSkeleton = memo(() => {
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
}) => {
  
  const colorKey = colorValue.replace(/^#/, '');
  const isChecked = colorValue === currentColor;

  return (
    <label htmlFor={colorKey} >
      <input
        key={colorKey}
        className="project-radio"
        id={colorKey}
        style={{ backgroundColor: colorValue }}
        onChange={onChange}
        checked={isChecked}
        type="radio"
        name="color"
        value={colorValue}
        required />
    </label>)
})

function ProjectFormComponents({ currentColor, intent, onInput, children }: FormParams) {
  const [isToggled, setIsToggled] = useState(false);

  const deferColorsArr = useDeferredValue(colorsArr);

  const toggle = useCallback(() => { setIsToggled(prev => !prev) }, []);

  const onMouseEnter = useCallback(() => {
    LoadColorsFieldset()
      .catch((e: unknown) => { console.error('Failed to prefetch component ', e) })
  }, []);
  const iconCls = isToggled ? 'dropdown-icon--active' : 'dropdown-icon';

  return (
    <>
      <div className="input-wrapper">
        <input type="hidden" name="intent" defaultValue={intent} />
        <label htmlFor="project-name" className="project-name--label">Project Name</label>
        <button
          type="button"
          className={'form-dropdown--btn'}
          onMouseEnter={onMouseEnter}
          onClick={toggle}>
          <span className="color-placeholder" style={{ backgroundColor: currentColor }}></span>
          <span className={iconCls}>&#8964;</span>
        </button>

        {children}

      </div>

      <div className={`bg-fieldset  ${isToggled ? 'open' : ''}`}>
        <fieldset className={'colors-fieldset'} style={styles}>
          {isToggled &&
            <Suspense fallback={<ColorsSkeleton />}>
              <ColorFieldset>
                {deferColorsArr.map(ArrColor => (
                  <ColorLabelInputs
                    key={ArrColor}
                    colorValue={ArrColor}
                    currentColor={currentColor}
                    onChange={onInput} />))}
              </ColorFieldset>
            </Suspense>}
        </fieldset>
      </div>
    </>

  )
}

ColorLabelInputs.displayName = 'ColorLabelInputs';
ColorsSkeleton.displayName = 'ColorsSkeleton';

export default memo(ProjectFormComponents);