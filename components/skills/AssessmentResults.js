import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle, Compass, BookOpen, Briefcase, ArrowRight, Sparkles } from "lucide-react";

export default function AssessmentResults({ userProfile }) {
  const skillsByCategory = userProfile.skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {}) || {};

  const getCategoryColor = (category) => ({
    technical: "bg-blue-50 text-blue-700 border-blue-200",
    soft: "bg-green-50 text-green-700 border-green-200", 
    domain: "bg-purple-50 text-purple-700 border-purple-200",
    language: "bg-orange-50 text-orange-700 border-orange-200",
    tool: "bg-indigo-50 text-indigo-700 border-indigo-200"
  }[category]);

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 border-none shadow-xl text-white">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            Assessment Complete! 🎉
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto mb-6">
            Your skill profile is ready. Let's find your perfect career match.
          </p>
          <Link to={createPageUrl("CareerExplorer")}>
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-bold px-8 animate-pulse">
                See Your Recommended Careers
                <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Profile Summary */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Your Profile Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Current Role</h4>
              <p className="text-slate-900">{userProfile.current_role || "Not specified"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Experience Level</h4>
              <Badge className="bg-indigo-100 text-indigo-700 capitalize">
                {userProfile.experience_level?.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          {/* Skills by Category */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-4">
              Skills by Category ({userProfile.skills?.length || 0} total)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} className={`p-4 rounded-lg border ${getCategoryColor(category)}`}>
                  <h5 className="font-semibold mb-2 capitalize">{category} ({skills.length})</h5>
                  <div className="space-y-1">
                    {skills.slice(0, 3).map((skill, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {skill.proficiency}
                        </Badge>
                      </div>
                    ))}
                    {skills.length > 3 && (
                      <p className="text-xs text-slate-500">
                        +{skills.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interests and Industries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">Career Interests</h4>
              <div className="flex flex-wrap gap-2">
                {userProfile.career_interests?.map((interest) => (
                  <Badge key={interest} className="bg-pink-100 text-pink-700">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">Preferred Industries</h4>
              <div className="flex flex-wrap gap-2">
                {userProfile.preferred_industries?.map((industry) => (
                  <Badge key={industry} className="bg-indigo-100 text-indigo-700">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Career Goals */}
          {userProfile.career_goals && (
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Career Goals</h4>
              <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">
                {userProfile.career_goals}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Explore Your Options</CardTitle>
          <p className="text-slate-600">
            Now that we know your skills, let's dive into personalized tools to accelerate your career.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to={createPageUrl("LearningHub")}>
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-green-50 hover:border-green-300">
                <BookOpen className="w-6 h-6 text-green-600" />
                <span className="font-medium">Learning Paths</span>
                <span className="text-xs text-slate-500">Skill development plans</span>
              </Button>
            </Link>

            <Link to={createPageUrl("ProjectLab")}>
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-purple-50 hover:border-purple-300">
                <Briefcase className="w-6 h-6 text-purple-600" />
                <span className="font-medium">Project Lab</span>
                <span className="text-xs text-slate-500">Hands-on practice</span>
              </Button>
            </Link>
            
            <Link to={createPageUrl("Dashboard")}>
               <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-slate-50 hover:border-slate-300">
                <Compass className="w-6 h-6 text-slate-600" />
                <span className="font-medium">Back to Dashboard</span>
                <span className="text-xs text-slate-500">See your overview</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}