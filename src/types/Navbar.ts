export interface NavLink {
  href: string
  text: string
  target: string
}

export interface ResponsiveAppBarProps {
  list?: NavLink[]
  logo: string
  endComponent?: React.ReactNode
  copyright: string
}
