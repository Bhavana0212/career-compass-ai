import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, Compass } from "lucide-react";

export default function WelcomeHero({ user, userProfile }) {
  const userName = user?.full_name?.split(' ')[0] || 'Student';
  const hasProfile = userProfile && userProfile.skills?.length > 0;

  return (
    <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 border-none shadow-2xl overflow-hidden">
      <CardContent className="p-8 md:p-12 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Compass className="w-8 h-8 text-white" />
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Welcome back, {userName}!
          </h1>
          
          {!hasProfile ? (
            <div>
              <p className="text-indigo-100 text-lg mb-6 max-w-2xl">
                Ready to discover your perfect career path? Let's start by mapping your skills and interests to unlock personalized career recommendations.
              </p>
              <Link to={createPageUrl("SkillAssessment")}>
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-8">
                  Start Your Career Journey
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-indigo-100 text-lg mb-6 max-w-2xl">
                Great progress on your career journey! You've mapped {userProfile.skills?.length || 0} skills. 
                Continue exploring personalized recommendations and building your professional profile.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl("CareerExplorer")}>
                  <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold">
                    Explore Careers
                  </Button>
                </Link>
                <Link to={createPageUrl("LearningHub")}>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/90 hover:text-indigo-700 transition-colors duration-300">
                    View Learning Paths
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}