import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  BrainCircuit, 
  Users,
  Play,
  CheckCircle,
  Star
} from "lucide-react";

export default function QuestionCard({ question, onPractice }) {
  const getTypeIcon = (type) => {
    return type === "technical" ? <BrainCircuit className="w-4 h-4" /> : <Users className="w-4 h-4" />;
  };

  const getTypeColor = (type) => {
    return type === "technical" 
      ? "bg-blue-100 text-blue-700" 
      : "bg-green-100 text-green-700";
  };

  const getDifficultyColor = (level) => {
    const colors = {
      entry: "bg-green-100 text-green-700",
      mid: "bg-yellow-100 text-yellow-700", 
      senior: "bg-red-100 text-red-700"
    };
    return colors[level] || "bg-gray-100 text-gray-700";
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 mb-2">
            {getTypeIcon(question.question_type)}
            <Badge className={getTypeColor(question.question_type)}>
              {question.question_type === "technical" ? "Technical" : "Behavioral"}
            </Badge>
            <Badge className={getDifficultyColor(question.difficulty_level)}>
              {question.difficulty_level === "entry" ? "Entry Level" : 
               question.difficulty_level === "mid" ? "Mid Level" : "Senior Level"}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg text-slate-900 leading-relaxed">
          {question.question}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Sample Answer Preview */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Sample Answer Approach
          </h4>
          <p className="text-sm text-slate-600 line-clamp-3">
            {question.suggested_answer}
          </p>
        </div>

        {/* Key Points */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Key Points to Cover
          </h4>
          <div className="flex flex-wrap gap-2">
            {question.key_points?.slice(0, 3).map((point, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {point}
              </Badge>
            ))}
          </div>
        </div>

        {/* Practice Button */}
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-slate-500">
            Career Focus: {question.career_focus}
          </div>
          <Button 
            onClick={() => onPractice(question)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Practice This Question
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}