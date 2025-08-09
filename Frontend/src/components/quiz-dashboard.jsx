import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Share2, Users, Clock, Copy } from 'lucide-react';

export default function QuizDashboard({ quiz, onStartQuiz, onCreateSession, onBack, sessions }) {
  const [settings, setSettings] = useState({
    showResults: true,
    allowRetake: false,
    randomizeQuestions: false,
    randomizeOptions: false
  })

  const handleCreateSession = () => {
    onCreateSession(settings)
    alert(
      `Quiz session created! Share code: ${sessions[sessions.length - 1]?.code || 'Loading...'}`
    )
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={onStartQuiz}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              <Play className="w-4 h-4 mr-2" />
              Take Quiz
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quiz Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">{quiz.title}</CardTitle>
                <p className="text-gray-600">{quiz.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{quiz.questions.length}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(quiz.questions.reduce((acc, q) => acc + (q.timeLimit || 30), 0) / 60)}
                    </div>
                    <div className="text-sm text-gray-600">Est. Minutes</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{sessions.length}</div>
                    <div className="text-sm text-gray-600">Sessions</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {sessions.reduce((acc, s) => acc + s.participants.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Participants</div>
                  </div>
                </div>

                <Tabs defaultValue="questions" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="questions">Questions Preview</TabsTrigger>
                    <TabsTrigger value="settings">Quiz Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="questions" className="space-y-4">
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {quiz.questions.map((question, index) => (
                        <div key={question.id} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-800">
                              {index + 1}. {question.question}
                            </h4>
                            {question.timeLimit && (
                              <Badge variant="outline" className="ml-2">
                                <Clock className="w-3 h-3 mr-1" />
                                {question.timeLimit}s
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`p-2 rounded ${
                                  optIndex === question.correctAnswer 
                                    ? 'bg-green-100 text-green-800 font-medium' 
                                    : 'bg-white text-gray-600'
                                }`}>
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Show Results After Quiz</Label>
                          <p className="text-xs text-gray-500">Display correct answers and explanations</p>
                        </div>
                        <Switch
                          checked={settings.showResults}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showResults: checked }))} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Allow Retakes</Label>
                          <p className="text-xs text-gray-500">Let participants retake the quiz</p>
                        </div>
                        <Switch
                          checked={settings.allowRetake}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowRetake: checked }))} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Randomize Questions</Label>
                          <p className="text-xs text-gray-500">Show questions in random order</p>
                        </div>
                        <Switch
                          checked={settings.randomizeQuestions}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, randomizeQuestions: checked }))} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Randomize Options</Label>
                          <p className="text-xs text-gray-500">Shuffle answer choices</p>
                        </div>
                        <Switch
                          checked={settings.randomizeOptions}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, randomizeOptions: checked }))} />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Time Limit (minutes)</Label>
                        <Input
                          type="number"
                          placeholder="Optional overall time limit"
                          value={settings.timeLimit || ''}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
                          }))}
                          className="mt-1" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Actions & Sessions */}
          <div className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share Quiz
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleCreateSession}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                  <Users className="w-4 h-4 mr-2" />
                  Create Session
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Generate a code for others to join
                </p>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            {sessions.length > 0 && (
              <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Active Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sessions.filter(s => s.isActive).map((session) => (
                    <div key={session.id} className="p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-mono text-lg font-bold text-green-700">
                          {session.code}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(session.code)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600">
                        {session.participants.length} participants
                      </div>
                      <div className="text-xs text-gray-500">
                        Created {session.createdAt.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
