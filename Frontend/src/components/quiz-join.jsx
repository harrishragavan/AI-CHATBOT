"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Users, Code } from 'lucide-react'

export default function QuizJoin({ onJoin, onBack, embedded = false }) {
  const [quizCode, setQuizCode] = useState('')
  const [participantName, setParticipantName] = useState('')

  const handleJoin = () => {
    if (!quizCode.trim() || !participantName.trim()) {
      alert('Please enter both quiz code and your name')
      return
    }
    onJoin(quizCode.toUpperCase(), participantName)
  }

  const content = (
    <div className="space-y-6">
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-4">
          <Code className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Join Quiz Session</h2>
        <p className="text-gray-600">Enter the quiz code provided by your instructor</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="quiz-code" className="text-sm font-medium text-gray-700">
            Quiz Code
          </Label>
          <Input
            id="quiz-code"
            type="text"
            placeholder="Enter 6-digit code (e.g., ABC123)"
            value={quizCode}
            onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
            className="mt-1 text-center text-lg font-mono tracking-wider"
            maxLength={6} />
        </div>

        <div>
          <Label htmlFor="participant-name" className="text-sm font-medium text-gray-700">
            Your Name
          </Label>
          <Input
            id="participant-name"
            type="text"
            placeholder="Enter your full name"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            className="mt-1" />
        </div>
      </div>

      <Button
        onClick={handleJoin}
        disabled={!quizCode.trim() || !participantName.trim()}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        size="lg">
        <Users className="w-5 h-5 mr-2" />
        Join Quiz
      </Button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How to Join:</h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Get the 6-digit quiz code from your instructor</li>
          <li>2. Enter your full name as you'd like it to appear</li>
          <li>3. Click "Join Quiz" to start</li>
          <li>4. Wait for the quiz to begin</li>
        </ol>
      </div>
    </div>
  )

  if (embedded) {
    return content
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-md">
        <div className="flex items-center mb-6 pt-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
          <CardContent className="p-6">
            {content}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
