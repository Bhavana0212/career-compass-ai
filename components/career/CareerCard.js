import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Star, 
  Building2,
  ArrowRight
} from "lucide-react";

export default function CareerCard({ career, skillMatch, onSelect, isSelected }) {
  const getOutlookColor = (outlook) => ({
    declining: "bg-red-100 text-red-700",
    stable: "bg-gray-100 text-gray-700", 
    growing: "bg-blue-100 text-blue-700",
    rapidly_growing: "bg-green-100 text-green-700"
  }[outlook] || "bg-gray-100 text-gray-700");

  const getMatchColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600"; 
    return "text-red-600";
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
        isSelected 
          ? "ring-2 ring-indigo-500 bg-indigo-50/50" 
          : "bg-white/80 backdrop-blur-sm hover:bg-white"
      } border-slate-200/60 shadow-lg`}
      onClick={() => onSelect(career)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl text-slate-900 mb-2 flex items-center gap-2">
              {career.title}
              {career.match_score >= 80 && (
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              )}
            </CardTitle>
            <div className="flex items-center gap-2 text-slate-600 mb-3">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">{career.industry}</span>
            </div>
          </div>
          <ArrowRight className={`w-5 h-5 transition-colors ${
            isSelected ? "text-indigo-600" : "text-slate-400"
          }`} />
        </div>
        
        {/* Match Score */}
        {career.match_score && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">AI Match Score</span>
              <span className={`font-semibold ${getMatchColor(career.match_score)}`}>
                {career.match_score}%
              </span>
            </div>
            <Progress value={career.match_score} className="h-2" />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-600 text-sm line-clamp-3">
          {career.description}
        </p>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Salary Range</span>
            </div>
            <p className="text-sm text-slate-600">
              ${career.salary_range?.min?.toLocaleString()} - ${career.salary_range?.max?.toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Job Outlook</span>
            </div>
            <Badge className={getOutlookColor(career.job_outlook)}>
              {career.job_outlook?.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        
        {/* Skill Match */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Your Skill Match</span>
            <span className={`font-semibold ${getMatchColor(skillMatch)}`}>
              {skillMatch}%
            </span>
          </div>
          <Progress value={skillMatch} className="h-2" />
        </div>
        
        {/* Top Required Skills */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Key Skills Required</p>
          <div className="flex flex-wrap gap-1">
            {career.required_skills?.slice(0, 4).map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className={`text-xs ${
                  skill.importance === 'essential' 
                    ? 'border-red-200 text-red-700' 
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                {skill.skill}
              </Badge>
            ))}
            {career.required_skills?.length > 4 && (
              <Badge variant="outline" className="text-xs text-slate-500">
                +{career.required_skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}