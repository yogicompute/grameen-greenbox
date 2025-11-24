import React from "react"

type Props = {
  children: React.ReactNode
  className?: string
}

const MaxWidthContainer: React.FC<Props> = ({ children, className = "" }) => {
  return (
    <div className="w-full">
      {/* inner container: centered, responsive padding and max width */}
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl ${className}`.trim()}>
        {children}
      </div>
    </div>
  )
}

export default MaxWidthContainer