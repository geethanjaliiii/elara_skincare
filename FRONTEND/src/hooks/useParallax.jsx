import { useEffect, useState } from 'react'

export function useParallax(speed = 0.1) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return {
    transform: `translateY(${offset * speed}px)`,
  }
}

