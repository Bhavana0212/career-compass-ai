import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Route,
  CheckCircle,
  Briefcase
} from "lucide-react";

const COMPANY_LOGOS = {
  "Infosys": "https://logo.clearbit.com/infosys.com",
  "Accenture": "https://logo.clearbit.com/accenture.com",
  "Deloitte": "https://logo.clearbit.com/deloitte.com",
  "Google": "https://logo.clearbit.com/google.com",
  "Meta": "https://logo.clearbit.com/meta.com",
  "Netflix": "https://logo.clearbit.com/netflix.com",
  "Apple": "https://logo.clearbit.com/apple.com",
  "Amazon": "https://logo.clearbit.com/amazon.com",
  "Microsoft": "https://logo.clearbit.com/microsoft.com",
};

const CAREER_COMPANIES = {
  "Data Analyst": ["Infosys", "Accenture", "Deloitte"],
  "Software Engineer": ["Google", "Meta", "Netflix"],
  "Product Manager": ["Apple", "Amazon", "Microsoft"],
  "UI/UX Designer": ["Google", "Apple", "Microsoft"],
  "Business Analyst": ["Deloitte", "Accenture", "Infosys"],
};

export default function CareerDetails({ career }) {
  const getSkillColor = (importance) => ({
    essential: "bg-red-50 text-red-700 border-red-200",
    important: "bg-yellow-50 text-yellow-700 border-yellow-200",
    preferred: "bg-blue-50 text-blue-700 border-blue-200"
  }[importance] || "bg-gray-50 text-gray-700 border-gray-200");

  const getProficiencyIcon = (level) => {
    const colors = {
      beginner: "text-green-500",
      intermediate: "text-yellow-500", 
      advanced: "text-orange-500",
      expert: "text-red-500"
    };
    return colors[level] || "text-gray-500";
  };
  
  const hiringCompanies = CAREER_COMPANIES[career.title] || [];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-slate-900">{career.title}</CardTitle>
        <p className="text-slate-600">{career.industry}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-2">About This Role</h4>
          <p className="text-sm text-slate-600">{career.description}</p>
        </div>
        
        {/* Salary & Outlook */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-slate-700">Salary Range</span>
            </div>
            <p className="text-lg font-bold text-slate-900">
              ${career.salary_range?.min?.toLocaleString()} - ${career.salary_range?.max?.toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-700">Job Outlook</span>
            </div>
            <Badge className={
              career.job_outlook === 'rapidly_growing' ? 'bg-green-100 text-green-700' :
              career.job_outlook === 'growing' ? 'bg-blue-100 text-blue-700' :
              career.job_outlook === 'stable' ? 'bg-gray-100 text-gray-700' :
              'bg-red-100 text-red-700'
            }>
              {career.job_outlook?.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        
        {/* Top Hiring Companies */}
        {hiringCompanies.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Top Hiring Companies
            </h4>
            <div className="flex items-center gap-4">
              {hiringCompanies.map(company => (
                <div key={company} className="flex flex-col items-center gap-2">
                   <img src={COMPANY_LOGOS[company]} alt={`${company} logo`} className="w-10 h-10 object-contain rounded-md" />
                   <span className="text-xs text-slate-500">{company}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Required Skills */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Required Skills
          </h4>
          <div className="space-y-2">
            {career.required_skills?.map((skill, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${getSkillColor(skill.importance)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {skill.importance}
                    </Badge>
                    <span className={`text-xs font-medium ${getProficiencyIcon(skill.proficiency_needed)}`}>
                      {skill.proficiency_needed}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Career Progression */}
        {career.typical_progression && (
          <div>
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Route className="w-4 h-4 text-purple-600" />
              Career Progression
            </h4>
            <div className="space-y-2">
              {career.typical_progression.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-sm text-slate-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}