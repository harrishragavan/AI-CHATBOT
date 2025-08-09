import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Play, Trophy, Users, Code, History } from 'lucide-react';
import QuizInterface from "@/components/quiz-interface"
import QuizResults from "@/components/quiz-results"
import QuizJoin from "@/components/quiz-join"
import QuizDashboard from "@/components/quiz-dashboard"
import QuizHistory from "@/components/quiz-history"
import * as XLSX from 'xlsx'
import DownloadTemplate from "@/components/download-template"

export default function QuizApp() {
  const [quizData, setQuizData] = useState(null)
  const [currentView, setCurrentView] = useState('home')
  const [quizResults, setQuizResults] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [quizSessions, setQuizSessions] = useState([])
  const [currentSession, setCurrentSession] = useState(null)
  const [participantName, setParticipantName] = useState('')

  // Load saved data on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('quizSessions')
    if (savedSessions) {
      setQuizSessions(JSON.parse(savedSessions))
    }
  }, [])

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quizSessions', JSON.stringify(quizSessions))
  }, [quizSessions])

  const handleFileUpload = async (file) => {
    try {
      let data
      
      if (file.name.endsWith('.json')) {
        const text = await file.text()
        data = JSON.parse(text)
      } else if (file.name.endsWith('.csv')) {
        const text = await file.text()
        data = parseCSV(text)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const arrayBuffer = await file.arrayBuffer()
        data = parseExcel(arrayBuffer)
      } else {
        throw new Error(
          'Unsupported file format. Please use Excel (.xlsx, .xls), CSV, or JSON files.'
        )
      }
      
      if (!data.title || !data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid quiz format. Please check your file structure.')
      }
      
      setQuizData(data)
      setCurrentView('dashboard')
    } catch (error) {
      alert(
        `Error parsing quiz file: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim())
    if (lines.length < 2) throw new Error('CSV file must have at least a header row and one question row')
    
    const questions = []
    let title = 'Imported Quiz'
    let description = 'Quiz imported from CSV'
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length < 7) continue
      
      if (i === 1) {
        title = values[0] || title
        description = values[1] || description
      }
      
      const question = {
        id: i,
        question: values[2] || '',
        options: [values[3] || '', values[4] || '', values[5] || '', values[6] || ''].filter(opt => opt.trim() !== ''),
        correctAnswer: parseInt(values[7]) - 1 || 0,
        explanation: values[8] || undefined,
        timeLimit: values[9] ? parseInt(values[9]) : undefined
      }
      
      if (question.question && question.options.length >= 2) {
        questions.push(question)
      }
    }
    
    return { title, description, questions }
  }

  const parseCSVLine = (line) => {
    const result = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const parseExcel = (arrayBuffer) => {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    
    if (jsonData.length < 2) throw new Error('Excel file must have at least a header row and one question row')
    
    const questions = []
    let title = 'Imported Quiz'
    let description = 'Quiz imported from Excel'
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i]
      if (!row || row.length < 7) continue
      
      if (i === 1) {
        title = row[0] || title
        description = row[1] || description
      }
      
      const question = {
        id: i,
        question: row[2] || '',
        options: [row[3] || '', row[4] || '', row[5] || '', row[6] || ''].filter(opt => opt && opt.toString().trim() !== ''),
        correctAnswer: (parseInt(row[7]?.toString()) - 1) || 0,
        explanation: row[8]?.toString() || undefined,
        timeLimit: row[9] ? parseInt(row[9].toString()) : undefined
      }
      
      if (question.question && question.options.length >= 2) {
        questions.push(question)
      }
    }
    
    return { title, description, questions }
  }

  const generateQuizCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const createQuizSession = (quiz, settings) => {
    const session = {
      id: Date.now().toString(),
      code: generateQuizCode(),
      quiz,
      participants: [],
      isActive: true,
      createdAt: new Date(),
      settings
    }
    
    setQuizSessions(prev => [...prev, session])
    return session
  }

  const joinQuizSession = (code, name) => {
    const session = quizSessions.find(s => s.code === code && s.isActive)
    if (session) {
      setCurrentSession(session)
      setParticipantName(name)
      return session
    }
    return null
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleQuizComplete = (score, answers, timeSpent) => {
    const results = {
      score,
      answers,
      totalQuestions: quizData?.questions.length || 0,
      timeSpent
    }
    
    setQuizResults(results)
    
    // If in a session, update participant data
    if (currentSession && participantName) {
      const participant = {
        id: Date.now().toString(),
        name: participantName,
        score,
        answers,
        completedAt: new Date(),
        timeSpent
      }
      
      setQuizSessions(prev => prev.map(session => 
        session.id === currentSession.id 
          ? { ...session, participants: [...session.participants, participant] }
          : session))
    }
    
    setCurrentView('results')
  }

  const resetToHome = () => {
    setQuizData(null)
    setQuizResults(null)
    setCurrentSession(null)
    setParticipantName('')
    setCurrentView('home')
  }

  // Render different views
  if (currentView === 'quiz' && (quizData || currentSession)) {
    const quiz = currentSession?.quiz || quizData
    return (
      <QuizInterface
        quizData={quiz}
        onComplete={handleQuizComplete}
        onBack={resetToHome}
        participantName={participantName}
        session={currentSession} />
    );
  }

  if (currentView === 'results' && quizResults) {
    const quiz = currentSession?.quiz || quizData
    return (
      <QuizResults
        results={quizResults}
        quizData={quiz}
        onRestart={() => setCurrentView('quiz')}
        onNewQuiz={resetToHome}
        session={currentSession}
        participantName={participantName} />
    );
  }

  if (currentView === 'join') {
    return (
      <QuizJoin
        onJoin={(code, name) => {
          const session = joinQuizSession(code, name)
          if (session) {
            setCurrentView('quiz')
          } else {
            alert('Quiz not found or inactive')
          }
        }}
        onBack={resetToHome} />
    );
  }

  if (currentView === 'dashboard' && quizData) {
    return (
      <QuizDashboard
        quiz={quizData}
        onStartQuiz={() => setCurrentView('quiz')}
        onCreateSession={(settings) => {
          const session = createQuizSession(quizData, settings)
          setCurrentSession(session)
        }}
        onBack={resetToHome}
        sessions={quizSessions.filter(s => s.quiz.title === quizData.title)} />
    );
  }

  if (currentView === 'history') {
    return (
      <QuizHistory
        sessions={quizSessions}
        onBack={resetToHome}
        onViewSession={(session) => {
          setCurrentSession(session)
          setCurrentView('dashboard')
        }} />
    );
  }

  // Home view
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 pt-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            QuizMaster Pro
          </h1>
          <p className="text-gray-600 text-lg">
            Create, share, and take interactive quizzes with advanced features
          </p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Create Quiz
            </TabsTrigger>
            <TabsTrigger value="join" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Join Quiz
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="sample" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Try Sample
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Create New Quiz
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Upload Excel, CSV, or JSON files to create interactive quizzes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-purple-400 bg-purple-50' 
                      : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}>
                  <div className="flex flex-col items-center space-y-4">
                    <div
                      className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drag and drop your quiz file here
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports Excel (.xlsx, .xls), CSV, and JSON formats
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept=".xlsx,.xls,.csv,.json"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0])
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">File Format Guide</h4>
                      <div className="bg-white rounded border overflow-hidden mb-3">
                        <table className="w-full text-xs">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-2 py-1 text-left border-r">Title</th>
                              <th className="px-2 py-1 text-left border-r">Description</th>
                              <th className="px-2 py-1 text-left border-r">Question</th>
                              <th className="px-2 py-1 text-left border-r">Option A</th>
                              <th className="px-2 py-1 text-left border-r">Option B</th>
                              <th className="px-2 py-1 text-left border-r">Option C</th>
                              <th className="px-2 py-1 text-left border-r">Option D</th>
                              <th className="px-2 py-1 text-left border-r">Correct</th>
                              <th className="px-2 py-1 text-left border-r">Explanation</th>
                              <th className="px-2 py-1 text-left">Time (sec)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t">
                              <td className="px-2 py-1 border-r text-gray-600">Math Quiz</td>
                              <td className="px-2 py-1 border-r text-gray-600">Basic math</td>
                              <td className="px-2 py-1 border-r text-gray-600">What is 2+2?</td>
                              <td className="px-2 py-1 border-r text-gray-600">3</td>
                              <td className="px-2 py-1 border-r text-gray-600">4</td>
                              <td className="px-2 py-1 border-r text-gray-600">5</td>
                              <td className="px-2 py-1 border-r text-gray-600">6</td>
                              <td className="px-2 py-1 border-r text-gray-600">2</td>
                              <td className="px-2 py-1 border-r text-gray-600">2+2=4</td>
                              <td className="px-2 py-1 text-gray-600">30</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-700 mb-3 text-center">
                    📥 Download Templates
                  </h4>
                  <DownloadTemplate />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="join">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle
                  className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
                  <Users className="w-6 h-6" />
                  Join Quiz Session
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter a quiz code to join an active quiz session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuizJoin
                  onJoin={(code, name) => {
                    const session = joinQuizSession(code, name)
                    if (session) {
                      setCurrentView('quiz')
                    } else {
                      alert('Quiz not found or inactive')
                    }
                  }}
                  onBack={() => {}}
                  embedded={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle
                  className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
                  <History className="w-6 h-6" />
                  Quiz History
                </CardTitle>
                <CardDescription className="text-gray-600">
                  View your past quizzes and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuizHistory
                  sessions={quizSessions}
                  onBack={() => {}}
                  onViewSession={(session) => {
                    setCurrentSession(session)
                    setQuizData(session.quiz)
                    setCurrentView('dashboard')
                  }}
                  embedded={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sample">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Try Sample Quiz
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Experience the quiz platform with our demo quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">General Knowledge Quiz</h3>
                  <p className="text-gray-600 mb-4">Test your knowledge with 5 interesting questions</p>
                  <div className="flex justify-center space-x-4 text-sm text-gray-500">
                    <span>• 5 Questions</span>
                    <span>• Multiple Choice</span>
                    <span>• Instant Results</span>
                  </div>
                </div>
                
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    const sampleQuiz = {
                      title: "General Knowledge Quiz",
                      description: "Test your general knowledge with these questions",
                      questions: [
                        {
                          id: 1,
                          question: "What is the capital of France?",
                          options: ["London", "Berlin", "Paris", "Madrid"],
                          correctAnswer: 2,
                          explanation: "Paris is the capital and largest city of France.",
                          timeLimit: 30
                        },
                        {
                          id: 2,
                          question: "Which planet is known as the Red Planet?",
                          options: ["Venus", "Mars", "Jupiter", "Saturn"],
                          correctAnswer: 1,
                          explanation: "Mars is called the Red Planet due to its reddish appearance.",
                          timeLimit: 30
                        },
                        {
                          id: 3,
                          question: "What is the largest ocean on Earth?",
                          options: ["Atlantic", "Indian", "Arctic", "Pacific"],
                          correctAnswer: 3,
                          explanation: "The Pacific Ocean is the largest ocean, covering about 46% of Earth's water surface.",
                          timeLimit: 30
                        },
                        {
                          id: 4,
                          question: "Who painted the Mona Lisa?",
                          options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
                          correctAnswer: 1,
                          explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519.",
                          timeLimit: 30
                        },
                        {
                          id: 5,
                          question: "What is the chemical symbol for gold?",
                          options: ["Go", "Gd", "Au", "Ag"],
                          correctAnswer: 2,
                          explanation: "Au comes from the Latin word 'aurum' meaning gold.",
                          timeLimit: 30
                        }
                      ]
                    }
                    setQuizData(sampleQuiz)
                    setCurrentView('quiz')
                  }}>
                  <Play className="w-5 h-5 mr-2" />
                  Start Sample Quiz
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
