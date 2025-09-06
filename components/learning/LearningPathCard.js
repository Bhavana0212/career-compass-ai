import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Target, 
  Play,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function LearningPathCard({ path, onSelect, onUpdateStatus, isSelected }) {
  const getStatusColor = (status) => ({
    not_started: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700"
  }[status]);

  const getDifficultyColor = (difficulty) => ({
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700", 
    advanced: "bg-red-100 text-red-700"
  }[difficulty] || "bg-gray-100 text-gray-700");

  const getProgress = () => {
    if (path.completion_status === "completed") return 100;
    if (path.completion_status === "in_progress") return 45;
    return 0;
  };

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(path.id, newStatus);
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
        isSelected 
          ? "ring-2 ring-green-500 bg-green-50/50" 
          : "bg-white/80 backdrop-blur-sm hover:bg-white"
      } border-slate-200/60 shadow-lg`}
      onClick={() => onSelect(path)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl text-slate-900 mb-2">
              {path.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-slate-600 mb-3">
              <Target className="w-4 h-4" />
              <span className="text-sm">{path.target_career}</span>
            </div>
          </div>
          <ArrowRight className={`w-5 h-5 transition-colors ${
            isSelected ? "text-green-600" : "text-slate-400"
          }`} />
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Progress</span>
            <span className="font-semibold text-slate-900">{getProgress()}%</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Courses</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{path.courses?.length || 0}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">Duration</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{path.estimated_duration}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Skills</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{path.skill_gaps?.length || 0}</p>
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(path.completion_status)}>
            {path.completion_status?.replace('_', ' ')}
          </Badge>
          <Badge className={getDifficultyColor(path.difficulty_level)}>
            {path.difficulty_level}
          </Badge>
        </div>
        
        {/* Top Skills to Learn */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Skills You'll Learn</p>
          <div className="flex flex-wrap gap-1">
            {path.skill_gaps?.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {path.skill_gaps?.length > 4 && (
              <Badge variant="outline" className="text-xs text-slate-500">
                +{path.skill_gaps.length - 4} more
              </Badge>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {path.completion_status === "not_started" && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange("in_progress");
              }}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Learning
            </Button>
          )}
          
          {path.completion_status === "in_progress" && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange("completed");
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          )}
          
          {path.completion_status === "completed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange("in_progress");
              }}
              className="flex-1"
            >
              Review Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}