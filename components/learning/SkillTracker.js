import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";

export default function SkillTracker({ path, userProfile }) {
  if (!userProfile?.skills || !path?.skill_gaps) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Skill Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-slate-500">Complete skill assessment to track progress</p>
        </CardContent>
      </Card>
    );
  }

  const userSkillMap = {};
  userProfile.skills.forEach(skill => {
    userSkillMap[skill.name.toLowerCase()] = skill.proficiency;
  });

  const skillProgress = path.skill_gaps.map(skillGap => {
    const currentLevel = userSkillMap[skillGap.toLowerCase()];
    const hasSkill = !!currentLevel;
    
    return {
      name: skillGap,
      currentLevel,
      hasSkill,
      progress: hasSkill ? 
        ({ beginner: 25, intermediate: 50, advanced: 75, expert: 100 }[currentLevel] || 0) : 0
    };
  });

  const completedSkills = skillProgress.filter(s => s.progress >= 75).length;
  const overallProgress = Math.round((completedSkills / skillProgress.length) * 100);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-green-600" />
          Skill Progress
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Overall Progress</span>
            <span className="font-semibold text-green-600">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-700">Completed</span>
            </div>
            <p className="text-lg font-bold text-green-800">{completedSkills}</p>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-orange-700">In Progress</span>
            </div>
            <p className="text-lg font-bold text-orange-800">
              {skillProgress.length - completedSkills}
            </p>
          </div>
        </div>
        
        {/* Individual Skills */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-700">Skill Breakdown</h4>
          {skillProgress.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                <div className="flex items-center gap-2">
                  {skill.hasSkill ? (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      {skill.currentLevel}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-slate-500">
                      Not learned
                    </Badge>
                  )}
                  {skill.progress >= 75 && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </div>
              <Progress value={skill.progress} className="h-1" />
            </div>
          ))}
        </div>
        
        {/* Next Steps */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Next Priority</span>
          </div>
          {skillProgress.filter(s => !s.hasSkill).slice(0, 2).map((skill, index) => (
            <div key={index} className="text-sm text-slate-600 mb-1">
              • Start learning {skill.name}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}