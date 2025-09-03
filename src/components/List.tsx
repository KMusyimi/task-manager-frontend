import type React from "react"

interface ListProps {
  className: string
  children: React.ReactNode
}


export default function List({className, children, ...rest }: ListProps) {
  return (
    <li className={className} {...rest}>
      {children}
    </li>)
}