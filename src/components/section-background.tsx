interface BackgroundProps {
  invert?: boolean
  children: React.ReactNode
}

export function Background({ children, invert }: BackgroundProps) {
  return (
    <div
      className={`w-full ${invert ? 'bg-gift bg-cover bg-center text-background' : 'bg-transparent'}`}
    >
      {children}
    </div>
  )
}
