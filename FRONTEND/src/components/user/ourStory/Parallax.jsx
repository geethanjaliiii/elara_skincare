
import { motion } from 'framer-motion'
import { useParallax } from '@/hooks/useParallax'

export function ParallaxBackground() {
  const parallaxStyle1 = useParallax(0.2)
  const parallaxStyle2 = useParallax(0.1)
  const parallaxStyle3 = useParallax(0.15)

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      >
        <svg width="100%" height="100%">
          <motion.circle
            cx="10%"
            cy="10%"
            r="50"
            fill="#4CAF50"
            style={parallaxStyle1}
          />
          <motion.rect
            x="80%"
            y="60%"
            width="100"
            height="100"
            fill="#8BC34A"
            style={parallaxStyle2}
          />
          <motion.path
            d="M 50 350 L 100 50 L 150 350 Z"
            fill="#CDDC39"
            style={parallaxStyle3}
          />
        </svg>
      </motion.div>
    </div>
  )
}

