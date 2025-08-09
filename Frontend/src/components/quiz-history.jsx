"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Users, Clock, Trophy, Download } from 'lucide-react'

export default function QuizHistory({ sessions, onBack, onViewSession, embedded = false }) {
  const downloadSessionResults = (session) => {
    const csvContent = [
      ['Participant Name', 'Score', 'Percentage', 'Time Spent (seconds)', 'Completed At'],
      ...session.participants.map(p => [
        p.name,
        p.score.toString(),
        `${Math.round((p.score / session.quiz.questions.length) * 100)}%`,
        p.timeSpent.toString(),
        p.completedAt?.toLocaleString() || 'Not completed'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${session.quiz.title}-results-${session.code}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const content = (
    <div className="space-y-6">
      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <div
            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Quiz History</h3>
          <p className="text-gray-600">Create your first quiz to see it here</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => {
            const avgScore = session.participants.length > 0 
              ? session.participants.reduce((acc, p) => acc + p.score, 0) / session.participants.length
              : 0
            const avgPercentage = Math.round((avgScore / session.quiz.questions.length) * 100)
            
            return (
              <Card
                key={session.id}
                className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {session.quiz.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {session.quiz.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.createdAt.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {session.participants.length} participants
                        </span>
                        <Badge variant={session.isActive ? "default" : "secondary"}>
                          {session.isActive ? "Active" : "Completed"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold text-purple-600 mb-1">
                        {session.code}
                      </div>
                      {session.participants.length > 0 && (
                        <div className="text-sm text-gray-600">
                          Avg: {avgPercentage}%
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {session.quiz.questions.length}
                      </div>
                      <div className="text-xs text-gray-600">Questions</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">
                        {session.participants.filter(p => p.completedAt).length}
                      </div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">
                        {avgPercentage}%
                      </div>
                      <div className="text-xs text-gray-600">Avg Score</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-xl font-bold text-orange-600">
                        {session.participants.length > 0 
                          ? Math.round(
                          session.participants.reduce((acc, p) => acc + p.timeSpent, 0) / session.participants.length / 60
                        )
                          : 0}
                      </div>
                      <div className="text-xs text-gray-600">Avg Time (min)</div>
                    </div>
                  </div>

                  {session.participants.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Top Performers:</h4>
                      <div className="space-y-1">
                        {session.participants
                          .sort((a, b) => b.score - a.score)
                          .slice(0, 3)
                          .map((participant, index) => (
                            <div
                              key={participant.id}
                              className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                    index === 1 ? 'bg-gray-100 text-gray-800' :
                                    'bg-orange-100 text-orange-800'
                                  }`}>
                                  {index + 1}
                                </span>
                                {participant.name}
                              </span>
                              <span className="font-medium">
                                {Math.round((participant.score / session.quiz.questions.length) * 100)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onViewSession(session)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    {session.participants.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadSessionResults(session)}>
                        <Download className="w-4 h-4 mr-1" />
                        Export Results
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  )

  if (embedded) {
    return content
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-6 pt-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Quiz History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {content}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
