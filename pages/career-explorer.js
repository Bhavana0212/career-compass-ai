import React, { useState, useEffect } from "react";
import { CareerPath, UserProfile } from "@/entities/all";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Compass, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Star,
  Filter,
  Sparkles,
  Target,
  BookOpen,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import CareerCard from "../components/career/CareerCard";
import CareerDetails from "../components/career/CareerDetails";
import SkillGapAnalysis from "../components/career/SkillGapAnalysis";
import CareerFilters from "../components/career/CareerFilters";

export default function CareerExplorer() {
  const [careers, setCareers] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    industry: "all",
    experience: "all", 
    outlook: "all",
    salary: "all"
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const profiles = await UserProfile.filter({ created_by: user.email });
      const userCareers = await CareerPath.filter({ recommended_for_user: user.id });
      
      setUserProfile(profiles[0] || null);
      setCareers(userCareers);
      if (userCareers.length > 0) {
        setSelectedCareer(userCareers[0]);
      }
    } catch (error) {
      console.error("Error loading career data:", error);
    }
    setIsLoading(false);
  };

  const generateNewRecommendations = async () => {
    if (!userProfile) return;
    
    setIsGenerating(true);
    try {
      const skillsList = userProfile.skills?.map(s => s.name).join(", ") || "";
      const interests = userProfile.career_interests?.join(", ") || "";
      const industries = userProfile.preferred_industries?.join(", ") || "";

      const prompt = `
        Based on this student profile:
        - Skills: ${skillsList}
        - Interests: ${interests}
        - Preferred Industries: ${industries}
        - Experience Level: ${userProfile.experience_level}
        - Career Goals: ${userProfile.career_goals}
        
        Generate 5 additional career recommendations with:
        1. Realistic job titles and descriptions
        2. Required skills with importance levels
        3. Salary ranges (USD)
        4. Job market outlook
        5. Career progression paths
        6. Match scores based on student's profile
        
        Focus on emerging roles and growth opportunities in 2024-2025.
      `;

      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            careers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  industry: { type: "string" },
                  description: { type: "string" },
                  required_skills: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        skill: { type: "string" },
                        importance: { type: "string" },
                        proficiency_needed: { type: "string" }
                      }
                    }
                  },
                  salary_range: {
                    type: "object",
                    properties: {
                      min: { type: "number" },
                      max: { type: "number" },
                      currency: { type: "string" }
                    }
                  },
                  job_outlook: { type: "string" },
                  typical_progression: {
                    type: "array",
                    items: { type: "string" }
                  },
                  match_score: { type: "number" }
                }
              }
            }
          }
        }
      });

      // Save new careers to database
      const user = await User.me();
      const newCareers = [];
      
      for (const career of result.careers || []) {
        const savedCareer = await CareerPath.create({
          ...career,
          recommended_for_user: user.id
        });
        newCareers.push(savedCareer);
      }

      setCareers(prev => [...prev, ...newCareers]);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    }
    setIsGenerating(false);
  };

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         career.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = filters.industry === "all" || career.industry === filters.industry;
    const matchesOutlook = filters.outlook === "all" || career.job_outlook === filters.outlook;
    
    return matchesSearch && matchesIndustry && matchesOutlook;
  }).sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

  const getSkillMatch = (career) => {
    if (!userProfile?.skills) return 0;
    
    const userSkillNames = userProfile.skills.map(s => s.name.toLowerCase());
    const requiredSkills = career.required_skills || [];
    const matches = requiredSkills.filter(req => 
      userSkillNames.includes(req.skill.toLowerCase())
    );
    
    return requiredSkills.length > 0 ? Math.round((matches.length / requiredSkills.length) * 100) : 0;
  };

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
            <Compass className="w-8 h-8 text-indigo-600" />
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Career Explorer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover career paths that match your skills and interests. Get personalized recommendations powered by AI.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link to={createPageUrl("SkillAssessment")}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous: Skills
            </Button>
          </Link>
          <Link to={createPageUrl("LearningHub")}>
            <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
              Next: Learning Hub
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search careers or industries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={generateNewRecommendations}
                disabled={isGenerating || !userProfile}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get More Recommendations
                  </>
                )}
              </Button>
            </div>
            
            <CareerFilters filters={filters} onFiltersChange={setFilters} />
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Career Cards */}
          <div className="lg:col-span-2 space-y-6">
            {filteredCareers.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Compass className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No careers found</h3>
                  <p className="text-slate-500 mb-4">
                    {!userProfile 
                      ? "Complete your skill assessment to get personalized recommendations" 
                      : "Try adjusting your search or filters"
                    }
                  </p>
                  {!userProfile && (
                     <Link to={createPageUrl("SkillAssessment")}>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                          Complete Skill Assessment
                        </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredCareers.map((career) => (
                  <CareerCard
                    key={career.id}
                    career={career}
                    skillMatch={getSkillMatch(career)}
                    onSelect={setSelectedCareer}
                    isSelected={selectedCareer?.id === career.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedCareer ? (
              <>
                <CareerDetails career={selectedCareer} />
                <SkillGapAnalysis career={selectedCareer} userProfile={userProfile} />
              </>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    Career Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <p className="text-slate-500 mb-4">
                    Select a career to see detailed information and skill gap analysis
                  </p>
                  <div className="space-y-3 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>Match score analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Job market outlook</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Skill gap analysis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}