import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Target, Compass, BookOpen, Briefcase } from "lucide-react";

export default function NextSteps({ userProfile }) {
  const hasSkills = userProfile?.skills?.length > 0;
  const hasCareerInterests = userProfile?.career_interests?.length > 0;

  const getNextSteps = () => {
    if (!hasSkills) {
      return [
        {
          title: "Complete Skill Assessment",
          description: "Map your current skills and identify areas for growth",
          icon: Target,
          link: createPageUrl("SkillAssessment"),
          priority: "high"
        }
      ];
    }

    if (!hasCareerInterests) {
      return [
        {
          title: "Explore Career Paths",
          description: "Discover careers that match your skills and interests",
          icon: Compass,
          link: createPageUrl("CareerExplorer"),
          priority: "high"
        }
      ];
    }

    return [
      {
        title: "Start Learning Path",
        description: "Begin skill development with personalized courses",
        icon: BookOpen,
        link: createPageUrl("LearningHub"),
        priority: "medium"
      },
      {
        title: "Practice with Projects",
        description: "Build portfolio-worthy projects in your field",
        icon: Briefcase,
        link: createPageUrl("ProjectLab"),
        priority: "medium"
      }
    ];
  };

  const nextSteps = getNextSteps();

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-slate-900">Recommended Next Steps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {nextSteps.map((step, index) => (
          <div key={index} className={`p-4 rounded-xl border ${
            step.priority === 'high' 
              ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-start gap-3 mb-3">
              <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center ${
                step.priority === 'high' 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                <step.icon className="w-4 h-4" />
                <div className={`absolute -inset-1 rounded-lg ${step.priority === 'high' ? 'bg-indigo-400' : 'bg-slate-400'} opacity-20 blur-md animate-pulse`}></div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">{step.title}</h4>
                <p className="text-sm text-slate-600 mt-1">{step.description}</p>
              </div>
            </div>
            <Link to={step.link}>
              <Button 
                variant={step.priority === 'high' ? 'default' : 'outline'} 
                size="sm" 
                className="w-full"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}