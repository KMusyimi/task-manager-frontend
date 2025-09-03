interface OptProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export default function OptionsMenu({ children, ...rest }: OptProps) {
  return (
    // TODO: add an overlay
    <>
      <div className="options-menu" {...rest}>
        {children}
      </div>
    </>
  )
}