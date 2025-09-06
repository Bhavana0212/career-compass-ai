import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft,
  MessageSquare, 
  CheckCircle,
  Lightbulb,
  Timer,
  Mic,
  MicOff
} from "lucide-react";

export default function PracticeSession({ question, onBack }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  React.useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setTimeElapsed(0);
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Questions
          </Button>
          <div className="flex items-center gap-2">
            <Badge className={question.question_type === "technical" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}>
              {question.question_type === "technical" ? "Technical" : "Behavioral"}
            </Badge>
            <Badge className="bg-slate-100 text-slate-700">
              {question.career_focus}
            </Badge>
          </div>
        </div>

        {/* Question */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-orange-600" />
              Interview Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg text-slate-800 leading-relaxed p-4 bg-slate-50 rounded-lg">
              {question.question}
            </div>
          </CardContent>
        </Card>

        {/* Practice Area */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Your Answer */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-green-600" />
                  Your Practice Answer
                </span>
                <div className="flex items-center gap-2">
                  {isRecording && (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="text-sm font-mono">{formatTime(timeElapsed)}</span>
                    </div>
                  )}
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                    onClick={toggleRecording}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecording ? "Stop" : "Record"}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type or speak your answer here. Try to structure your response clearly and include specific examples..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={12}
                className="resize-none"
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-slate-500">
                  {userAnswer.length} characters
                </span>
                <Button 
                  onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                  variant="outline"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showSampleAnswer ? "Hide" : "Show"} Sample Answer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sample Answer & Tips */}
          <div className="space-y-6">
            {/* Key Points */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Key Points to Cover
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {question.key_points?.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Sample Answer */}
            {showSampleAnswer && (
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Lightbulb className="w-5 h-5" />
                    Sample Answer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-green-800 leading-relaxed">
                    {question.suggested_answer}
                  </div>
                  <div className="mt-4 p-3 bg-white/60 rounded-lg">
                    <p className="text-xs text-green-700 font-medium">
                      💡 Tip: Use the STAR method (Situation, Task, Action, Result) for behavioral questions, 
                      and provide specific examples with quantifiable results when possible.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-slate-600">
                <p>Practice tip: Record yourself speaking the answer aloud to improve your delivery and timing.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onBack}>
                  Try Another Question
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Save Practice Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}