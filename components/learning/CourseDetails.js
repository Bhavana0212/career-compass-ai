import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  ExternalLink,
  Star,
  DollarSign,
  Play
} from "lucide-react";

export default function CourseDetails({ path }) {
  const getCostColor = (cost) => ({
    free: "bg-green-100 text-green-700",
    paid: "bg-orange-100 text-orange-700",
    freemium: "bg-blue-100 text-blue-700"
  }[cost] || "bg-gray-100 text-gray-700");

  const getDifficultyIcon = (difficulty) => {
    const colors = {
      beginner: "text-green-500",
      intermediate: "text-yellow-500",
      advanced: "text-red-500"
    };
    return colors[difficulty] || "text-gray-500";
  };

  const sortedCourses = path.courses?.sort((a, b) => (a.priority || 5) - (b.priority || 5)) || [];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <BookOpen className="w-6 h-6 text-green-600" />
          {path.title}
        </CardTitle>
        <p className="text-slate-600 text-base">For: {path.target_career}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-2 gap-4 text-sm p-4 bg-slate-50 rounded-xl">
          <div className="flex flex-col items-center">
            <span className="text-slate-500 font-medium">Courses</span>
            <span className="font-bold text-2xl text-slate-800">{path.courses?.length || 0}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-slate-500 font-medium">Est. Duration</span>
            <span className="font-bold text-xl text-slate-800">{path.estimated_duration}</span>
          </div>
        </div>

        {/* Skill Gaps */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-2">Skills You'll Build</h4>
          <div className="flex flex-wrap gap-2">
            {path.skill_gaps?.map((skill, index) => (
              <Badge key={index} className="bg-green-100 text-green-700 text-base py-1 px-3">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Course List as Steps */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-3 text-lg">Your Step-by-Step Plan</h4>
          <div className="relative space-y-6 pl-6">
             <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-200" aria-hidden="true"></div>
            {sortedCourses.map((course, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[27px] top-1 w-6 h-6 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-600">{index + 1}</span>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-900 mb-1">{course.name}</h5>
                      <p className="text-sm text-slate-600">{course.provider}</p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className={`w-4 h-4 ${course.priority <= 3 ? 'text-yellow-500' : 'text-gray-400'}`} />
                      Priority {course.priority}/10
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center flex-wrap gap-2">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                      <Badge className={`${getCostColor(course.cost)} capitalize`}>
                        <DollarSign className="w-3 h-3 mr-1" />
                        {course.cost}
                      </Badge>
                      <Badge variant="outline" className={`text-xs capitalize ${getDifficultyIcon(course.difficulty)}`}>
                        {course.difficulty}
                      </Badge>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => window.open(course.url, '_blank')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ExternalLink className="w-3 h-3 mr-1.5" />
                      Go to Course
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}