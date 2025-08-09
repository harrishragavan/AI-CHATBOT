"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, RotateCcw, Upload, CheckCircle, XCircle, Download, Share2 } from 'lucide-react';
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

export default function QuizResults({ results, quizData, onRestart, onNewQuiz, session, participantName }) {
  const percentage = Math.round((results.score / results.totalQuestions) * 100)
  
  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = () => {
    if (percentage >= 90) return "Outstanding! 🎉"
    if (percentage >= 80) return "Great job! 👏"
    if (percentage >= 70) return "Good work! 👍"
    if (percentage >= 60) return "Not bad! 📚"
    return "Keep practicing! 💪"
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.text(quizData.title, 20, 30)
    
    // Participant info
    if (participantName) {
      doc.setFontSize(12)
      doc.text(`Participant: ${participantName}`, 20, 45)
    }
    
    // Score
    doc.setFontSize(16)
    doc.text(
      `Score: ${results.score}/${results.totalQuestions} (${percentage}%)`,
      20,
      60
    )
    doc.text(`Time Spent: ${formatTime(results.timeSpent)}`, 20, 75)
    
    // Questions and answers
    let yPosition = 95
    doc.setFontSize(12)
    
    quizData.questions.forEach((question, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 30
      }
      
      const userAnswer = results.answers[index]
      const isCorrect = userAnswer === question.correctAnswer
      
      doc.text(`${index + 1}. ${question.question}`, 20, yPosition)
      yPosition += 10
      
      doc.text(
        `Your answer: ${question.options[userAnswer] || 'Not answered'}`,
        25,
        yPosition
      )
      yPosition += 8
      
      if (!isCorrect) {
        doc.text(
          `Correct answer: ${question.options[question.correctAnswer]}`,
          25,
          yPosition
        )
        yPosition += 8
      }
      
      doc.text(isCorrect ? '✓ Correct' : '✗ Incorrect', 25, yPosition)
      yPosition += 15
    })
    
    doc.save(`${quizData.title}-results.pdf`)
  }

  const downloadExcel = () => {
    const data = [
      ['Quiz Results'],
      ['Quiz Title', quizData.title],
      ['Participant', participantName || 'Anonymous'],
      ['Score', `${results.score}/${results.totalQuestions}`],
      ['Percentage', `${percentage}%`],
      ['Time Spent', formatTime(results.timeSpent)],
      [''],
      ['Question', 'Your Answer', 'Correct Answer', 'Result'],
      ...quizData.questions.map((question, index) => {
        const userAnswer = results.answers[index]
        const isCorrect = userAnswer === question.correctAnswer
        return [
          question.question,
          question.options[userAnswer] || 'Not answered',
          question.options[question.correctAnswer],
          isCorrect ? 'Correct' : 'Incorrect'
        ]
      })
    ]

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, 'Quiz Results')
    XLSX.writeFile(wb, `${quizData.title}-results.xlsx`)
  }

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: `Quiz Results: ${quizData.title}`,
        text: `I scored ${results.score}/${results.totalQuestions} (${percentage}%) on "${quizData.title}"!`,
        url: window.location.href
      })
    } else {
      const text = `I scored ${results.score}/${results.totalQuestions} (${percentage}%) on "${quizData.title}"!`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8 pt-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Quiz Complete!
          </h1>
          <p className="text-gray-600">
            Here are your results for "{quizData.title}"
          </p>
        </div>

        {/* Score Card */}
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl mb-6">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Your Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <div className={`text-6xl font-bold ${getScoreColor()}`}>
                {percentage}%
              </div>
              <div className="text-xl text-gray-600">
                {results.score} out of {results.totalQuestions} correct
              </div>
              <div className="text-lg font-medium text-gray-700">
                {getScoreMessage()}
              </div>
            </div>
            
            <Progress value={percentage} className="h-3" />
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{results.totalQuestions - results.score}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatTime(results.timeSpent)}</div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(results.timeSpent / results.totalQuestions)}s
                </div>
                <div className="text-sm text-gray-600">Avg/Question</div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Button
                onClick={onRestart}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
              <Button variant="outline" onClick={onNewQuiz} className="px-6">
                <Upload className="w-4 h-4 mr-2" />
                New Quiz
              </Button>
              <Button variant="outline" onClick={downloadPDF} className="px-6">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={downloadExcel} className="px-6">
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={shareResults} className="px-6">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Question Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizData.questions.map((question, index) => {
              const userAnswer = results.answers[index]
              const isCorrect = userAnswer === question.correctAnswer
              
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Question {index + 1}: {question.question}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className={`${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          Your answer: {question.options[userAnswer] || 'Not answered'}
                        </div>
                        {!isCorrect && (
                          <div className="text-green-700">
                            Correct answer: {question.options[question.correctAnswer]}
                          </div>
                        )}
                        {question.explanation && (
                          <div className="text-gray-600 mt-2 p-2 bg-white rounded border">
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
