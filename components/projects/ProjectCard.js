import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Clock, 
  Target,
  CheckCircle,
  PlayCircle,
  ArrowRight
} from "lucide-react";

export default function ProjectCard({ project, onSelect, isSelected, onUpdateStatus }) {
  const getDifficultyColor = (difficulty) => ({
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700"
  }[difficulty] || "bg-gray-100 text-gray-700");

  const getStatusColor = (status) => ({
    not_started: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700"
  }[status] || "bg-gray-100 text-gray-700");

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <PlayCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
        isSelected 
          ? "ring-2 ring-purple-500 bg-purple-50/50" 
          : "bg-white/80 backdrop-blur-sm hover:bg-white"
      } border-slate-200/60 shadow-lg`}
      onClick={() => onSelect(project)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl text-slate-900 mb-2 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              {project.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-slate-600 mb-3">
              <span className="text-sm">{project.career_relevance}</span>
            </div>
          </div>
          <ArrowRight className={`w-5 h-5 transition-colors ${
            isSelected ? "text-purple-600" : "text-slate-400"
          }`} />
        </div>
        
        {/* Status and Difficulty */}
        <div className="flex items-center gap-2">
          <Badge className={getDifficultyColor(project.difficulty_level)}>
            {project.difficulty_level}
          </Badge>
          <Badge className={getStatusColor(project.completion_status)} >
            {getStatusIcon(project.completion_status)}
            <span className="ml-1">{project.completion_status?.replace('_', ' ')}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-600 text-sm line-clamp-3">
          {project.description}
        </p>
        
        {/* Project Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-slate-600">Est. {project.estimated_hours}h</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-slate-600">{project.skills_practiced?.length || 0} skills</span>
          </div>
        </div>
        
        {/* Skills Practiced */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Skills You'll Practice</p>
          <div className="flex flex-wrap gap-1">
            {project.skills_practiced?.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {project.skills_practiced?.length > 4 && (
              <Badge variant="outline" className="text-xs text-slate-500">
                +{project.skills_practiced.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Action */}
        <div className="pt-2">
          {project.completion_status === 'not_started' && (
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(project.id, 'in_progress');
              }}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Start Project
            </Button>
          )}
          {project.completion_status === 'in_progress' && (
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(project.id, 'completed');
              }}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Mark Complete
            </Button>
          )}
          {project.completion_status === 'completed' && (
            <div className="flex items-center justify-center text-sm text-green-600 font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              Project Completed!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}