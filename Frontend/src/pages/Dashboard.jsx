import React, { useState, useEffect, useRef } from 'react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, LogOut, Sparkles, Send, Mic, Paperclip } from 'lucide-react'

// Utility function for class names
const cn = (...inputs) => {
  return inputs.filter(Boolean).join(' ')
}

// UI Components
const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gray-100",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3 text-sm",
    lg: "h-11 rounded-md px-8",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

// Chat Components
const ChatHeader = ({ user, onLogout }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50"
    >
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ChatBot AI
              </h1>
              <p className="text-xs text-gray-500">Powered by Advanced AI</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
              <Avatar className="w-9 h-9 ring-2 ring-purple-100">
                <AvatarImage src={user.photoURL || "/placeholder.svg"} alt={user.displayName} />
                <AvatarFallback className="bg-purple-600 text-white text-sm">
                  {user.displayName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

const ChatMessage = ({ message, reply, user, index }) => {
  return (
    <div className="space-y-4">
      {/* User Message */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex items-start gap-3 justify-end"
      >
        <Card className="max-w-[80%] md:max-w-[70%] bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 shadow-lg">
          <div className="p-4">
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
        </Card>
        <Avatar className="w-8 h-8 ring-2 ring-blue-100">
          <AvatarImage src={user.photoURL || "/placeholder.svg"} alt={user.displayName} />
          <AvatarFallback className="bg-blue-600 text-white text-xs">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </motion.div>

      {/* AI Reply */}
      {reply && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className="flex items-start gap-3"
        >
          <Avatar className="w-8 h-8 ring-2 ring-purple-100">
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <Card className="max-w-[80%] md:max-w-[70%] bg-white border shadow-lg">
            <div className="p-4">
              <p className="text-sm leading-relaxed text-gray-700">{reply}</p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
    >
      <Avatar className="w-8 h-8 ring-2 ring-purple-100">
        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Bot className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <Card className="bg-white border shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

const ChatInput = ({ message, setMessage, onSendMessage, isThinking }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSendMessage()
    }
  }

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-0 backdrop-blur-xl bg-white/80 border-t border-gray-200/50 p-4"
    >
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-0 bg-white/90">
          <div className="p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  className="pr-20 py-3 text-sm border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isThinking}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-gray-100"
                    disabled={isThinking}
                  >
                    <Paperclip className="w-4 h-4 text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-gray-100"
                    disabled={isThinking}
                  >
                    <Mic className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={onSendMessage}
                disabled={!message.trim() || isThinking}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </motion.footer>
  )
}

// Main Dashboard Component
const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [chatLog, setChatLog] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        loadHistory(currentUser.uid)
      } else {
        navigate('/')
      }
    })
    return () => unsubscribe()
  }, [navigate])

  // Load chat history
  const loadHistory = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/history/${userId}`)
      setChatLog(res.data.reverse())
    } catch (err) {
      console.error('Failed to load history', err)
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!message.trim() || !user) return

    const newEntry = { message, reply: '' }
    setChatLog((prev) => [...prev, newEntry])
    setMessage('')
    setIsThinking(true)

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        userId: user.uid,
        username: user.displayName,
        message,
      })
      setChatLog((prev) => {
        const updated = [...prev]
        updated[updated.length - 1].reply = res.data.reply
        return updated
      })
    } catch (err) {
      console.error('Chat error:', err)
      // Handle error - you might want to show an error message to the user
      setChatLog((prev) => {
        const updated = [...prev]
        updated[updated.length - 1].reply = 'Sorry, there was an error processing your message. Please try again.'
        return updated
      })
    } finally {
      setIsThinking(false)
    }
  }

  // Logout
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/')
    })
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatLog, isThinking])

  // Show loading state while user is being authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="flex flex-col h-screen">
        <ChatHeader user={user} onLogout={handleLogout} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="space-y-6">
              <AnimatePresence>
                {chatLog.map((chat, index) => (
                  <ChatMessage
                    key={index}
                    message={chat.message}
                    reply={chat.reply}
                    user={user}
                    index={index}
                  />
                ))}
              </AnimatePresence>
              
              {isThinking && <TypingIndicator />}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </main>

        <ChatInput
          message={message}
          setMessage={setMessage}
          onSendMessage={sendMessage}
          isThinking={isThinking}
        />
      </div>
    </div>
  )
}

export default Dashboard
