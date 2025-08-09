import React, { useState } from 'react'
import { auth } from '../firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, Sparkles, ArrowRight, AlertCircle, CheckCircle, Send, Shield } from 'lucide-react'

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
    info: "bg-purple-50 border-purple-200 text-purple-800",
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
      {variant === "info" && <Shield className="w-4 h-4" />}
      {children}
    </motion.div>
  )
}

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

// Success Animation Component
const SuccessAnimation = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Mail className="w-10 h-10 text-white" />
        </motion.div>
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-900 mb-2"
      >
        Check Your Email!
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 mb-6"
      >
        We've sent a password reset link to your email address.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <Alert variant="info">
          <div>
            <p className="font-medium mb-1">Next Steps:</p>
            <ol className="text-xs space-y-1 ml-4 list-decimal">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the reset link in the email</li>
              <li>Create a new password</li>
              <li>Sign in with your new password</li>
            </ol>
          </div>
        </Alert>
      </motion.div>
    </motion.div>
  )
}

// Main ForgotPassword Component
const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const navigate = useNavigate()

  // Cooldown timer effect
  React.useEffect(() => {
    let timer
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Basic validation
    if (!email) {
      setError('Please enter your email address')
      setIsLoading(false)
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/', // Redirect back to login after reset
        handleCodeInApp: false,
      })
      
      setSuccess(true)
      setCooldown(60) // 60 second cooldown before allowing another request
      
    } catch (err) {
      let errorMessage = 'Failed to send reset email. Please try again.'
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address. Please check your email or create a new account.'
          break
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Too many password reset requests. Please wait a few minutes before trying again.'
          setCooldown(300) // 5 minute cooldown for rate limiting
          break
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection and try again.'
          break
        case 'auth/internal-error':
          errorMessage = 'An internal error occurred. Please try again later.'
          break
        default:
          console.error('Password reset error:', err)
          errorMessage = 'Failed to send reset email. Please try again or contact support.'
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (cooldown > 0) return
    
    setError('')
    setIsLoading(true)
    
    try {
      await sendPasswordResetEmail(auth, email)
      setCooldown(60)
      setError('')
    } catch (err) {
      setError('Failed to resend email. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
          {!success ? (
            <>
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                  >
                    🔐
                  </motion.div>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Reset Password
                </h1>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password
                </p>
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
                onSubmit={handlePasswordReset}
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
                    placeholder="Enter your email address"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error && error.includes('email')}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading || cooldown > 0}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending Reset Link...
                      </div>
                    ) : cooldown > 0 ? (
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Wait {cooldown}s before retry
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Reset Link
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              {/* Security Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <Alert variant="info">
                  <div>
                    <p className="font-medium mb-1">Security Notice:</p>
                    <p className="text-xs">
                      For your security, password reset links expire after 1 hour. 
                      If you don't receive an email, check your spam folder.
                    </p>
                  </div>
                </Alert>
              </motion.div>

              {/* Back to Login */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 text-center"
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Back to Sign In
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              {/* Success State */}
              <SuccessAnimation />

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={isLoading || cooldown > 0}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                      Resending...
                    </div>
                  ) : cooldown > 0 ? (
                    `Resend in ${cooldown}s`
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Resend Email
                    </div>
                  )}
                </Button>

                <Button
                  onClick={() => navigate('/')}
                  variant="ghost"
                  size="lg"
                  className="w-full"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Sign In
                </Button>
              </motion.div>
            </>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center"
          >
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

export default ForgotPassword
