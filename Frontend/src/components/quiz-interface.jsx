import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Clock, CheckCircle, AlertCircle, User } from 'lucide-react'

export default function QuizInterface({ quizData, onComplete, onBack, participantName, session }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(quizData.questions.length).fill(-1))
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer);
  }, [])

  useEffect(() => {
    const question = quizData.questions[currentQuestion]
    if (question.timeLimit) {
      setQuestionTimeLeft(question.timeLimit)
      const timer = setInterval(() => {
        setQuestionTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            // Auto-advance to next question when time runs out
            if (currentQuestion < quizData.questions.length - 1) {
              setCurrentQuestion(currentQuestion + 1)
            }
            return null
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer);
    } else {
      setQuestionTimeLeft(null)
    }
  }, [currentQuestion, quizData.questions])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
    setShowExplanation(false)
  }

  const nextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
    }
  }

  const finishQuiz = () => {
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === quizData.questions[index].correctAnswer ? 1 : 0)
    }, 0)
    const totalTimeSpent = Math.floor((Date.now() - startTime) / 1000)
    onComplete(score, selectedAnswers, totalTimeSpent)
  }

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100
  const question = quizData.questions[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestion] !== -1
  const isLastQuestion = currentQuestion === quizData.questions.length - 1
  const answeredCount = selectedAnswers.filter(a => a !== -1).length

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-4 text-sm">
            {participantName && (
              <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                <User className="w-4 h-4 mr-1 text-gray-600" />
                {participantName}
              </div>
            )}
            {session && (
              <div
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-mono font-bold">
                {session.code}
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(timeElapsed)}
            </div>
            <div className="bg-white px-3 py-1 rounded-full shadow-sm">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">{answeredCount}/{quizData.questions.length} answered</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Quiz Card */}
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800">
                {quizData.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                {isAnswered && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
                {questionTimeLeft !== null && (
                  <Badge
                    variant={questionTimeLeft <= 10 ? "destructive" : "default"}
                    className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {questionTimeLeft}s
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-gray-800 leading-relaxed">
                {question.question}
              </h3>
              {question.timeLimit && (
                <div className="mt-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Time limit: {question.timeLimit} seconds
                </div>
              )}
            </div>

            {/* Options */}
            <RadioGroup
              value={selectedAnswers[currentQuestion]?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleAnswerSelect(index)}>
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-gray-700 font-medium">
                    {String.fromCharCode(65 + index)}. {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Explanation */}
            {showExplanation && question.explanation && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                <p className="text-blue-800">{question.explanation}</p>
              </div>
            )}

            {/* Show Explanation Button */}
            {isAnswered && question.explanation && !showExplanation && (
              <Button
                variant="outline"
                onClick={() => setShowExplanation(true)}
                className="w-full">
                Show Explanation
              </Button>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="px-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={finishQuiz}
                  disabled={selectedAnswers.includes(-1)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8">
                  Finish Quiz
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={!isAnswered}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg mt-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {quizData.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={currentQuestion === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCurrentQuestion(index)
                    setShowExplanation(false)
                  }}
                  className={`w-10 h-10 p-0 ${
                    selectedAnswers[index] !== -1 
                      ? 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200' 
                      : ''
                  }`}>
                  {index + 1}
                  {selectedAnswers[index] !== -1 && (
                    <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-green-600" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
