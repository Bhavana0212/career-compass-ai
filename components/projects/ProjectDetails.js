import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Clock, 
  Target,
  CheckCircle,
  ExternalLink,
  FileText,
  Lightbulb
} from "lucide-react";

export default function ProjectDetails({ project }) {
  const getDifficultyColor = (difficulty) => ({
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700"
  }[difficulty] || "bg-gray-100 text-gray-700");

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="w-6 h-6 text-purple-600" />
            {project.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(project.difficulty_level)}>
              {project.difficulty_level}
            </Badge>
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {project.estimated_hours}h
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Project Goal</h4>
            <p className="text-slate-600 leading-relaxed">{project.description}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Career Relevance</h4>
            <p className="text-slate-600">{project.career_relevance}</p>
          </div>
        </CardContent>
      </Card>

      {/* Skills & Requirements */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Skills & Requirements
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Skills You'll Practice</h4>
            <div className="flex flex-wrap gap-2">
              {project.skills_practiced?.map((skill, index) => (
                <Badge key={index} className="bg-green-100 text-green-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Technical Requirements</h4>
            <ul className="space-y-1">
              {project.requirements?.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Deliverables */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            Project Deliverables
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <ul className="space-y-2">
            {project.deliverables?.map((deliverable, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">{deliverable}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Helpful Resources
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {project.resources?.map((resource, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium text-slate-900 text-sm">{resource.name}</h5>
                  <p className="text-xs text-slate-500 capitalize">{resource.type}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}