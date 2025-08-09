import React, { useState } from 'react'
import { auth, provider } from '../firebase'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'

// Utility function for class names
const cn = (...inputs) => {
  return inputs.filter(Boolean).join(' ')
}

// UI Components
const Button = React.forwardRef(({ className, variant = "default", size = "default", disabled, children, ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg",
    outline: "border-2 border-purple-200 bg-white hover:bg-purple-50 text-purple-700 hover:border-purple-300",
    google: "border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-300 shadow-sm",
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

const Input = React.forwardRef(({ className, type, error, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border-2 bg-white/50 backdrop-blur-sm px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          Icon ? "pl-11" : "pl-4",
          error 
            ? "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500" 
            : "border-gray-200 focus-visible:border-purple-500 hover:border-gray-300",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
})
Input.displayName = "Input"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-xl text-gray-950 shadow-xl",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

// Alert Component
const Alert = ({ variant = "default", children, className }) => {
  const variants = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "relative w-full rounded-xl border px-4 py-3 text-sm flex items-center gap-2",
        variants[variant],
        className
      )}
    >
      {variant === "destructive" && <AlertCircle className="w-4 h-4" />}
      {variant === "success" && <CheckCircle className="w-4 h-4" />}
      {children}
    </motion.div>
  )
}

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

// Floating Animation Shapes
const FloatingShapes = () => {
  const shapes = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full bg-gradient-to-r from-purple-200 to-pink-200 opacity-20 mix-blend-multiply filter blur-xl"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, 0],
            scale: [1, 1.2, 1],
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

// Main Login Component
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setSuccess(true)
      
      // Delay navigation to show success state
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.'
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address'
          break
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.'
          break
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address'
          break
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled. Please contact support.'
        break
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password. Please check your credentials.'
        break
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed login attempts. Please wait a few minutes before trying again, or reset your password.'
        break
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your internet connection and try again.'
        break
      case 'auth/internal-error':
        errorMessage = 'An internal error occurred. Please try again later.'
        break
      default:
        // For any other errors, show a generic message but log the actual error
        console.error('Login error:', err)
        errorMessage = 'Login failed. Please try again or contact support if the problem persists.'
    }
    
    setError(errorMessage)
  } finally {
    setIsLoading(false)
  }
}

  const handleGoogleLogin = async () => {
    setError('')
    setIsGoogleLoading(true)

    try {
      await signInWithPopup(auth, provider)
      setSuccess(true)
      
      // Delay navigation to show success state
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      let errorMessage = 'Google sign-in failed. Please try again.'
      
      switch (err.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in was cancelled'
          break
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked. Please allow popups and try again.'
          break
      case 'auth/cancelled-popup-request':
        errorMessage = 'Sign-in was cancelled. Please try again.'
        break
      case 'auth/too-many-requests':
        errorMessage = 'Too many requests. Please wait a few minutes before trying again.'
        break
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your internet connection.'
        break
      case 'auth/internal-error':
        errorMessage = 'An internal error occurred. Please try again later.'
        break
      default:
        console.error('Google login error:', err)
        errorMessage = 'Google sign-in failed. Please try again or use email login.'
    }
    
    setError(errorMessage)
  } finally {
    setIsGoogleLoading(false)
  }
}

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-4">Redirecting to your dashboard...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4 relative">
      <FloatingShapes />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full z-10"
      >
        <Card className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                ✨
              </motion.div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to continue your AI conversations</p>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div className="mb-6">
                <Alert variant="destructive">
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleEmailLogin}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error && error.includes('email')}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error && error.includes('password')}
                  className="pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="my-6"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </motion.div>

          {/* Google Login */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              type="button"
              variant="google"
              size="lg"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <GoogleIcon />
                  Sign in with Google
                </div>
              )}
            </Button>
          </motion.div>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 space-y-4 text-center"
          >
            <Link
              to="/forgot-password"
              className={cn(
                "block text-sm font-medium transition-colors",
                error && error.includes('too many requests') 
                  ? "text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg border border-red-200" 
                  : "text-purple-600 hover:text-purple-700"
              )}
            >
              {error && error.includes('too many requests') 
                ? "🔐 Reset your password instead" 
                : "Forgot your password?"
              }
            </Link>
            
            <div className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors inline-flex items-center gap-1 group"
              >
                Sign up here
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Login
