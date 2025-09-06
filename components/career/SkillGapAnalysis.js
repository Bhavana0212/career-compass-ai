import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Target,
  PlusCircle,
  MinusCircle,
  BookOpen
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

export default function SkillGapAnalysis({ career, userProfile }) {
  if (!userProfile?.skills || !career?.required_skills) {
    return null;
  }
  
  const userSkillMap = {};
  userProfile.skills.forEach(skill => {
    userSkillMap[skill.name.toLowerCase()] = {
      beginner: 25,
      intermediate: 50,
      advanced: 75,
      expert: 100
    }[skill.proficiency] || 0;
  });

  const skillComparison = career.required_skills.map(reqSkill => {
    const userLevel = userSkillMap[reqSkill.skill.toLowerCase()] || 0;
    const requiredLevel = {
      beginner: 25,
      intermediate: 50,
      advanced: 75,
      expert: 100
    }[reqSkill.proficiency_needed] || 50;
    
    return {
      skill: reqSkill.skill,
      user: userLevel,
      required: requiredLevel
    };
  });

  const skillsYouHave = skillComparison.filter(s => s.user >= s.required);
  const skillsToDevelop = skillComparison.filter(s => s.user < s.required);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Skill Gap Analysis
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="w-full h-64">
           <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillComparison}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#475569' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Your Skills" dataKey="user" stroke="#818cf8" fill="#818cf8" fillOpacity={0.6} />
              <Radar name="Required" dataKey="required" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-200"></div>
            <span>Your Skills</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span>Required Skills</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-green-600" />
            Skills You Have
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillsYouHave.length > 0 ? skillsYouHave.map((s, i) => (
              <Badge key={i} className="bg-green-100 text-green-700">{s.skill}</Badge>
            )) : <p className="text-sm text-slate-500">None of the required skills match.</p>}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <MinusCircle className="w-4 h-4 text-orange-600" />
            Skills to Develop
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillsToDevelop.length > 0 ? skillsToDevelop.map((s, i) => (
              <Badge key={i} variant="outline" className="border-orange-300 text-orange-700">{s.skill}</Badge>
            )) : <p className="text-sm text-slate-500">Great job! You have all the required skills.</p>}
          </div>
        </div>
        
        {skillsToDevelop.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <Link to={createPageUrl("LearningHub")}>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <BookOpen className="w-4 h-4 mr-2" />
                Build Your Learning Path
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}