"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (

    <button
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  className="relative w-16 h-8 rounded-full bg-gray-700 flex items-center transition duration-300"
>

  <div
    className={`absolute w-7 h-7 bg-white rounded-full shadow-md transform transition duration-300 flex items-center justify-center text-sm
    ${theme === "dark" ? "translate-x-8" : "translate-x-1"}`}
  >
    {theme === "dark" ? "🌙" : "☀"}
  </div>

</button>
  )
}