interface HeaderProps {
  children: React.ReactNode
  className?:string
  heading?:string
}


export default function Header({ className, heading,children, ...rest }: HeaderProps) {
  return (
    <header className={className} {...rest}>
      <h1>{heading}</h1>
      {children}
    </header>)
}