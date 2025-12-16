import React from "react"

export function GasCylinderIcon(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  return (
    <>
      {/* Light mode */}
      <img
        src="https://res.cloudinary.com/dectxiuco/image/upload/v1765895359/gaz-whitemode-removebg-preview_elli0n.png"
        alt="Gas Cylinder Icon"
        className="w-4 h-4 block dark:hidden"
        {...props}
      />
    </>
  )
}
