interface ContainerProps {
  children: React.ReactNode
  className?: string
}
const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 ${className}`}>
      {children}
    </div>
  )
}

export default Container
