
import React, { useState, useEffect } from "react";
import { UserProfile, CareerPath, LearningPath, Project } from "@/entities/all";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Target, 
  BookOpen, 
  Briefcase, 
  MessageSquare, 
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Sparkles
} from "lucide-react";

import WelcomeHero from "../components/dashboard/WelcomeHero";
import QuickStats from "../components/dashboard/QuickStats";
import RecentActivity from "../components/dashboard/RecentActivity";
import NextSteps from "../components/dashboard/NextSteps";
import DemoDataSelector from "../components/dashboard/DemoDataSelector"; // Added DemoDataSelector import

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false); // Added isDemoMode state

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // Load user's career data
      const [profiles, careers, learning, userProjects] = await Promise.all([
        UserProfile.filter({ created_by: currentUser.email }),
        CareerPath.filter({ recommended_for_user: currentUser.id }),
        LearningPath.filter({ created_for_user: currentUser.id }),
        Project.filter({ assigned_to_user: currentUser.id })
      ]);

      setUserProfile(profiles[0] || null);
      setCareerPaths(careers);
      setLearningPaths(learning);
      setProjects(userProjects);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // If there's an error loading real user data, ensure isLoading is still false
      // and allow the DemoDataSelector to show if userProfile is null
    }
    setIsLoading(false);
  };
  
  const handleSelectDemoUser = async (demoUserId) => {
    if (demoUserId === 'priya') {
      setIsLoading(true);
      setIsDemoMode(true);
      
      // Mock data for Priya (Demo)
      const demoUserEmail = 'priya-demo@example.com';
      const mockDemoUserId = 'priya-demo-id-456'; // Use a consistent mock ID for filtering

      const [profiles, careers, learning, userProjects] = await Promise.all([
        UserProfile.filter({ created_by: demoUserEmail }), // Filter by email for user profile
        CareerPath.filter({ 'custom_filter': `recommended_for_user = "${mockDemoUserId}"` }),
        LearningPath.filter({ 'custom_filter': `created_for_user = "${mockDemoUserId}"` }),
        Project.filter({ 'custom_filter': `assigned_to_user = "${mockDemoUserId}"` })
      ]);
      
      setUserProfile(profiles[0] || null);
      setCareerPaths(careers);
      setLearningPaths(learning);
      setProjects(userProjects);
      
      // Set a mock user object for the demo user
      setUser({ full_name: 'Priya (Demo)', email: demoUserEmail, id: mockDemoUserId });

      setIsLoading(false);
    }
  };

  const getCompletionStats = () => {
    const completedLearning = learningPaths.filter(path => path.completion_status === 'completed').length;
    const completedProjects = projects.filter(project => project.completion_status === 'completed').length;
    const totalSkills = userProfile?.skills?.length || 0;
    
    return {
      skillsMapped: totalSkills,
      careersExplored: careerPaths.length,
      learningProgress: learningPaths.length > 0 ? Math.round((completedLearning / learningPaths.length) * 100) : 0,
      projectsCompleted: completedProjects,
      totalProjects: projects.length
    };
  };

  const stats = getCompletionStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-slate-200 rounded-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
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
        <WelcomeHero user={user} userProfile={userProfile} />
        
        {/* Conditionally render DemoDataSelector if not in demo mode and no user profile is found */}
        {!isDemoMode && !userProfile && <DemoDataSelector onSelectDemoUser={handleSelectDemoUser} />}

        <QuickStats stats={stats} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RecentActivity 
              careerPaths={careerPaths}
              learningPaths={learningPaths}
              projects={projects}
            />
            
            {/* Recommended Career Paths */}
            {careerPaths.length > 0 && (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Your Top Career Matches
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {careerPaths.slice(0, 3).map((career) => (
                    <div key={career.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{career.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{career.industry}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                            {career.match_score}% match
                          </Badge>
                          <Badge variant="outline" className="text-slate-600">
                            {career.job_outlook?.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <Link to={createPageUrl("CareerDetail", { id: career.id })} className="ml-4">
                        <ArrowRight className="w-5 h-5 text-indigo-600" />
                      </Link>
                    </div>
                  ))}
                  <Link to={createPageUrl("CareerExplorer")}>
                    <Button variant="outline" className="w-full mt-4">
                      Explore All Career Paths
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            <NextSteps userProfile={userProfile} />
            
            {/* Quick Actions */}
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={createPageUrl("SkillAssessment")}>
                  <Button variant="ghost" className="w-full justify-start h-12 hover:bg-indigo-50">
                    <Target className="w-5 h-5 mr-3 text-indigo-600" />
                    Update Skills Assessment
                  </Button>
                </Link>
                <Link to={createPageUrl("LearningHub")}>
                  <Button variant="ghost" className="w-full justify-start h-12 hover:bg-green-50">
                    <BookOpen className="w-5 h-5 mr-3 text-green-600" />
                    Browse Learning Paths
                  </Button>
                </Link>
                <Link to={createPageUrl("ProjectLab")}>
                  <Button variant="ghost" className="w-full justify-start h-12 hover:bg-purple-50">
                    <Briefcase className="w-5 h-5 mr-3 text-purple-600" />
                    Start New Project
                  </Button>
                </Link>
                <Link to={createPageUrl("InterviewPrep")}>
                  <Button variant="ghost" className="w-full justify-start h-12 hover:bg-orange-50">
                    <MessageSquare className="w-5 h-5 mr-3 text-orange-600" />
                    Practice Interviews
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
