import type React from "react";

interface NavProps {
  children: React.ReactNode
  className?: string
}



export default function Nav({className,children, ...rest}:NavProps) {
  return(<nav className={className} {...rest}>{children}</nav>)
}