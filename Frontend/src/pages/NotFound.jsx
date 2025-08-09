import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search, Sparkles, RefreshCw } from 'lucide-react'

// Utility function for class names
const cn = (...inputs) => {
  return inputs.filter(Boolean).join(' ')
}

// UI Components
const Button = React.forwardRef(({ className, variant = "default", size = "default", disabled, children, ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg",
    outline: "border-2 border-purple-200 bg-white hover:bg-purple-50 text-purple-700 hover:border-purple-300",
    ghost: "hover:bg-purple-50 text-purple-700",
  }
  
  const sizes = {
    default: "h-12 px-6 py-3",
    sm: "h-9 rounded-md px-3 text-sm",
    lg: "h-14 rounded-xl px-8 text-lg",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed hover:scale-100",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = "Button"

// Floating Animation Shapes
const FloatingShapes = () => {
  const shapes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 30,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full bg-gradient-to-r from-purple-200 to-pink-200 opacity-10 mix-blend-multiply filter blur-xl"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 300 - 150, 0],
            y: [0, Math.random() * 300 - 150, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Glitch Text Effect
const GlitchText = ({ children, className }) => {
  return (
    <div className={cn("relative inline-block", className)}>
      <motion.span
        className="relative z-10"
        animate={{
          textShadow: [
            "0 0 0 transparent",
            "2px 0 0 #ff00ff, -2px 0 0 #00ffff",
            "0 0 0 transparent",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        {children}
      </motion.span>
    </div>
  )
}

// Custom 404 Illustration Component
const Custom404Illustration = () => {
  return (
    <div className="relative w-80 h-60 md:w-96 md:h-72 rounded-2xl overflow-hidden shadow-2xl bg-white p-4">
      <img
        src="/images/404.gif"
        alt="404 Not Found Illustration"
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback if image doesn't load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      {/* Fallback content if image fails to load */}
      <div className="hidden w-full h-full items-center justify-center text-6xl">
        🤷‍♂️
      </div>
    </div>
  )
}

// Main 404 Component
const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4 relative overflow-hidden">
      <FloatingShapes />
      
      <div className="max-w-4xl w-full text-center z-10">
        {/* Header with Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ChatBot AI
            </span>
          </div>
        </motion.div>

        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <GlitchText className="text-8xl md:text-9xl font-black text-gray-200 select-none">
            404
          </GlitchText>
        </motion.div>

        {/* Custom Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="shadow-2xl rounded-2xl"
          >
            <Custom404Illustration />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Looks like you've wandered into uncharted territory. The page you're looking for 
            seems to have gone on an adventure without us!
          </p>
          <p className="text-gray-500">
            Don't worry, even our AI gets lost sometimes. Let's get you back on track.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <Button
            onClick={handleGoHome}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Button>
          
          <Button
            onClick={handleGoBack}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
          
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </Button>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <Search className="w-4 h-4" />
            <span>Try searching for what you need, or</span>
            <button
              onClick={handleGoHome}
              className="text-purple-600 hover:text-purple-700 font-medium underline transition-colors"
            >
              start a new conversation
            </button>
          </div>
        </motion.div>

        
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
    </div>
  )
}

export default NotFound
