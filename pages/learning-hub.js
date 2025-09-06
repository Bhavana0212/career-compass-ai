import React, { useState, useEffect } from "react";
import { LearningPath, UserProfile, CareerPath } from "@/entities/all";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Target, 
  Clock, 
  Star,
  ExternalLink,
  Sparkles,
  CheckCircle,
  Play,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import LearningPathCard from "../components/learning/LearningPathCard";
import CourseDetails from "../components/learning/CourseDetails";
import SkillTracker from "../components/learning/SkillTracker";

export default function LearningHub() {
  const [learningPaths, setLearningPaths] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const [profiles, paths, careers] = await Promise.all([
        UserProfile.filter({ created_by: user.email }),
        LearningPath.filter({ created_for_user: user.id }),
        CareerPath.filter({ recommended_for_user: user.id })
      ]);

      setUserProfile(profiles[0] || null);
      setLearningPaths(paths);
      setCareerPaths(careers);
      if (paths.length > 0) {
        setSelectedPath(paths[0]);
      }
    } catch (error) {
      console.error("Error loading learning data:", error);
    }
    setIsLoading(false);
  };

  const generateLearningPath = async (targetCareer = null) => {
    if (!userProfile) return;
    
    setIsGenerating(true);
    try {
      const userSkills = userProfile.skills?.map(s => `${s.name} (${s.proficiency})`).join(", ") || "";
      const career = targetCareer || careerPaths[0];
      const requiredSkills = career?.required_skills?.map(s => `${s.skill} (${s.proficiency_needed})`).join(", ") || "";

      const prompt = `
        Create a personalized learning path for this student:
        
        Current Skills: ${userSkills}
        Target Career: ${career?.title || "General Tech Career"}
        Required Skills: ${requiredSkills}
        Experience Level: ${userProfile.experience_level}
        Career Interests: ${userProfile.career_interests?.join(", ") || ""}
        
        Generate a comprehensive learning plan with:
        1. Specific skill gaps to address
        2. Curated online courses (real courses from Coursera, edX, Udemy, Khan Academy, freeCodeCamp, etc.)
        3. Estimated duration for each course
        4. Difficulty levels and prerequisites
        5. Priority order (1-10 scale)
        6. Mix of free and paid resources
        
        Focus on practical, hands-on learning that builds job-ready skills.
      `;

      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            target_career: { type: "string" },
            skill_gaps: {
              type: "array",
              items: { type: "string" }
            },
            courses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  provider: { type: "string" },
                  url: { type: "string" },
                  duration: { type: "string" },
                  difficulty: { type: "string" },
                  cost: { type: "string" },
                  priority: { type: "number" }
                }
              }
            },
            estimated_duration: { type: "string" },
            difficulty_level: { type: "string" }
          }
        }
      });

      const user = await User.me();
      const newPath = await LearningPath.create({
        ...result,
        created_for_user: user.id,
        completion_status: "not_started"
      });

      setLearningPaths(prev => [newPath, ...prev]);
    } catch (error) {
      console.error("Error generating learning path:", error);
    }
    setIsGenerating(false);
  };

  const updatePathStatus = async (pathId, status) => {
    await LearningPath.update(pathId, { completion_status: status });
    setLearningPaths(prev => 
      prev.map(path => 
        path.id === pathId ? { ...path, completion_status: status } : path
      )
    );
  };

  const filteredPaths = learningPaths.filter(path => {
    if (activeTab === "all") return true;
    return path.completion_status === activeTab;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-slate-200 rounded-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-slate-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-green-600" />
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Learning Hub
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Personalized learning paths to bridge your skill gaps and accelerate your career growth
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link to={createPageUrl("CareerExplorer")}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous: Careers
            </Button>
          </Link>
          <Link to={createPageUrl("ProjectLab")}>
            <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
              Next: Project Lab
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>


        {/* Action Bar */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Ready to level up your skills?</h3>
                <p className="text-slate-600">Generate AI-powered learning paths based on your career goals</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {careerPaths.slice(0, 2).map((career) => (
                  <Button
                    key={career.id}
                    variant="outline"
                    size="sm"
                    onClick={() => generateLearningPath(career)}
                    disabled={isGenerating}
                    className="hover:bg-green-50 hover:border-green-300"
                  >
                    Learn for {career.title}
                  </Button>
                ))}
                <Button
                  onClick={() => generateLearningPath()}
                  disabled={isGenerating || !userProfile}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate General Path
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Paths</TabsTrigger>
            <TabsTrigger value="not_started">Not Started</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Learning Paths */}
              <div className="lg:col-span-2 space-y-6">
                {filteredPaths.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
                    <CardContent className="p-12 text-center">
                      <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-700 mb-2">
                        {activeTab === "all" ? "No learning paths yet" : `No ${activeTab.replace('_', ' ')} paths`}
                      </h3>
                      <p className="text-slate-500 mb-4">
                        {!userProfile 
                          ? "Complete your skill assessment first to get personalized learning recommendations" 
                          : "Generate your first AI-powered learning path to start skill development"
                        }
                      </p>
                      {userProfile && (
                        <Button 
                          onClick={() => generateLearningPath()}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={isGenerating}
                        >
                          Create Learning Path
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  filteredPaths.map((path) => (
                    <LearningPathCard
                      key={path.id}
                      path={path}
                      onSelect={setSelectedPath}
                      onUpdateStatus={updatePathStatus}
                      isSelected={selectedPath?.id === path.id}
                    />
                  ))
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {selectedPath ? (
                  <>
                    <CourseDetails path={selectedPath} />
                    <SkillTracker path={selectedPath} userProfile={userProfile} />
                  </>
                ) : (
                  <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg sticky top-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-600" />
                        Learning Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                      <p className="text-slate-500 mb-4">
                        Select a learning path to see course details and track progress
                      </p>
                      <div className="space-y-3 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          <span>Course recommendations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Duration estimates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Progress tracking</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}